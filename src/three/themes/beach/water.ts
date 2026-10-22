import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  SEA_LEVEL_BASE,
  SEA_LEVEL_LOW,
  SEA_LEVEL_HIGH,
  WATER_RES,
  BEACH_COLORS,
  PHUQUOC_COLORS,
  TideLevel,
} from './constants';
import { getWaterLevel, isInWater, getShoreZ, getDistanceToShore } from './shoreline';
import {
  BEACH_CENTER,
  PHUQUOC_CENTER,
  BEACH_BOUNDARY_POINTS,
  PHUQUOC_BOUNDARY_POINTS,
  BEACH_BOUNDARY_SAMPLES,
  PHUQUOC_BOUNDARY_SAMPLES,
  isInsideBeachFootprint,
  isInsidePhuQuocFootprint,
  BEACH_FOOTPRINT_BOUNDS,
  PHUQUOC_FOOTPRINT_BOUNDS,
} from './footprint';
import { generateGheCavityShaderGlsl } from './boats';

export interface BeachWaterSystem {
  group: THREE.Group;
  mesh: THREE.Mesh;
  update(dt: number, elapsed: number, windStrength: number, flowSpeed: number, rainIntensity?: number): void;
  addRipple(worldX: number, worldZ: number, strength: number): void;
  setTide(tide: TideLevel, smooth?: boolean): void;
  getWaterLevel(): number;
  getTideOffset(): number;
  setSunLighting(sunDir: THREE.Vector3, sunCol: THREE.Color, skyCol: THREE.Color): void;
  updateBoatCavities?(cavities: {
    thungInvMatrix: THREE.Matrix4;
    gheInvMatrix: THREE.Matrix4;
  }): void;
  setForceAnalyticalFallback?(force: boolean): void;
  isUsingGpuSimulation?(): boolean;
  onContextRestored?(): void;
  dispose(): void;
}
export type PhuQuocWaterSystem = BeachWaterSystem;

interface AnalyticalRipple {
  x: number;
  z: number;
  startTime: number;
  strength: number;
}

const MAX_ANALYTICAL_RIPPLES = 10;

export function checkRenderTargetSupport(
  renderer: THREE.WebGLRenderer,
  type: THREE.TextureDataType
): boolean {
  if (!renderer || typeof renderer.getRenderTarget !== 'function' || typeof renderer.getContext !== 'function') {
    return false;
  }
  let testTarget: THREE.WebGLRenderTarget | null = null;
  const prevRT = renderer.getRenderTarget();
  try {
    const gl = renderer.getContext() as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (!gl) return false;

    // Check extensions based on WebGL capabilities
    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    if (type === THREE.FloatType) {
      if (isWebGL2) {
        if (!gl.getExtension('EXT_color_buffer_float')) return false;
      } else {
        if (!gl.getExtension('OES_texture_float')) return false;
      }
    } else if (type === THREE.HalfFloatType) {
      if (isWebGL2) {
        if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) {
          // May still be supported or require extension
        }
      } else {
        if (!gl.getExtension('OES_texture_half_float')) return false;
      }
    }

    testTarget = new THREE.WebGLRenderTarget(16, 16, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type,
    });

    renderer.setRenderTarget(testTarget);

    // Framebuffer completeness validation
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      return false;
    }

    renderer.clear();

    const err = gl.getError();
    if (err !== gl.NO_ERROR) {
      return false;
    }

    return true;
  } catch {
    return false;
  } finally {
    try {
      renderer.setRenderTarget(prevRT);
    } catch {}
    if (testTarget) {
      try {
        testTarget.dispose();
      } catch {}
    }
  }
}

export function createBeachWater(
  renderer: THREE.WebGLRenderer,
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number,
  debugForceAnalytical: boolean = false
): BeachWaterSystem {
  const waterGroup = new THREE.Group();
  waterGroup.name = 'BeachWater';
  parentGroup.add(waterGroup);

  const halfW = DIORAMA_WIDTH / 2; // 10
  const halfD = DIORAMA_DEPTH / 2; // 8

  let currentWaterLevel = SEA_LEVEL_HIGH;
  let targetWaterLevel = SEA_LEVEL_HIGH;
  let tideOffset = 1.0;
  let targetTideOffset = 1.0;
  let currentSimTime = 0;

  // --- Water Mesh Conforming Strictly to Natural Diorama Footprint ---
  const minX = PHUQUOC_FOOTPRINT_BOUNDS.minX;
  const maxX = PHUQUOC_FOOTPRINT_BOUNDS.maxX;
  const minZ = -1.5;
  const maxZ = PHUQUOC_FOOTPRINT_BOUNDS.maxZ;

  const positions: number[] = [];
  const uvs: number[] = [];
  const terrainHeights: number[] = [];
  const isSkirtBottom: number[] = [];
  const isSkirt: number[] = [];
  const indices: number[] = [];

  const cX = PHUQUOC_CENTER.x;
  const cZ = PHUQUOC_CENTER.y;
  const numSegments = PHUQUOC_BOUNDARY_SAMPLES;

  // 1. Identify marine boundary segment range
  // Boundary rays crossing the southern sweeping bay
  let itStart = -1;
  let itEnd = -1;
  for (let it = 0; it < numSegments; it++) {
    const pt = PHUQUOC_BOUNDARY_POINTS[it];
    const shoreZ = getShoreZ(pt.x);
    const isMarine = pt.y >= shoreZ - 0.05 || getHeightAt(pt.x, pt.y) < SEA_LEVEL_HIGH + 0.02;
    if (isMarine) {
      if (itStart === -1) itStart = it;
      itEnd = it;
    }
  }

  // Fallback safe defaults if dynamic range not found
  if (itStart === -1 || itEnd === -1) {
    itStart = 15;
    itEnd = 118;
  }

  const numRays = itEnd - itStart + 1;
  const numRings = 40;

  // 1. Continuous Curvilinear Water Surface Tessellation
  // Connects natural shoreline directly to exact boundary points bPt_k
  for (let ik = 0; ik < numRays; ik++) {
    const it = itStart + ik;
    const bPt = PHUQUOC_BOUNDARY_POINTS[it];

    // Find ray root at shoreline via bisection
    // At t=0 (center), on land (dist > 0). At t=1 (boundary), in sea (dist < 0).
    let tLow = 0.0;
    let tHigh = 1.0;
    for (let iter = 0; iter < 12; iter++) {
      const tMid = (tLow + tHigh) * 0.5;
      const mx = cX + tMid * (bPt.x - cX);
      const mz = cZ + tMid * (bPt.y - cZ);
      const dist = getDistanceToShore(mx, mz);
      if (dist > 0) {
        tLow = tMid;
      } else {
        tHigh = tMid;
      }
    }
    const tShore = (tLow + tHigh) * 0.5;
    // Slight overlap into intertidal sand slope so water laps onto beach without gaps
    const t0 = Math.max(0.0, tShore - 0.04);
    const t1 = 1.0; // EXACTLY at boundary point bPt

    for (let ir = 0; ir <= numRings; ir++) {
      const frac = ir / numRings;
      const t = t0 + frac * (t1 - t0);
      const x = cX + t * (bPt.x - cX);
      const z = cZ + t * (bPt.y - cZ);
      const y = SEA_LEVEL_BASE;
      const h = getHeightAt(x, z);

      positions.push(x, y, z);
      const u = (x + halfW) / DIORAMA_WIDTH;
      const v = (z - minZ) / (maxZ - minZ);
      uvs.push(u, v);
      terrainHeights.push(h);
      isSkirtBottom.push(0);
      isSkirt.push(0);
    }
  }

  // Quads for water surface (strictly facing +Y)
  for (let ik = 0; ik < numRays - 1; ik++) {
    const rayCurr = ik * (numRings + 1);
    const rayNext = (ik + 1) * (numRings + 1);

    for (let ir = 0; ir < numRings; ir++) {
      const i00 = rayCurr + ir;
      const i10 = rayNext + ir;
      const i01 = rayCurr + ir + 1;
      const i11 = rayNext + ir + 1;

      indices.push(i00, i11, i01);
      indices.push(i00, i10, i11);
    }
  }

  // 2. Natural Boundary Marine Cross-Section Cut Skirt
  // Along the marine boundary arc where sea meets diorama perimeter
  // Uses IDENTICAL boundary points bPt0 and bPt1 matching surface outer vertices
  for (let ik = 0; ik < numRays - 1; ik++) {
    const it0 = itStart + ik;
    const it1 = it0 + 1;
    const bPt0 = PHUQUOC_BOUNDARY_POINTS[it0];
    const bPt1 = PHUQUOC_BOUNDARY_POINTS[it1];

    const bedH0 = getHeightAt(bPt0.x, bPt0.y);
    const bedH1 = getHeightAt(bPt1.x, bPt1.y);

    const baseIdx = positions.length / 3;

    // Top vertices (water level, identical to surface outer boundary vertices)
    positions.push(bPt0.x, SEA_LEVEL_BASE, bPt0.y);
    uvs.push((bPt0.x + halfW) / DIORAMA_WIDTH, 1.0);
    terrainHeights.push(bedH0);
    isSkirtBottom.push(0);
    isSkirt.push(1);

    positions.push(bPt1.x, SEA_LEVEL_BASE, bPt1.y);
    uvs.push((bPt1.x + halfW) / DIORAMA_WIDTH, 1.0);
    terrainHeights.push(bedH1);
    isSkirtBottom.push(0);
    isSkirt.push(1);

    // Bottom vertices (seabed height, clamped strictly below water surface)
    const skirtBot0 = Math.min(SEA_LEVEL_BASE - 0.002, bedH0);
    const skirtBot1 = Math.min(SEA_LEVEL_BASE - 0.002, bedH1);
    positions.push(bPt0.x, skirtBot0, bPt0.y);
    uvs.push((bPt0.x + halfW) / DIORAMA_WIDTH, 0.0);
    terrainHeights.push(bedH0);
    isSkirtBottom.push(1);
    isSkirt.push(1);

    positions.push(bPt1.x, skirtBot1, bPt1.y);
    uvs.push((bPt1.x + halfW) / DIORAMA_WIDTH, 0.0);
    terrainHeights.push(bedH1);
    isSkirtBottom.push(1);
    isSkirt.push(1);

    // Outward facing winding: (top0, top1, bot1) and (top0, bot1, bot0)
    indices.push(baseIdx, baseIdx + 1, baseIdx + 3);
    indices.push(baseIdx, baseIdx + 3, baseIdx + 2);
  }

  const waterGeo = new THREE.BufferGeometry();
  waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  waterGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  waterGeo.setAttribute('aTerrainH', new THREE.Float32BufferAttribute(terrainHeights, 1));
  waterGeo.setAttribute('aSkirtBottom', new THREE.Float32BufferAttribute(isSkirtBottom, 1));
  waterGeo.setAttribute('aIsSkirt', new THREE.Float32BufferAttribute(isSkirt, 1));
  waterGeo.setIndex(indices);
  waterGeo.computeVertexNormals();

  // --- Capability Check for Render Targets ---
  const simRes = WATER_RES;
  let useGpuSimulation = !debugForceAnalytical;
  let rtType: THREE.TextureDataType = THREE.HalfFloatType;

  if (useGpuSimulation) {
    if (checkRenderTargetSupport(renderer, THREE.FloatType)) {
      rtType = THREE.FloatType;
    } else if (checkRenderTargetSupport(renderer, THREE.HalfFloatType)) {
      rtType = THREE.HalfFloatType;
    } else {
      useGpuSimulation = false;
    }
  }

  let rtA: THREE.WebGLRenderTarget | null = null;
  let rtB: THREE.WebGLRenderTarget | null = null;

  if (useGpuSimulation) {
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: rtType,
    };

    try {
      rtA = new THREE.WebGLRenderTarget(simRes, simRes, rtOptions);
      rtB = new THREE.WebGLRenderTarget(simRes, simRes, rtOptions);

      // Initial clear
      const prevRT = renderer.getRenderTarget();
      const prevClearColor = new THREE.Color();
      renderer.getClearColor(prevClearColor);
      const prevClearAlpha = renderer.getClearAlpha();

      try {
        renderer.setClearColor(0x000000, 0);
        renderer.setRenderTarget(rtA);
        renderer.clear();
        renderer.setRenderTarget(rtB);
        renderer.clear();
      } finally {
        renderer.setRenderTarget(prevRT);
        renderer.setClearColor(prevClearColor, prevClearAlpha);
      }
    } catch (e) {
      console.warn('GPU simulation target creation failed, falling back to analytical ripples:', e);
      if (rtA) {
        rtA.dispose();
        rtA = null;
      }
      if (rtB) {
        rtB.dispose();
        rtB = null;
      }
      useGpuSimulation = false;
    }
  }

  const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const simScene = new THREE.Scene();
  const simQuadGeo = new THREE.PlaneGeometry(2, 2);

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPrevTexture: { value: null },
      uTexelSize: { value: new THREE.Vector2(1.0 / simRes, 1.0 / simRes) },
      uDamping: { value: 0.985 },
      uWaveSpeed: { value: 0.28 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uPrevTexture;
      uniform vec2 uTexelSize;
      uniform float uDamping;
      uniform float uWaveSpeed;
      varying vec2 vUv;

      void main() {
        vec4 state = texture2D(uPrevTexture, vUv);
        float currentH = state.r;
        float prevH = state.g;

        float nL = texture2D(uPrevTexture, vUv + vec2(-uTexelSize.x, 0.0)).r;
        float nR = texture2D(uPrevTexture, vUv + vec2(uTexelSize.x, 0.0)).r;
        float nD = texture2D(uPrevTexture, vUv + vec2(0.0, -uTexelSize.y)).r;
        float nU = texture2D(uPrevTexture, vUv + vec2(0.0, uTexelSize.y)).r;

        float laplacian = (nL + nR + nD + nU) - 4.0 * currentH;
        float nextH = 2.0 * currentH - prevH + (uWaveSpeed * uWaveSpeed) * laplacian;
        nextH *= uDamping;

        gl_FragColor = vec4(nextH, currentH, 0.0, 1.0);
      }
    `,
  });

  const simQuad = new THREE.Mesh(simQuadGeo, simMaterial);
  simScene.add(simQuad);

  // Impulse injection scene
  const impulseScene = new THREE.Scene();
  const impulseGeo = new THREE.PlaneGeometry(0.12, 0.12);
  const impulseMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uStrength: { value: 0.5 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uStrength;
      varying vec2 vUv;
      void main() {
        float dist = length(vUv - vec2(0.5));
        float amp = smoothstep(0.5, 0.0, dist) * uStrength * 0.85;
        gl_FragColor = vec4(amp, 0.0, 0.0, 1.0);
      }
    `,
  });
  const impulseMesh = new THREE.Mesh(impulseGeo, impulseMat);
  impulseScene.add(impulseMesh);
  const impulseCamera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);

  // Analytical ripple buffer
  const analyticalRipples: AnalyticalRipple[] = [];
  const analyticalBuffer = new Float32Array(MAX_ANALYTICAL_RIPPLES * 4);

  // --- Water Surface ShaderMaterial ---
  const waterMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uWaterLevel: { value: currentWaterLevel },
      uTideOffset: { value: 1.0 },
      uRippleMap: { value: rtA ? rtA.texture : null },
      uShallowColor: { value: PHUQUOC_COLORS.water.shallow.clone() },
      uDeepColor: { value: PHUQUOC_COLORS.water.deep.clone() },
      uSunsetSkyColor: { value: new THREE.Color(0xffa785) },
      uSunDirection: { value: new THREE.Vector3(-0.8, 0.35, -0.4).normalize() },
      uSunColor: { value: new THREE.Color(0xff8c42) },
      uFlowSpeed: { value: 0.45 },
      uWindStrength: { value: 0.35 },
      uRainIntensity: { value: 0.0 },
      uUseGpu: { value: useGpuSimulation ? 1.0 : 0.0 },
      uAnalyticalCount: { value: 0 },
      uAnalyticalRipples: { value: analyticalBuffer },
      uThungInvMatrix: { value: new THREE.Matrix4() },
      uGheInvMatrix: { value: new THREE.Matrix4() },
    },
    vertexShader: `
      attribute float aTerrainH;
      attribute float aSkirtBottom;
      attribute float aIsSkirt;
      uniform float uTime;
      uniform float uWaterLevel;
      uniform float uTideOffset;
      uniform float uWindStrength;
      uniform float uRainIntensity;
      uniform sampler2D uRippleMap;
      uniform float uUseGpu;
      uniform int uAnalyticalCount;
      uniform vec4 uAnalyticalRipples[10];

      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying float vTerrainH;
      varying float vIsSkirtBottom;
      varying float vIsSkirt;
      varying vec3 vViewDir;

      void main() {
        vUv = uv;
        vTerrainH = aTerrainH;
        vIsSkirtBottom = aSkirtBottom;
        vIsSkirt = aIsSkirt;

        vec3 pos = position;
        
        // Only surface and top-skirt vertices move with tide
        if (aSkirtBottom < 0.5) {
          pos.y = uWaterLevel;

          // Synchronized ocean swell waves (identical to CPU boat physics)
          float swell = sin(pos.z * 1.75 - uTime * 1.6) * 0.045 * uWindStrength;
          swell += cos(pos.x * 1.15 + pos.z * 0.85 - uTime * 2.1) * 0.025 * uWindStrength;
          swell += sin(pos.x * 2.2 - pos.z * 1.3 + uTime * 3.0) * 0.012 * uWindStrength;

          if (uUseGpu > 0.5) {
            vec4 ripple = texture2D(uRippleMap, uv);
            pos.y += swell + ripple.r * 0.12;
          } else {
            // Analytical ripple displacement
            float analyticalDisp = 0.0;
            for (int i = 0; i < 10; i++) {
              if (i >= uAnalyticalCount) break;
              vec4 rip = uAnalyticalRipples[i];
              float age = uTime - rip.z;
              if (age > 0.0 && age < 3.0) {
                float d = distance(pos.xz, rip.xy);
                float waveRadius = age * 2.4;
                float waveDist = abs(d - waveRadius);
                float atten = exp(-age * 1.5) * exp(-d * 0.35) * rip.w;
                float wave = sin((d - waveRadius) * 8.0) * smoothstep(0.65, 0.0, waveDist) * atten * 0.10;
                analyticalDisp += wave;
              }
            }
            pos.y += swell + analyticalDisp;
          }
        }

        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPos);

        gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uWaterLevel;
      uniform float uWindStrength;
      uniform float uRainIntensity;
      uniform vec3 uShallowColor;
      uniform vec3 uDeepColor;
      uniform vec3 uSunsetSkyColor;
      uniform vec3 uSunDirection;
      uniform vec3 uSunColor;
      uniform sampler2D uRippleMap;
      uniform float uUseGpu;
      uniform int uAnalyticalCount;
      uniform vec4 uAnalyticalRipples[10];
      uniform mat4 uThungInvMatrix;
      uniform mat4 uGheInvMatrix;

      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying float vTerrainH;
      varying float vIsSkirtBottom;
      varying float vIsSkirt;
      varying vec3 vViewDir;

      void main() {
        // Natural boundary cut cross-section styling
        if (vIsSkirt > 0.5) {
          gl_FragColor = vec4(uDeepColor * 0.72, 0.88);
          return;
        }

        // Boat interior cavity water discard (prevent water clipping inside open boat hulls)
        // 1. Thuyen Thung: transformed via exact inverse world matrix
        vec4 localThung4 = uThungInvMatrix * vec4(vWorldPos, 1.0);
        vec3 localThung = localThung4.xyz / localThung4.w;

        // In Thung local space (floor at -0.11, rim at +0.22):
        if (localThung.y >= -0.11 && localThung.y <= 0.22) {
          float rInner = localThung.y < 0.05
            ? mix(0.28, 0.45, (localThung.y + 0.11) / 0.16)
            : mix(0.45, 0.51, (localThung.y - 0.05) / 0.17);
          float rDist = length(localThung.xz);
          if (rDist < rInner - 0.015) {
            discard;
          }
        }

${generateGheCavityShaderGlsl()}

        // Calculate physical water depth
        float depth = max(0.0, uWaterLevel - vTerrainH);

        // Discard water where terrain is above waterline
        if (depth < 0.005) {
          discard;
        }

        // 1. Turbidity & Exponential Beer-Lambert Absorption
        // Rain churns near-shore sand and increases turbidity naturally
        float shoreTurbidity = smoothstep(0.85, 0.04, depth) * 0.42;
        float turbidity = uRainIntensity * (shoreTurbidity + 0.18);

        vec3 clearAbsorption = vec3(1.6, 0.5, 0.2);
        vec3 turbidAbsorption = vec3(2.4, 1.2, 0.65);
        vec3 effAbsorption = mix(clearAbsorption, turbidAbsorption, turbidity);
        vec3 absorption = exp(-depth * effAbsorption * 2.2);

        vec3 clearWaterColor = mix(uDeepColor, uShallowColor, absorption);
        // Slightly churning coastal turquoise / sediment hue under rain
        vec3 turbidWaterColor = vec3(0.30, 0.56, 0.52);
        vec3 waterColor = mix(clearWaterColor, turbidWaterColor, turbidity * 0.62);

        // 2. Ripple and Wave Normal Perturbation
        vec3 N = vec3(0.0, 1.0, 0.0);
        if (uUseGpu > 0.5) {
          vec2 texel = vec2(1.0 / 256.0);
          float hL = texture2D(uRippleMap, vUv + vec2(-texel.x, 0.0)).r;
          float hR = texture2D(uRippleMap, vUv + vec2(texel.x, 0.0)).r;
          float hD = texture2D(uRippleMap, vUv + vec2(0.0, -texel.y)).r;
          float hU = texture2D(uRippleMap, vUv + vec2(0.0, texel.y)).r;
          N = normalize(vec3(hL - hR, 0.25, hD - hU));
        } else {
          // Analytical normal perturbation from ripple radial gradient
          for (int i = 0; i < 10; i++) {
            if (i >= uAnalyticalCount) break;
            vec4 rip = uAnalyticalRipples[i];
            float age = uTime - rip.z;
            if (age > 0.0 && age < 3.0) {
              vec2 diff = vWorldPos.xz - rip.xy;
              float d = length(diff);
              if (d > 0.02) {
                vec2 dir = diff / d;
                float waveRadius = age * 2.4;
                float waveDist = abs(d - waveRadius);
                float atten = exp(-age * 1.5) * exp(-d * 0.35) * rip.w;
                float slope = cos((d - waveRadius) * 8.0) * 8.0 * smoothstep(0.65, 0.0, waveDist) * atten * 0.10;
                N.x -= dir.x * slope * 0.4;
                N.z -= dir.y * slope * 0.4;
              }
            }
          }
        }

        // Exact wave surface slope derivatives matching vertex displacement & boat physics
        float dSdx = -sin(vWorldPos.x * 1.15 + vWorldPos.z * 0.85 - uTime * 2.1) * 0.02875 * uWindStrength
                   + cos(vWorldPos.x * 2.2 - vWorldPos.z * 1.3 + uTime * 3.0) * 0.0264 * uWindStrength;
        float dSdz = cos(vWorldPos.z * 1.75 - uTime * 1.6) * 0.07875 * uWindStrength
                   - sin(vWorldPos.x * 1.15 + vWorldPos.z * 0.85 - uTime * 2.1) * 0.02125 * uWindStrength
                   - cos(vWorldPos.x * 2.2 - vWorldPos.z * 1.3 + uTime * 3.0) * 0.0156 * uWindStrength;

        N.x -= dSdx;
        N.z -= dSdz;

        // Raindrop micro-roughness chop
        if (uRainIntensity > 0.01) {
          float rainChop = (sin(vWorldPos.x * 36.0 + uTime * 18.0) + cos(vWorldPos.z * 36.0 - uTime * 15.0)) * 0.022 * uRainIntensity;
          N.x += rainChop;
          N.z += rainChop * 0.75;
        }
        N = normalize(N);

        // 3. Sunset Fresnel Reflection
        float F0 = 0.035;
        float cosTheta = max(0.0, dot(N, vViewDir));
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 4.0);

        // Sun specular highlight: slightly broader during rain
        vec3 H = normalize(uSunDirection + vViewDir);
        float NdotH = max(0.0, dot(N, H));
        float shininess = mix(64.0, 24.0, uRainIntensity * 0.7);
        float specular = pow(NdotH, shininess) * mix(0.8, 0.5, uRainIntensity);

        // 4. Organic Shore Surf Wave Foam & Breaker Dynamics
        // Waves break when crest height is high relative to shallow depth
        float swellLocal = sin(vWorldPos.z * 1.75 - uTime * 1.6) * 0.045 * uWindStrength
                         + cos(vWorldPos.x * 1.15 + vWorldPos.z * 0.85 - uTime * 2.1) * 0.025 * uWindStrength;
        float crestRatio = swellLocal / (depth + 0.02);
        float surfNoise = sin(vWorldPos.x * 4.2 + vWorldPos.z * 2.8 - uTime * 3.2)
                        * cos(vWorldPos.x * 8.5 - vWorldPos.z * 4.1 + uTime * 1.8);
        float breakerFoam = smoothstep(0.12, 0.58, crestRatio * 0.65 + surfNoise * 0.25) * smoothstep(0.24, 0.02, depth);

        // Shoreline swash lacing
        float shoreSwash = smoothstep(0.05, 0.005, depth) * (0.35 + 0.30 * sin(vWorldPos.x * 5.5 + uTime * 1.4));

        // Wind/rain-driven whitecaps in deeper open water
        float whitecaps = smoothstep(0.038, 0.075, swellLocal) * smoothstep(0.10, 0.70, depth)
                        * uRainIntensity * (0.32 + 0.45 * uWindStrength);

        float foamFactor = clamp(breakerFoam + shoreSwash + whitecaps, 0.0, 1.0);
        vec3 foamColor = vec3(0.96, 0.99, 1.0);

        // Combine: refracted absorption color + sky reflection + specular + surf foam
        vec3 finalColor = mix(waterColor, uSunsetSkyColor, fresnel * 0.65);
        finalColor += uSunColor * specular;
        finalColor = mix(finalColor, foamColor, foamFactor * 0.75);

        float alpha = clamp(0.18 + depth * 0.32 + turbidity * 0.14, 0.0, 0.78);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });

  const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.renderOrder = 2;
  waterGroup.add(waterMesh);

  let lastHoverSimTime = 0;
  let simAccumulator = 0;
  const FIXED_TIMESTEP = 1 / 60;

  return {
    group: waterGroup,
    mesh: waterMesh,
    update(dt: number, elapsed: number, windStrength: number, flowSpeed: number, rainIntensity: number = 0) {
      currentSimTime = elapsed;

      // Smooth tide interpolation
      if (Math.abs(tideOffset - targetTideOffset) > 0.001) {
        tideOffset += (targetTideOffset - tideOffset) * Math.min(1.0, dt * 1.8);
        currentWaterLevel = getWaterLevel(tideOffset);
        waterMaterial.uniforms.uWaterLevel.value = currentWaterLevel;
        waterMaterial.uniforms.uTideOffset.value = tideOffset;
      }

      waterMaterial.uniforms.uTime.value = elapsed;
      waterMaterial.uniforms.uWindStrength.value = windStrength;
      waterMaterial.uniforms.uFlowSpeed.value = flowSpeed;
      waterMaterial.uniforms.uRainIntensity.value = THREE.MathUtils.clamp(rainIntensity, 0.0, 1.0);

      // Update analytical ripples
      while (analyticalRipples.length > 0 && elapsed - analyticalRipples[0].startTime > 3.0) {
        analyticalRipples.shift();
      }

      const activeAnalyticalCount = Math.min(MAX_ANALYTICAL_RIPPLES, analyticalRipples.length);
      for (let i = 0; i < activeAnalyticalCount; i++) {
        const rip = analyticalRipples[i];
        const base = i * 4;
        analyticalBuffer[base] = rip.x;
        analyticalBuffer[base + 1] = rip.z;
        analyticalBuffer[base + 2] = rip.startTime;
        analyticalBuffer[base + 3] = rip.strength;
      }
      waterMaterial.uniforms.uAnalyticalCount.value = activeAnalyticalCount;

      // Fixed timestep GPU simulation step
      if (useGpuSimulation && rtA && rtB) {
        simAccumulator += Math.min(dt, 0.1);
        let steps = 0;

        const prevRT = renderer.getRenderTarget();
        const prevAutoClear = renderer.autoClear;

        try {
          renderer.autoClear = false;
          let targetA: THREE.WebGLRenderTarget = rtA;
          let targetB: THREE.WebGLRenderTarget = rtB;

          while (simAccumulator >= FIXED_TIMESTEP && steps < 3) {
            simMaterial.uniforms.uPrevTexture.value = targetA.texture;
            renderer.setRenderTarget(targetB);
            renderer.render(simScene, simCamera);

            const tmp: THREE.WebGLRenderTarget = targetA;
            targetA = targetB;
            targetB = tmp;

            simAccumulator -= FIXED_TIMESTEP;
            steps++;
          }
          rtA = targetA;
          rtB = targetB;

          // Prevent backlog buildup
          simAccumulator = Math.min(simAccumulator, FIXED_TIMESTEP * 1.5);
        } finally {
          renderer.setRenderTarget(prevRT);
          renderer.autoClear = prevAutoClear;
        }

        if (rtA) {
          waterMaterial.uniforms.uRippleMap.value = rtA.texture;
        }
      }
    },
    addRipple(worldX: number, worldZ: number, strength: number) {
      if (!isInWater(worldX, worldZ, tideOffset)) return;

      // Rate-limit hover impulses using simulation time
      if (strength < 0.25 && currentSimTime - lastHoverSimTime < 0.05) return;
      lastHoverSimTime = currentSimTime;

      const uvX = (worldX + halfW) / DIORAMA_WIDTH;
      const uvZ = (worldZ - minZ) / (maxZ - minZ);
      if (uvX < 0 || uvX > 1 || uvZ < 0 || uvZ > 1) return;

      if (useGpuSimulation && rtA) {
        const prevRT = renderer.getRenderTarget();
        const prevAutoClear = renderer.autoClear;

        try {
          renderer.autoClear = false;
          impulseMat.uniforms.uStrength.value = strength;
          impulseMesh.position.set(uvX, uvZ, 0);
          impulseMesh.scale.setScalar(0.08 + Math.min(1.0, strength) * 0.08);

          renderer.setRenderTarget(rtA);
          renderer.render(impulseScene, impulseCamera);
        } finally {
          renderer.setRenderTarget(prevRT);
          renderer.autoClear = prevAutoClear;
        }
      } else {
        // Analytical fallback queue
        if (analyticalRipples.length >= MAX_ANALYTICAL_RIPPLES) {
          analyticalRipples.shift();
        }
        analyticalRipples.push({
          x: worldX,
          z: worldZ,
          startTime: currentSimTime,
          strength,
        });
      }
    },
    setTide(tide: TideLevel, smooth: boolean = true) {
      targetTideOffset = tide === 'low' ? -1.0 : 1.0;
      targetWaterLevel = tide === 'low' ? SEA_LEVEL_LOW : SEA_LEVEL_HIGH;
      if (!smooth) {
        tideOffset = targetTideOffset;
        currentWaterLevel = targetWaterLevel;
        waterMaterial.uniforms.uWaterLevel.value = currentWaterLevel;
        waterMaterial.uniforms.uTideOffset.value = tideOffset;
      }
    },
    getWaterLevel() {
      return currentWaterLevel;
    },
    getTideOffset() {
      return tideOffset;
    },
    setSunLighting(sunDir: THREE.Vector3, sunCol: THREE.Color, skyCol: THREE.Color) {
      waterMaterial.uniforms.uSunDirection.value.copy(sunDir);
      waterMaterial.uniforms.uSunColor.value.copy(sunCol);
      waterMaterial.uniforms.uSunsetSkyColor.value.copy(skyCol);
    },
    updateBoatCavities(cavities) {
      waterMaterial.uniforms.uThungInvMatrix.value.copy(cavities.thungInvMatrix);
      waterMaterial.uniforms.uGheInvMatrix.value.copy(cavities.gheInvMatrix);
    },
    setForceAnalyticalFallback(force: boolean) {
      useGpuSimulation = !force && Boolean(rtA && rtB);
      waterMaterial.uniforms.uUseGpu.value = useGpuSimulation ? 1.0 : 0.0;
    },
    isUsingGpuSimulation() {
      return useGpuSimulation;
    },
    onContextRestored() {
      if (useGpuSimulation && rtA && rtB) {
        try {
          const prevRT = renderer.getRenderTarget();
          const prevClearColor = new THREE.Color();
          renderer.getClearColor(prevClearColor);
          const prevClearAlpha = renderer.getClearAlpha();
          try {
            renderer.setClearColor(0x000000, 0);
            renderer.setRenderTarget(rtA);
            renderer.clear();
            renderer.setRenderTarget(rtB);
            renderer.clear();
          } finally {
            renderer.setRenderTarget(prevRT);
            renderer.setClearColor(prevClearColor, prevClearAlpha);
          }
        } catch (e) {
          console.warn('Failed to re-clear simulation targets on context restored:', e);
        }
      }
    },
    dispose() {
      waterGeo.dispose();
      waterMaterial.dispose();
      if (rtA) {
        rtA.dispose();
        rtA = null;
      }
      if (rtB) {
        rtB.dispose();
        rtB = null;
      }
      simMaterial.dispose();
      simQuadGeo.dispose();
      impulseMat.dispose();
      impulseGeo.dispose();
      waterGroup.clear();
      parentGroup.remove(waterGroup);
    },
  };
}

export const createPhuQuocWater = createBeachWater;
