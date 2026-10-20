import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  WATER_LEVEL,
  WATER_LEVEL_LOW,
  WATER_LEVEL_HIGH,
  WATER_RES,
  STREAM_Z_START,
  STREAM_Z_END,
  COLORS,
  SceneState,
  TideLevel,
} from './constants';
import { getStreamCenter, getStreamHalfWidth, getWaterSurfaceHeight } from './terrain';

export interface WaterSystem {
  group: THREE.Group;
  mesh: THREE.Mesh;
  update(dt: number, elapsed: number, state: SceneState): void;
  addRipple(worldX: number, worldZ: number, strength: number): void;
  setTide(tide: TideLevel, smooth?: boolean): void;
  getWaterLevel(): number;
  dispose(): void;
}

const RIPPLE_BOUNDS = new THREE.Vector4(-3.5, 0.7, 7.5, 8.2);
const MAX_ANALYTICAL_RIPPLES = 20;

// GPU Ping-Pong Simulation Shaders
const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const simulationFragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uTexelSize;
  uniform float uWaveSpeedSq;
  uniform float uDamping;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    float current = info.r;
    float previous = info.g;

    float left   = texture2D(uTexture, vUv - vec2(uTexelSize.x, 0.0)).r;
    float right  = texture2D(uTexture, vUv + vec2(uTexelSize.x, 0.0)).r;
    float bottom = texture2D(uTexture, vUv - vec2(0.0, uTexelSize.y)).r;
    float top    = texture2D(uTexture, vUv + vec2(0.0, uTexelSize.y)).r;

    float next = (2.0 * current - previous) + uWaveSpeedSq * (left + right + bottom + top - 4.0 * current);
    next *= uDamping;
    next = clamp(next, -0.6, 0.6);

    gl_FragColor = vec4(next, current, 0.0, 1.0);
  }
`;

const dropFragmentShader = `
  precision highp float;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, uCenter);
    float drop = max(0.0, 1.0 - dist / uRadius);
    drop = 0.5 - 0.5 * cos(drop * 3.14159265);
    gl_FragColor = vec4(drop * uStrength, 0.0, 0.0, 1.0);
  }
`;

const waterVertexShader = `
  attribute float aTerrainHeight;
  attribute float aIsFrontCut;

  uniform float uTime;
  uniform float uWaterLevel;
  uniform sampler2D uRippleMap;
  uniform float uUseGpuRipples;
  uniform vec4 uRippleBounds;
  uniform float uFlowSpeed;
  uniform float uWindStrength;
  uniform vec4 uAnalyticalRipples[20];
  uniform int uAnalyticalRippleCount;

  varying vec3 vWorldPosition;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec2 vRippleUv;
  varying float vDepth;
  varying vec3 vNormal;
  varying float vIsFrontCut;

  float computeAnalyticalRipples(vec2 worldXZ, float time) {
    float total = 0.0;
    for (int i = 0; i < 20; i++) {
      if (i >= uAnalyticalRippleCount) break;
      vec4 rip = uAnalyticalRipples[i];
      float age = time - rip.z;
      if (age > 0.0 && age < 3.2) {
        float dist = distance(worldXZ, rip.xy);
        float waveDist = age * 2.0;
        float diff = dist - waveDist;
        float env = exp(-diff * diff * 12.0) * exp(-age * 1.4) * rip.w;
        total += sin(diff * 14.0) * env * 0.03;
      }
    }
    return total;
  }

  void main() {
    vUv = uv;
    vIsFrontCut = aIsFrontCut;

    vec3 pos = position;
    vec4 initialWorld = modelMatrix * vec4(pos, 1.0);

    vec2 ripUv = (initialWorld.xz - uRippleBounds.xy) / (uRippleBounds.zw - uRippleBounds.xy);
    vRippleUv = ripUv;

    float depth = max(0.0, initialWorld.y - aTerrainHeight);
    vDepth = depth;
    float shoreDamping = clamp(depth * 8.0, 0.0, 1.0);

    // Only apply surface waves if not on the vertical front cut skirt
    if (aIsFrontCut < 0.5) {
      float ripDisp = 0.0;
      if (uUseGpuRipples > 0.5) {
        if (ripUv.x >= 0.0 && ripUv.x <= 1.0 && ripUv.y >= 0.0 && ripUv.y <= 1.0) {
          ripDisp = texture2D(uRippleMap, ripUv).r * 0.07;
        }
      } else {
        ripDisp = computeAnalyticalRipples(initialWorld.xz, uTime);
      }

      float flowTime = uTime * (0.8 + uFlowSpeed * 0.6);
      float w1 = sin(initialWorld.x * 2.8 + initialWorld.z * 1.6 + flowTime) * 0.010;
      float w2 = cos(initialWorld.x * 4.4 - initialWorld.z * 2.2 + flowTime * 1.2) * 0.007;
      float gentleWaves = (w1 + w2) * (0.5 + uWindStrength * 0.6);

      pos.y += (ripDisp + gentleWaves) * shoreDamping;
    }

    vec4 finalWorld = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = finalWorld.xyz;
    vViewDir = normalize(cameraPosition - finalWorld.xyz);
    vNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * finalWorld;
  }
`;

const waterFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform float uSunIntensity;
  uniform float uWaterLevel;
  uniform sampler2D uRippleMap;
  uniform float uUseGpuRipples;
  uniform vec4 uRippleBounds;
  uniform float uFlowSpeed;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uFoamColor;
  uniform vec3 uSkyHorizonColor;
  uniform vec3 uSkyZenithColor;
  uniform float uWindStrength;
  uniform vec4 uAnalyticalRipples[20];
  uniform int uAnalyticalRippleCount;

  varying vec3 vWorldPosition;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec2 vRippleUv;
  varying float vDepth;
  varying vec3 vNormal;
  varying float vIsFrontCut;

  float computeAnalyticalRipples(vec2 worldXZ, float time) {
    float total = 0.0;
    for (int i = 0; i < 20; i++) {
      if (i >= uAnalyticalRippleCount) break;
      vec4 rip = uAnalyticalRipples[i];
      float age = time - rip.z;
      if (age > 0.0 && age < 3.2) {
        float dist = distance(worldXZ, rip.xy);
        float waveDist = age * 2.0;
        float diff = dist - waveDist;
        float env = exp(-diff * diff * 12.0) * exp(-age * 1.4) * rip.w;
        total += sin(diff * 14.0) * env * 0.03;
      }
    }
    return total;
  }

  vec3 getWaterNormal() {
    if (vIsFrontCut > 0.5) {
      return vec3(0.0, 0.0, 1.0); // Clean flat vertical front cut normal
    }

    vec3 norm = vec3(0.0, 1.0, 0.0);

    if (uUseGpuRipples > 0.5) {
      vec2 texel = vec2(1.0 / 256.0);
      vec2 uvClamped = clamp(vRippleUv, texel, vec2(1.0) - texel);
      float hL = texture2D(uRippleMap, uvClamped - vec2(texel.x, 0.0)).r;
      float hR = texture2D(uRippleMap, uvClamped + vec2(texel.x, 0.0)).r;
      float hD = texture2D(uRippleMap, uvClamped - vec2(0.0, texel.y)).r;
      float hU = texture2D(uRippleMap, uvClamped + vec2(0.0, texel.y)).r;
      norm += vec3((hL - hR) * 1.5, 0.0, (hD - hU) * 1.5);
    } else {
      float eps = 0.06;
      float hX1 = computeAnalyticalRipples(vWorldPosition.xz + vec2(eps, 0.0), uTime);
      float hX0 = computeAnalyticalRipples(vWorldPosition.xz - vec2(eps, 0.0), uTime);
      float hZ1 = computeAnalyticalRipples(vWorldPosition.xz + vec2(0.0, eps), uTime);
      float hZ0 = computeAnalyticalRipples(vWorldPosition.xz - vec2(0.0, eps), uTime);
      norm += vec3((hX0 - hX1) / (2.0 * eps), 0.0, (hZ0 - hZ1) / (2.0 * eps)) * 1.0;
    }

    // Gentle downstream stream ripples
    float flowZ = uTime * uFlowSpeed * 1.4;
    float f1 = sin(vWorldPosition.x * 3.5 + vWorldPosition.z * 1.8 + flowZ) * 0.035;
    float f2 = cos(vWorldPosition.x * 5.2 - vWorldPosition.z * 2.4 + flowZ * 1.2) * 0.025;
    norm.x += (f1 - f2) * (0.5 + uWindStrength * 0.5);
    norm.z += (f1 + f2) * (0.5 + uWindStrength * 0.5);

    return normalize(norm);
  }

  void main() {
    float depth = vDepth;
    if (depth < 0.001) discard;

    vec3 N = getWaterNormal();
    vec3 V = normalize(vViewDir);

    // 1. Crystal mountain water: shallow is luminous turquoise, deepens into teal
    float depthFactor = clamp(depth / 0.28, 0.0, 1.0);
    vec3 waterColor = mix(uWaterColor, uDeepColor, smoothstep(0.10, 0.85, depthFactor));

    // 2. Schlick Fresnel reflection
    float F0 = 0.025;
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 4.5);

    vec3 R = reflect(-V, N);
    vec3 skyColor = mix(uSkyHorizonColor, uSkyZenithColor, clamp(R.y * 0.65 + 0.35, 0.0, 1.0));
    vec3 surfaceColor = mix(waterColor, skyColor, fresnel * 0.40);

    // 3. Sun specular sparkles
    vec3 L = normalize(uSunDirection);
    vec3 H = normalize(L + V);
    float NdotH = max(dot(N, H), 0.0);
    float specular = pow(NdotH, 48.0);
    vec3 spec = uSunColor * specular * uSunIntensity * 0.55;
    surfaceColor += spec;

    // 4. Subtle, delicate foam: at upstream cascade and rapids (z in [-0.8, 1.2])
    float foam = 0.0;
    if (vWorldPosition.z < 1.3 && vIsFrontCut < 0.5) {
      float cascadeFactor = smoothstep(1.2, 0.3, vWorldPosition.z) * smoothstep(-1.2, -0.1, vWorldPosition.z);
      float rapidNoise = sin(vWorldPosition.x * 16.0 + uTime * 5.0) * cos(vWorldPosition.z * 18.0 - uTime * 6.0);
      foam = cascadeFactor * smoothstep(0.38, 0.90, rapidNoise) * 0.35;
    }
    surfaceColor = mix(surfaceColor, uFoamColor, foam);

    // 5. Alpha transparency:
    // Shallow water is clear (alpha ~0.38) revealing bed pebbles & fish.
    // Deep pools fade to ~0.72.
    float alpha = mix(0.38, 0.72, smoothstep(0.01, 0.24, depth));
    alpha = mix(alpha, 0.88, foam);
    alpha *= smoothstep(0.0, 0.02, depth);

    gl_FragColor = vec4(surfaceColor, alpha);
  }
`;

/**
 * Builds the stream surface geometry + vertical front cross-section skirt.
 */
function createStreamGeometry(getHeightAt: (x: number, z: number) => number): THREE.BufferGeometry {
  const segmentsZ = 140;
  const segmentsX = 54;
  const numSurfaceVerts = (segmentsZ + 1) * (segmentsX + 1);

  // Front cut skirt vertices at z = 8.0: (segmentsX + 1) columns x 2 rows
  const numFrontVerts = (segmentsX + 1) * 2;
  const totalVerts = numSurfaceVerts + numFrontVerts;

  const positions = new Float32Array(totalVerts * 3);
  const uvs = new Float32Array(totalVerts * 2);
  const terrainHeights = new Float32Array(totalVerts);
  const isFrontCut = new Float32Array(totalVerts);
  const indices: number[] = [];

  const zStart = -7.5; // Originates in rear mountain gorge
  const zEnd = DIORAMA_DEPTH * 0.5; // 8.0 (front edge)

  // 1. Surface grid
  for (let iz = 0; iz <= segmentsZ; iz++) {
    const tZ = iz / segmentsZ;
    const z = zStart + tZ * (zEnd - zStart);
    const centerX = getStreamCenter(z);
    const halfWidth = getStreamHalfWidth(z) * 1.15;
    const waterSurfaceY = getWaterSurfaceHeight(z);

    for (let ix = 0; ix <= segmentsX; ix++) {
      const tX = ix / segmentsX;
      const x = centerX - halfWidth + tX * (halfWidth * 2.0);
      // Local y relative to mesh.position.y (which is WATER_LEVEL)
      const y = waterSurfaceY - WATER_LEVEL;

      const idx = iz * (segmentsX + 1) + ix;
      positions[idx * 3 + 0] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;

      uvs[idx * 2 + 0] = tX;
      uvs[idx * 2 + 1] = tZ;

      terrainHeights[idx] = getHeightAt(x, z);
      isFrontCut[idx] = 0.0;
    }
  }

  for (let iz = 0; iz < segmentsZ; iz++) {
    const tZ = iz / segmentsZ;
    const z = zStart + tZ * (zEnd - zStart);
    const waterY = getWaterSurfaceHeight(z);

    for (let ix = 0; ix < segmentsX; ix++) {
      const i0 = iz * (segmentsX + 1) + ix;
      const i1 = iz * (segmentsX + 1) + (ix + 1);
      const i2 = (iz + 1) * (segmentsX + 1) + ix;
      const i3 = (iz + 1) * (segmentsX + 1) + (ix + 1);

      const h0 = terrainHeights[i0];
      const h1 = terrainHeights[i1];
      const h2 = terrainHeights[i2];
      const h3 = terrainHeights[i3];

      const minH = Math.min(h0, h1, h2, h3);
      if (minH <= waterY + 0.06) {
        indices.push(i0, i2, i1);
        indices.push(i1, i2, i3);
      }
    }
  }

  // 2. Vertical Front Cross-Section Skirt at z = 8.0
  // Extends from water surface Y = 0.0 down to riverbed profile Y = -(WATER_LEVEL - bedY)
  const frontBaseIdx = numSurfaceVerts;
  const lastZRow = segmentsZ * (segmentsX + 1);

  for (let ix = 0; ix <= segmentsX; ix++) {
    const surfIdx = lastZRow + ix;
    const x = positions[surfIdx * 3 + 0];
    const z = zEnd;
    const bedH = terrainHeights[surfIdx];
    const depthBelowSurface = Math.max(0.0, WATER_LEVEL - bedH);

    // Top vertex of front skirt (at water surface)
    const topIdx = frontBaseIdx + ix * 2 + 0;
    positions[topIdx * 3 + 0] = x;
    positions[topIdx * 3 + 1] = 0.0;
    positions[topIdx * 3 + 2] = z;
    uvs[topIdx * 2 + 0] = ix / segmentsX;
    uvs[topIdx * 2 + 1] = 1.0;
    terrainHeights[topIdx] = bedH;
    isFrontCut[topIdx] = 1.0;

    // Bottom vertex of front skirt (at riverbed)
    const botIdx = frontBaseIdx + ix * 2 + 1;
    positions[botIdx * 3 + 0] = x;
    positions[botIdx * 3 + 1] = -depthBelowSurface;
    positions[botIdx * 3 + 2] = z;
    uvs[botIdx * 2 + 0] = ix / segmentsX;
    uvs[botIdx * 2 + 1] = 0.0;
    terrainHeights[botIdx] = bedH;
    isFrontCut[botIdx] = 1.0;
  }

  for (let ix = 0; ix < segmentsX; ix++) {
    const t0 = frontBaseIdx + ix * 2 + 0;
    const b0 = frontBaseIdx + ix * 2 + 1;
    const t1 = frontBaseIdx + (ix + 1) * 2 + 0;
    const b1 = frontBaseIdx + (ix + 1) * 2 + 1;

    // Only draw quads where water exists
    if (terrainHeights[t0] < WATER_LEVEL || terrainHeights[t1] < WATER_LEVEL) {
      indices.push(t0, b0, t1);
      indices.push(t1, b0, b1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setAttribute('aTerrainHeight', new THREE.BufferAttribute(terrainHeights, 1));
  geo.setAttribute('aIsFrontCut', new THREE.BufferAttribute(isFrontCut, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function createWater(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  getHeightAt: (x: number, z: number) => number
): WaterSystem {
  const group = new THREE.Group();
  group.name = 'WaterSystem';

  let currentWaterLevel = WATER_LEVEL;
  let targetWaterLevel = WATER_LEVEL;
  let tideTransition = 1.0;
  let startWaterLevel = WATER_LEVEL;
  const TIDE_DURATION = 1.8;

  interface PendingRipple {
    uv: THREE.Vector2;
    radius: number;
    strength: number;
  }
  const pendingRipples: PendingRipple[] = [];

  interface AnalyticalRipple {
    x: number;
    z: number;
    startTime: number;
    strength: number;
  }
  const analyticalRipples: AnalyticalRipple[] = [];
  for (let i = 0; i < MAX_ANALYTICAL_RIPPLES; i++) {
    analyticalRipples.push({ x: 0, z: 0, startTime: -100.0, strength: 0 });
  }
  let analyticalIdx = 0;
  const analyticalArray = new Float32Array(MAX_ANALYTICAL_RIPPLES * 4);

  const geometry = createStreamGeometry(getHeightAt);

  const isWebGL2 = !!renderer.capabilities.isWebGL2;
  let gpuSimulationSupported = true;

  const rtType = isWebGL2 ? THREE.HalfFloatType : THREE.UnsignedByteType;
  const rtOptions: THREE.RenderTargetOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: rtType,
    depthBuffer: false,
    stencilBuffer: false,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  };

  let currentRT = new THREE.WebGLRenderTarget(WATER_RES, WATER_RES, rtOptions);
  let nextRT = new THREE.WebGLRenderTarget(WATER_RES, WATER_RES, rtOptions);

  const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const simGeometry = new THREE.PlaneGeometry(2, 2);

  const simMaterial = new THREE.ShaderMaterial({
    vertexShader: simulationVertexShader,
    fragmentShader: simulationFragmentShader,
    uniforms: {
      uTexture: { value: null },
      uTexelSize: { value: new THREE.Vector2(1.0 / WATER_RES, 1.0 / WATER_RES) },
      uWaveSpeedSq: { value: 0.22 },
      uDamping: { value: 0.992 },
    },
    depthTest: false,
    depthWrite: false,
  });

  const simScene = new THREE.Scene();
  const simQuad = new THREE.Mesh(simGeometry, simMaterial);
  simScene.add(simQuad);

  const dropMaterial = new THREE.ShaderMaterial({
    vertexShader: simulationVertexShader,
    fragmentShader: dropFragmentShader,
    uniforms: {
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.035 },
      uStrength: { value: 0.45 },
    },
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const dropScene = new THREE.Scene();
  const dropQuad = new THREE.Mesh(simGeometry, dropMaterial);
  dropScene.add(dropQuad);

  try {
    const prevRT = renderer.getRenderTarget();
    renderer.setRenderTarget(currentRT);
    renderer.clearColor();
    renderer.setRenderTarget(nextRT);
    renderer.clearColor();
    renderer.setRenderTarget(prevRT);
  } catch (err) {
    console.warn('Analytical ripple fallback', err);
    gpuSimulationSupported = false;
  }

  const waterUniforms = {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
    uSunColor: { value: new THREE.Color(1.0, 0.96, 0.90) },
    uSunIntensity: { value: 1.0 },
    uWaterLevel: { value: currentWaterLevel },
    uRippleMap: { value: currentRT.texture },
    uUseGpuRipples: { value: gpuSimulationSupported ? 1.0 : 0.0 },
    uRippleBounds: { value: RIPPLE_BOUNDS.clone() },
    uFlowSpeed: { value: 0.5 },
    uWaterColor: { value: COLORS.water.shallow.clone() },
    uDeepColor: { value: COLORS.water.deep.clone() },
    uFoamColor: { value: COLORS.water.foam.clone() },
    uSkyHorizonColor: { value: new THREE.Color(0xf6f0e4) },
    uSkyZenithColor: { value: new THREE.Color(0x82bad4) },
    uWindStrength: { value: 0.3 },
    uAnalyticalRipples: { value: analyticalArray },
    uAnalyticalRippleCount: { value: MAX_ANALYTICAL_RIPPLES },
  };

  const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: waterUniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  });

  const mesh = new THREE.Mesh(geometry, waterMaterial);
  mesh.name = 'WaterSurfaceMesh';
  mesh.position.y = currentWaterLevel;
  group.add(mesh);
  scene.add(group);

  let currentElapsed = 0;

  function addRipple(worldX: number, worldZ: number, strength: number): void {
    const uvX = (worldX - RIPPLE_BOUNDS.x) / (RIPPLE_BOUNDS.z - RIPPLE_BOUNDS.x);
    const uvY = (worldZ - RIPPLE_BOUNDS.y) / (RIPPLE_BOUNDS.w - RIPPLE_BOUNDS.y);

    if (uvX >= 0.0 && uvX <= 1.0 && uvY >= 0.0 && uvY <= 1.0) {
      if (gpuSimulationSupported) {
        pendingRipples.push({
          uv: new THREE.Vector2(uvX, uvY),
          radius: 0.038,
          strength: Math.min(0.65, strength),
        });
      } else {
        const idx = analyticalIdx % MAX_ANALYTICAL_RIPPLES;
        analyticalRipples[idx] = {
          x: worldX,
          z: worldZ,
          startTime: currentElapsed,
          strength: Math.min(0.6, strength),
        };
        analyticalIdx++;
      }
    }
  }

  function setTide(tide: TideLevel, smooth: boolean = true): void {
    const target = tide === 'high' ? WATER_LEVEL_HIGH : WATER_LEVEL_LOW;
    if (!smooth) {
      currentWaterLevel = target;
      targetWaterLevel = target;
      tideTransition = 1.0;
      mesh.position.y = target;
      waterUniforms.uWaterLevel.value = target;
    } else {
      startWaterLevel = currentWaterLevel;
      targetWaterLevel = target;
      tideTransition = 0.0;
    }
  }

  function getWaterLevel(): number {
    return currentWaterLevel;
  }

  function update(dt: number, elapsed: number, state: SceneState): void {
    currentElapsed = elapsed;

    if (tideTransition < 1.0) {
      tideTransition = Math.min(1.0, tideTransition + dt / TIDE_DURATION);
      const s = tideTransition * tideTransition * (3.0 - 2.0 * tideTransition);
      currentWaterLevel = THREE.MathUtils.lerp(startWaterLevel, targetWaterLevel, s);
      mesh.position.y = currentWaterLevel;
      waterUniforms.uWaterLevel.value = currentWaterLevel;
    }

    waterUniforms.uTime.value = elapsed;
    waterUniforms.uFlowSpeed.value = state.flowSpeed;
    waterUniforms.uWindStrength.value = state.windStrength;

    if (gpuSimulationSupported) {
      const prevRT = renderer.getRenderTarget();
      const prevAutoClear = renderer.autoClear;
      renderer.autoClear = false;

      while (pendingRipples.length > 0) {
        const rip = pendingRipples.pop()!;
        dropMaterial.uniforms.uCenter.value.copy(rip.uv);
        dropMaterial.uniforms.uRadius.value = rip.radius;
        dropMaterial.uniforms.uStrength.value = rip.strength;

        renderer.setRenderTarget(currentRT);
        renderer.render(dropScene, simCamera);
      }

      simMaterial.uniforms.uTexture.value = currentRT.texture;
      renderer.setRenderTarget(nextRT);
      renderer.render(simScene, simCamera);

      const temp = currentRT;
      currentRT = nextRT;
      nextRT = temp;

      waterUniforms.uRippleMap.value = currentRT.texture;
      renderer.setRenderTarget(prevRT);
      renderer.autoClear = prevAutoClear;
    } else {
      for (let i = 0; i < MAX_ANALYTICAL_RIPPLES; i++) {
        const r = analyticalRipples[i];
        analyticalArray[i * 4 + 0] = r.x;
        analyticalArray[i * 4 + 1] = r.z;
        analyticalArray[i * 4 + 2] = r.startTime;
        analyticalArray[i * 4 + 3] = r.strength;
      }
    }
  }

  return {
    group,
    mesh,
    update,
    addRipple,
    setTide,
    getWaterLevel,
    dispose() {
      geometry.dispose();
      waterMaterial.dispose();
      simGeometry.dispose();
      simMaterial.dispose();
      dropMaterial.dispose();
      currentRT.dispose();
      nextRT.dispose();
      group.removeFromParent();
    },
  };
}
