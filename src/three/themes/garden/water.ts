import * as THREE from 'three';
import {
  WATER_RES,
  COLORS,
  SceneState,
  TideLevel,
} from './constants';
import {
  STREAM_BOUNDS,
  BASE_WATER_LEVEL,
  getStreamCenter,
  getStreamHalfWidth,
  getWaterSurfaceHeight,
  getStreamBedHeight,
  isInWater as checkIsInWater,
  getTideOffset,
} from './streamProfile';
import { isInsideGardenFootprint } from './footprint';

export interface WaterSystem {
  group: THREE.Group;
  mesh: THREE.Mesh;
  update(dt: number, elapsed: number, state: SceneState): void;
  addRipple(worldX: number, worldZ: number, strength: number): void;
  setTide(tide: TideLevel, smooth?: boolean): void;
  getWaterLevel(): number;
  getTideOffset(): number;
  isInWater(x: number, z: number): boolean;
  dispose(): void;
}

// Bounding box for GPU ripple simulation covering the entire stream
const RIPPLE_BOUNDS = new THREE.Vector4(
  STREAM_BOUNDS.minX,
  STREAM_BOUNDS.minZ,
  STREAM_BOUNDS.maxX,
  STREAM_BOUNDS.maxZ
);
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
    float d = distance(vUv, uCenter);
    float factor = exp(-d * d / (uRadius * uRadius * 0.5));
    float impulse = factor * uStrength;
    gl_FragColor = vec4(impulse, 0.0, 0.0, 1.0);
  }
`;

const waterVertexShader = `
  attribute float aTerrainHeight;
  attribute float aIsFrontCut;

  uniform float uTime;
  uniform float uWaterLevel;
  uniform float uTideOffset;
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

    // Surface vertices and front skirt top vertices rise/fall with tide;
    // front skirt bottom vertices remain anchored to the riverbed in world space.
    if (aIsFrontCut < 0.5 || uv.y > 0.5) {
      pos.y += uTideOffset;
    } else {
      pos.y = min(pos.y, uWaterLevel);
    }

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

      pos.y += (ripDisp + gentleWaves) * shoreDamping * sin(3.14159265 * uv.y);
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

      vec3 dX = vec3(2.0 * texel.x * 20.0, (hR - hL) * 1.8, 0.0);
      vec3 dZ = vec3(0.0, (hU - hD) * 1.8, 2.0 * texel.y * 16.0);
      norm = normalize(cross(dZ, dX));
    } else {
      float eps = 0.05;
      float rL = computeAnalyticalRipples(vWorldPosition.xz - vec2(eps, 0.0), uTime);
      float rR = computeAnalyticalRipples(vWorldPosition.xz + vec2(eps, 0.0), uTime);
      float rD = computeAnalyticalRipples(vWorldPosition.xz - vec2(0.0, eps), uTime);
      float rU = computeAnalyticalRipples(vWorldPosition.xz + vec2(0.0, eps), uTime);

      vec3 dX = vec3(2.0 * eps, (rR - rL), 0.0);
      vec3 dZ = vec3(0.0, (rU - rD), 2.0 * eps);
      norm = normalize(cross(dZ, dX));
    }

    // Micro flow ripples along stream
    float flowTime = uTime * (0.8 + uFlowSpeed * 0.8);
    float n1 = sin(vWorldPosition.x * 6.5 + vWorldPosition.z * 3.5 + flowTime * 1.4);
    float n2 = cos(vWorldPosition.x * 11.0 - vWorldPosition.z * 5.0 + flowTime * 2.1);
    float flowPerturb = (n1 * 0.035 + n2 * 0.02) * (0.5 + uWindStrength * 0.6);

    norm.x += flowPerturb;
    norm.z += flowPerturb * 0.6;
    return normalize(norm);
  }

  void main() {
    // Treat zero or negative depth as dry ground
    if (vDepth <= 0.003 && vIsFrontCut < 0.5) {
      discard;
    }

    vec3 N = getWaterNormal();
    vec3 V = normalize(vViewDir);
    vec3 L = normalize(uSunDirection);

    // Beer-Lambert absorption
    vec3 absorptionCoeff = vec3(1.1, 0.35, 0.12);
    vec3 transmission = exp(-vDepth * absorptionCoeff * 5.2);

    vec3 shallowCol = uWaterColor;
    vec3 deepCol = uDeepColor;
    float depthFactor = 1.0 - exp(-vDepth * 3.8);
    vec3 waterBodyColor = mix(shallowCol, deepCol, depthFactor);

    // Water clarity
    vec3 baseCol = mix(waterBodyColor, shallowCol * 0.85, transmission.r * 0.3);

    // Specular Blinn-Phong highlight
    vec3 H = normalize(L + V);
    float NdotH = max(0.0, dot(N, H));
    float shininess = 72.0;
    float specular = pow(NdotH, shininess) * uSunIntensity;

    // Fresnel reflection
    float F0 = 0.03;
    float cosTheta = max(0.0, dot(N, V));
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

    // Sky reflection
    vec3 skyReflect = mix(uSkyHorizonColor, uSkyZenithColor, max(0.0, N.y));

    // Foam calculation
    float shoreFoam = smoothstep(0.07, 0.005, vDepth) * 0.65;

    // Animated rapids foam in upper cascade zone (z in [-2.5, 0.5])
    float cascadeRapidFoam = 0.0;
    if (vWorldPosition.z >= -2.5 && vWorldPosition.z <= 0.8 && vIsFrontCut < 0.5) {
      float cascadeZ = (vWorldPosition.z - (-2.5)) / 3.3;
      float rapidNoise = sin(vWorldPosition.x * 12.0 + vWorldPosition.z * 18.0 - uTime * 6.5)
                       * cos(vWorldPosition.x * 7.0 - uTime * 4.2);
      cascadeRapidFoam = smoothstep(0.15, 0.85, rapidNoise) * (1.0 - abs(cascadeZ - 0.5) * 1.6) * 0.55;
    }

    float foamTotal = clamp(shoreFoam + cascadeRapidFoam, 0.0, 1.0);

    // Final color compositing
    vec3 color = mix(baseCol, skyReflect, fresnel * 0.35);
    color += uSunColor * specular * 0.32;
    color = mix(color, uFoamColor, foamTotal);

    // Clean alpha gradient
    float alpha;
    if (vIsFrontCut > 0.5) {
      // Solid cut profile for diorama slab cross section
      alpha = 0.48;
      color = mix(uDeepColor * 0.85, uWaterColor, vUv.y);
    } else {
      alpha = mix(0.20, 0.46, depthFactor);
      alpha = max(alpha, foamTotal * 0.88);
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Builds the stream surface geometry + vertical front cross-section skirt.
 */
export function createStreamGeometry(getHeightAt: (x: number, z: number) => number): THREE.BufferGeometry {
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

  const zStart = STREAM_BOUNDS.minZ; // -7.5
  const zEnd = STREAM_BOUNDS.maxZ;   // 8.0 (front edge)

  // 1. Surface grid
  for (let iz = 0; iz <= segmentsZ; iz++) {
    const tZ = iz / segmentsZ;
    const z = zStart + tZ * (zEnd - zStart);
    const centerX = getStreamCenter(z);
    const halfWidth = getStreamHalfWidth(z) * 1.15;
    // Solve both bank intersections instead of dropping whole grid cells.
    const findBank = (direction: number): number => {
      let wet = centerX;
      let dry = centerX + direction * halfWidth;
      for (let i = 0; i < 28; i++) {
        const mid = (wet + dry) / 2;
        if (getHeightAt(mid, z) < getWaterSurfaceHeight(z, 0.07)) wet = mid;
        else dry = mid;
      }
      return (wet + dry) / 2;
    };
    const leftBank = findBank(-1);
    const rightBank = findBank(1);
    const waterSurfaceY = getWaterSurfaceHeight(z);

    for (let ix = 0; ix <= segmentsX; ix++) {
      const tX = ix / segmentsX;
      const x = THREE.MathUtils.lerp(leftBank, rightBank, tX);
      const y = waterSurfaceY;

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
      if (minH <= waterY + 0.08) {
        const quadX = (positions[i0 * 3] + positions[i3 * 3]) * 0.5;
        const quadZ = (positions[i0 * 3 + 2] + positions[i3 * 3 + 2]) * 0.5;
        if (isInsideGardenFootprint(quadX, quadZ, -0.05)) {
          indices.push(i0, i2, i1);
          indices.push(i1, i2, i3);
        }
      }
    }
  }

  // 2. Vertical Front Cross-Section Skirt at z = 8.0
  // Extends from water surface Y down to riverbed profile Y in world space
  const frontBaseIdx = numSurfaceVerts;
  const lastZRow = segmentsZ * (segmentsX + 1);
  const waterSurfaceYEnd = getWaterSurfaceHeight(zEnd);

  for (let ix = 0; ix <= segmentsX; ix++) {
    const surfIdx = lastZRow + ix;
    const x = positions[surfIdx * 3 + 0];
    const z = zEnd;
    const bedH = terrainHeights[surfIdx];

    // Top vertex of front skirt (at water surface, uv.y = 1.0)
    const topIdx = frontBaseIdx + ix * 2 + 0;
    positions[topIdx * 3 + 0] = x;
    positions[topIdx * 3 + 1] = waterSurfaceYEnd;
    positions[topIdx * 3 + 2] = z;
    uvs[topIdx * 2 + 0] = ix / segmentsX;
    uvs[topIdx * 2 + 1] = 1.0;
    terrainHeights[topIdx] = bedH;
    isFrontCut[topIdx] = 1.0;

    // Bottom vertex of front skirt (at riverbed, uv.y = 0.0)
    const botIdx = frontBaseIdx + ix * 2 + 1;
    positions[botIdx * 3 + 0] = x;
    positions[botIdx * 3 + 1] = Math.min(bedH, waterSurfaceYEnd + 0.07); // World riverbed height!
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

    // Only draw quads where water exists and is within the natural footprint
    const midX = (positions[t0 * 3] + positions[t1 * 3]) * 0.5;
    if (isInsideGardenFootprint(midX, zEnd)) {
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

  let currentTideOffset = getTideOffset('high');
  let targetTideOffset = currentTideOffset;
  let startTideOffset = currentTideOffset;
  let tideTransition = 1.0;
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

  const isWebGL2 = Boolean(renderer.capabilities.isWebGL2);
  let gpuSimulationSupported = false;

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

  // Robust capability test using checkFramebufferStatus
  try {
    const gl = renderer.getContext();
    const prevRT = renderer.getRenderTarget();
    renderer.setRenderTarget(currentRT);
    renderer.render(simScene, simCamera);
    const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (fbStatus === gl.FRAMEBUFFER_COMPLETE) {
      gpuSimulationSupported = true;
    } else {
      console.warn('GPU ripple simulation not supported by framebuffer status:', fbStatus);
      gpuSimulationSupported = false;
    }

    // Initialize simulation fields deterministically to zero state
    renderer.setRenderTarget(currentRT);
    renderer.clearColor();
    renderer.setRenderTarget(nextRT);
    renderer.clearColor();
    renderer.setRenderTarget(prevRT);
  } catch (err) {
    console.warn('GPU ripple simulation fallback to analytical ripples:', err);
    gpuSimulationSupported = false;
  }

  const waterUniforms = {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
    uSunColor: { value: new THREE.Color(1.0, 0.96, 0.90) },
    uSunIntensity: { value: 1.0 },
    uWaterLevel: { value: BASE_WATER_LEVEL + currentTideOffset },
    uTideOffset: { value: currentTideOffset },
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
  // Mesh is anchored at world origin; tide offset is applied in vertex shader
  mesh.position.set(0, 0, 0);
  group.add(mesh);
  scene.add(group);

  let currentElapsed = 0;
  let simAccumulator = 0.0;
  const FIXED_TIMESTEP = 1.0 / 60.0;

  function addRipple(worldX: number, worldZ: number, strength: number): void {
    const uvX = (worldX - RIPPLE_BOUNDS.x) / (RIPPLE_BOUNDS.z - RIPPLE_BOUNDS.x);
    const uvY = (worldZ - RIPPLE_BOUNDS.y) / (RIPPLE_BOUNDS.w - RIPPLE_BOUNDS.y);

    if (uvX >= -0.05 && uvX <= 1.05 && uvY >= -0.05 && uvY <= 1.05) {
      if (gpuSimulationSupported) {
        pendingRipples.push({
          uv: new THREE.Vector2(THREE.MathUtils.clamp(uvX, 0.01, 0.99), THREE.MathUtils.clamp(uvY, 0.01, 0.99)),
          radius: 0.032,
          strength: Math.min(0.85, strength * 0.95),
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
    const target = getTideOffset(tide);
    if (!smooth) {
      currentTideOffset = target;
      targetTideOffset = target;
      tideTransition = 1.0;
      waterUniforms.uTideOffset.value = target;
      waterUniforms.uWaterLevel.value = BASE_WATER_LEVEL + target;
    } else {
      startTideOffset = currentTideOffset;
      targetTideOffset = target;
      tideTransition = 0.0;
    }
  }

  function getWaterLevel(): number {
    return BASE_WATER_LEVEL + currentTideOffset;
  }

  function getTideOffsetVal(): number {
    return currentTideOffset;
  }

  function isInWater(x: number, z: number): boolean {
    return checkIsInWater(x, z, currentTideOffset);
  }

  function update(dt: number, elapsed: number, state: SceneState): void {
    currentElapsed = elapsed;

    if (tideTransition < 1.0) {
      tideTransition = Math.min(1.0, tideTransition + dt / TIDE_DURATION);
      const s = tideTransition * tideTransition * (3.0 - 2.0 * tideTransition);
      currentTideOffset = THREE.MathUtils.lerp(startTideOffset, targetTideOffset, s);
      waterUniforms.uTideOffset.value = currentTideOffset;
      waterUniforms.uWaterLevel.value = BASE_WATER_LEVEL + currentTideOffset;
    }

    waterUniforms.uTime.value = elapsed;
    waterUniforms.uFlowSpeed.value = state.flowSpeed;
    waterUniforms.uWindStrength.value = state.windStrength;

    if (gpuSimulationSupported) {
      simAccumulator += Math.min(dt, 0.1);

      const prevRT = renderer.getRenderTarget();
      const prevAutoClear = renderer.autoClear;
      renderer.autoClear = false;

      // Inject any pending impulses
      while (pendingRipples.length > 0) {
        const rip = pendingRipples.pop()!;
        dropMaterial.uniforms.uCenter.value.copy(rip.uv);
        dropMaterial.uniforms.uRadius.value = rip.radius;
        dropMaterial.uniforms.uStrength.value = rip.strength;

        renderer.setRenderTarget(currentRT);
        renderer.render(dropScene, simCamera);
      }

      // Step simulation using fixed timestep
      while (simAccumulator >= FIXED_TIMESTEP) {
        simMaterial.uniforms.uTexture.value = currentRT.texture;
        renderer.setRenderTarget(nextRT);
        renderer.render(simScene, simCamera);

        const temp = currentRT;
        currentRT = nextRT;
        nextRT = temp;

        simAccumulator -= FIXED_TIMESTEP;
      }

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
    getTideOffset: getTideOffsetVal,
    isInWater,
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
