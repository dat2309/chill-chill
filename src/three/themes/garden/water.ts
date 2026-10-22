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
  getGardenIcePotential,
  GARDEN_ICE_GLSL,
  getGardenLocalIce,
  getGardenIceAmount,
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
  setFreezeProgress(progress: number): void;
  getFreezeProgress(): number;
  isFrozen(x: number, z: number): boolean;
  getLocalIce(x: number, z: number): number;
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
  ${GARDEN_ICE_GLSL}
  attribute float aTerrainHeight;
  attribute float aIsFrontCut;
  attribute float aIcePotential;

  uniform float uTime;
  uniform float uWaterLevel;
  uniform float uTideOffset;
  uniform float uFreezeProgress;
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
  varying float vIcePotential;
  varying float vLocalIce;

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
    vIcePotential = aIcePotential;

    // Local ice factor based on freezeProgress and vertex ice potential
    float localIce = gardenIceAmount(aIcePotential, uFreezeProgress);
    vLocalIce = localIce;

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

      // Waves and ripples are frozen / suppressed on ice surface
      float waveSuppression = 1.0 - localIce;
      pos.y += (ripDisp + gentleWaves) * shoreDamping * sin(3.14159265 * uv.y) * waveSuppression;
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
  uniform float uFreezeProgress;
  uniform vec3 uIceColor;
  uniform vec3 uFrostColor;
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
  varying float vIcePotential;
  varying float vLocalIce;

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

    // At complete cover no time-dependent liquid normal is evaluated.
    if (vLocalIce >= 1.0) {
      float frost = sin(vWorldPosition.x * 24.0 + vWorldPosition.z * 18.0)
        * cos(vWorldPosition.x * 14.0 - vWorldPosition.z * 28.0) * .035;
      return normalize(vNormal + vec3(frost, 0.0, frost * .7));
    }
    vec3 norm = normalize(vNormal);

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

    vec3 normalOut = normalize(norm);
    if (vLocalIce > 0.01) {
      // Flatten liquid waves under ice
      normalOut = normalize(mix(normalOut, normalize(vNormal), vLocalIce));
      // Fine crystalline frost micro-texture
      float frostNoise = sin(vWorldPosition.x * 24.0 + vWorldPosition.z * 18.0)
                       * cos(vWorldPosition.x * 14.0 - vWorldPosition.z * 28.0) * 0.06;
      normalOut.x += frostNoise * vLocalIce;
      normalOut.z += frostNoise * vLocalIce * 0.7;
      normalOut = normalize(normalOut);
    }
    return normalOut;
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

    // Specular Blinn-Phong highlight: broader, softer frost sheen on ice
    vec3 H = normalize(L + V);
    float NdotH = max(0.0, dot(N, H));
    float shininess = mix(72.0, 16.0, vLocalIce);
    float specular = pow(NdotH, shininess) * uSunIntensity * mix(1.0, 0.60, vLocalIce);

    // Fresnel reflection
    float F0 = mix(0.03, 0.05, vLocalIce);
    float cosTheta = max(0.0, dot(N, V));
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

    // Sky reflection
    vec3 skyReflect = mix(uSkyHorizonColor, uSkyZenithColor, max(0.0, N.y));

    // Foam calculation: suppressed under ice
    float shoreFoam = smoothstep(0.07, 0.005, vDepth) * 0.65;

    // Animated rapids foam in upper cascade zone (z in [-2.5, 0.5])
    float cascadeRapidFoam = 0.0;
    if (vWorldPosition.z >= -2.5 && vWorldPosition.z <= 0.8 && vIsFrontCut < 0.5 && vLocalIce < 1.0) {
      float cascadeZ = (vWorldPosition.z - (-2.5)) / 3.3;
      float rapidNoise = sin(vWorldPosition.x * 12.0 + vWorldPosition.z * 18.0 - uTime * 6.5)
                       * cos(vWorldPosition.x * 7.0 - uTime * 4.2);
      cascadeRapidFoam = smoothstep(0.15, 0.85, rapidNoise) * (1.0 - abs(cascadeZ - 0.5) * 1.6) * 0.55;
    }

    float foamTotal = clamp(shoreFoam + cascadeRapidFoam, 0.0, 1.0) * (1.0 - vLocalIce);

    // Final color compositing
    vec3 color = mix(baseCol, skyReflect, fresnel * 0.35);
    color += uSunColor * specular * 0.32;
    color = mix(color, uFoamColor, foamTotal);

    // Ice surface color blending and crystalline frost rims
    if (vLocalIce > 0.005) {
      float frostRim = smoothstep(0.05, 0.35, vLocalIce) * (1.0 - smoothstep(0.65, 0.98, vLocalIce));
      vec3 effectiveIceColor = mix(uIceColor, uFrostColor, frostRim * 0.75);
      // Static cellular fracture lines and sparse snow; the sloping stream profile stays intact.
      vec2 cell = vWorldPosition.xz * 3.4;
      vec2 tile = floor(cell); vec2 within = fract(cell);
      float first = 10.0; float second = 10.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 n = vec2(float(i), float(j));
        vec2 id = tile + n;
        vec2 seed = .5 + .38 * sin(vec2(dot(id,vec2(127.1,311.7)),dot(id,vec2(269.5,183.3))));
        float d = length(n + seed - within);
        if (d < first) { second = first; first = d; } else second = min(second,d);
      }
      float crack = 1.0 - smoothstep(.006,.027,second-first);
      float snow = smoothstep(.22,.70, sin(vWorldPosition.x*2.3)*cos(vWorldPosition.z*1.7)) * smoothstep(.8,1.0,N.y);
      vec3 ice = mix(vec3(.38,.64,.74), effectiveIceColor, .55 + .18 * sin(vWorldPosition.z*1.4 + vWorldPosition.x*2.1));
      ice = mix(ice, vec3(.20,.43,.54), crack * .65);
      ice = mix(ice, uFrostColor, snow * .65);
      color = mix(color, ice, vLocalIce * .94);
    }

    // Clean alpha gradient
    float alpha;
    if (vIsFrontCut > 0.5) {
      // Solid cut profile for diorama slab cross section
      alpha = mix(0.48, 0.76, vLocalIce);
      color = mix(uDeepColor * 0.85, uWaterColor, vUv.y);
      if (vLocalIce > 0.01) {
        color = mix(color, uIceColor * 0.9, vLocalIce * 0.7);
      }
    } else {
      alpha = mix(0.20, 0.46, depthFactor);
      alpha = max(alpha, foamTotal * 0.88);
      alpha = mix(alpha, 0.82, vLocalIce * 0.9);
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
  const icePotentials = new Float32Array(totalVerts);
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

      const tH = getHeightAt(x, z);
      terrainHeights[idx] = tH;
      icePotentials[idx] = getGardenIcePotential(x, z, waterSurfaceY, tH);
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
    icePotentials[topIdx] = getGardenIcePotential(x, z, waterSurfaceYEnd, bedH);
    isFrontCut[topIdx] = 1.0;

    // Bottom vertex of front skirt (at riverbed, uv.y = 0.0)
    const botIdx = frontBaseIdx + ix * 2 + 1;
    positions[botIdx * 3 + 0] = x;
    positions[botIdx * 3 + 1] = Math.min(bedH, waterSurfaceYEnd + 0.07); // World riverbed height!
    positions[botIdx * 3 + 2] = z;
    uvs[botIdx * 2 + 0] = ix / segmentsX;
    uvs[botIdx * 2 + 1] = 0.0;
    terrainHeights[botIdx] = bedH;
    icePotentials[botIdx] = icePotentials[topIdx];
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
  geo.setAttribute('aIcePotential', new THREE.BufferAttribute(icePotentials, 1));
  geo.setAttribute('aIsFrontCut', new THREE.BufferAttribute(isFrontCut, 1));
  geo.setIndex(indices);
  geo.userData.waterGrid = { segmentsX, segmentsZ };
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

  const isWebGL2 = Boolean(renderer?.capabilities?.isWebGL2);
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
    if (renderer && typeof renderer.getContext === 'function') {
      const gl = renderer.getContext();
      if (gl) {
        const prevRT = renderer.getRenderTarget();
        renderer.setRenderTarget(currentRT);
        renderer.render(simScene, simCamera);
        const fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (fbStatus === gl.FRAMEBUFFER_COMPLETE) {
          gpuSimulationSupported = true;
        } else {
          gpuSimulationSupported = false;
        }

        // Initialize simulation fields deterministically to zero state
        renderer.setRenderTarget(currentRT);
        renderer.clearColor();
        renderer.setRenderTarget(nextRT);
        renderer.clearColor();
        renderer.setRenderTarget(prevRT);
      }
    }
  } catch (err) {
    console.warn('GPU ripple simulation fallback to analytical ripples:', err);
    gpuSimulationSupported = false;
  }

  let currentFreezeProgress = 0.0;

  const waterUniforms = {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
    uSunColor: { value: new THREE.Color(1.0, 0.96, 0.90) },
    uSunIntensity: { value: 1.0 },
    uWaterLevel: { value: BASE_WATER_LEVEL + currentTideOffset },
    uTideOffset: { value: currentTideOffset },
    uFreezeProgress: { value: 0.0 },
    uIceColor: { value: new THREE.Color(0xd6e8f4) },
    uFrostColor: { value: new THREE.Color(0xf2f7fc) },
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
  let lastIceTideOffset = currentTideOffset;

  function updateIcePotentials(tideOffset: number): void {
    const iceAttr = geometry.getAttribute('aIcePotential') as THREE.BufferAttribute | undefined;
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    const terrainAttr = geometry.getAttribute('aTerrainHeight') as THREE.BufferAttribute | undefined;
    if (!iceAttr || !posAttr || !terrainAttr) return;

    const count = iceAttr.count;
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const tH = terrainAttr.getX(i);
      const waterSurfaceY = getWaterSurfaceHeight(z, tideOffset);
      iceAttr.setX(i, getGardenIcePotential(x, z, waterSurfaceY, tH));
    }
    iceAttr.needsUpdate = true;
  }

  // Geometry is built at base tide. Align its freezing data before the first render/query.
  updateIcePotentials(currentTideOffset);

  function getLocalIce(worldX: number, worldZ: number): number {
    // Interpolate the same vertex factors as the shader, rather than evaluating a different
    // nonlinear function at a click between vertices. XZ is unchanged by liquid displacement.
    const positions = geometry.getAttribute('position');
    const potentials = geometry.getAttribute('aIcePotential');
    const { segmentsX: columns, segmentsZ: rows } = geometry.userData.waterGrid as { segmentsX: number; segmentsZ: number };
    const rowSize = columns + 1;
    const row = THREE.MathUtils.clamp(Math.floor((worldZ - STREAM_BOUNDS.minZ) / (STREAM_BOUNDS.maxZ - STREAM_BOUNDS.minZ) * rows), 0, rows - 1);
    const lower = row * rowSize, upper = lower + rowSize;
    const z0 = positions.getZ(lower), z1 = positions.getZ(upper);
    const tz = THREE.MathUtils.clamp((worldZ-z0)/(z1-z0),0,1);
    const left = THREE.MathUtils.lerp(positions.getX(lower),positions.getX(upper),tz);
    const right = THREE.MathUtils.lerp(positions.getX(lower+columns),positions.getX(upper+columns),tz);
    const col = THREE.MathUtils.clamp(Math.floor((worldX-left)/(right-left)*columns),0,columns-1);
    const interpolate = (a: number,b: number,c: number): number | undefined => {
      const ax=positions.getX(a),az=positions.getZ(a),bx=positions.getX(b),bz=positions.getZ(b),cx=positions.getX(c),cz=positions.getZ(c);
      const denominator=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);
      const wa=((bz-cz)*(worldX-cx)+(cx-bx)*(worldZ-cz))/denominator;
      const wb=((cz-az)*(worldX-cx)+(ax-cx)*(worldZ-cz))/denominator;
      const wc=1-wa-wb;
      if(Math.min(wa,wb,wc)<-.00001)return undefined;
      return wa*getGardenIceAmount(potentials.getX(a),currentFreezeProgress)
        +wb*getGardenIceAmount(potentials.getX(b),currentFreezeProgress)
        +wc*getGardenIceAmount(potentials.getX(c),currentFreezeProgress);
    };
    const i0=lower+col,i1=i0+1,i2=upper+col,i3=i2+1;
    return THREE.MathUtils.clamp(interpolate(i0,i2,i1) ?? interpolate(i1,i2,i3)
      ?? getGardenLocalIce(worldX,worldZ,currentFreezeProgress,getWaterSurfaceHeight(worldZ,currentTideOffset),getHeightAt(worldX,worldZ)),0,1);
  }

  function isFrozen(worldX: number, worldZ: number): boolean {
    return getLocalIce(worldX,worldZ) >= .5;
  }

  function addRipple(worldX: number, worldZ: number, strength: number): void {
    // Suppress liquid ripples on solid frozen ice surface
    if (isFrozen(worldX, worldZ)) {
      return;
    }

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
      if (currentTideOffset !== lastIceTideOffset) {
        updateIcePotentials(currentTideOffset);
        lastIceTideOffset = currentTideOffset;
      }
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
      if (currentTideOffset !== lastIceTideOffset) {
        updateIcePotentials(currentTideOffset);
        lastIceTideOffset = currentTideOffset;
      }
    }

    if (currentFreezeProgress >= .94) return;
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

  function setFreezeProgress(progress: number): void {
    const wasComplete = currentFreezeProgress >= .94;
    currentFreezeProgress = THREE.MathUtils.clamp(Number.isFinite(progress) ? progress : 0, 0.0, 1.0);
    if (!wasComplete && currentFreezeProgress >= .94) {
      pendingRipples.length = 0;
      analyticalRipples.forEach(r => { r.strength = 0; });
      analyticalArray.fill(0);
      simAccumulator = 0;
      if (gpuSimulationSupported) {
        const target = renderer.getRenderTarget();
        const clear = renderer.getClearColor(new THREE.Color()).clone();
        const alpha = renderer.getClearAlpha();
        renderer.setClearColor(0, 0);
        renderer.setRenderTarget(currentRT); renderer.clear();
        renderer.setRenderTarget(nextRT); renderer.clear();
        renderer.setRenderTarget(target); renderer.setClearColor(clear, alpha);
      }
    }
    waterUniforms.uFreezeProgress.value = currentFreezeProgress;
  }

  function getFreezeProgress(): number {
    return currentFreezeProgress;
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
    setFreezeProgress,
    getFreezeProgress,
    isFrozen,
    getLocalIce,
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
