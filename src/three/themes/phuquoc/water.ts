import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  SEA_LEVEL_BASE,
  SEA_LEVEL_LOW,
  SEA_LEVEL_HIGH,
  WATER_RES,
  PHUQUOC_COLORS,
  TideLevel,
} from './constants';
import { getShoreZ, getWaterLevel, isInWater } from './shoreline';

export interface PhuQuocWaterSystem {
  group: THREE.Group;
  mesh: THREE.Mesh; // Raycast picking mesh
  update(dt: number, elapsed: number, windStrength: number, flowSpeed: number): void;
  addRipple(worldX: number, worldZ: number, strength: number): void;
  setTide(tide: TideLevel, smooth?: boolean): void;
  getWaterLevel(): number;
  dispose(): void;
}

export function createPhuQuocWater(
  renderer: THREE.WebGLRenderer,
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number
): PhuQuocWaterSystem {
  const waterGroup = new THREE.Group();
  waterGroup.name = 'PhuQuocWater';
  parentGroup.add(waterGroup);

  const halfW = DIORAMA_WIDTH / 2; // 10
  const halfD = DIORAMA_DEPTH / 2; // 8
  const BASE_Y = -1.5;

  let currentWaterLevel = SEA_LEVEL_HIGH;
  let targetWaterLevel = SEA_LEVEL_HIGH;
  let tideOffset = 1.0;
  let targetTideOffset = 1.0;

  // --- Water Mesh with Fixed Skirt Geometry ---
  // Surface grid over the bay: X in [-10, 10], Z in [-1.5, 8]
  const segX = 120;
  const segZ = 60;
  const minZ = -1.5;
  const maxZ = halfD;

  const positions: number[] = [];
  const uvs: number[] = [];
  const terrainHeights: number[] = [];
  const isSkirtBottom: number[] = []; // 0 for surface / skirt-top, 1 for fixed skirt bottom
  const indices: number[] = [];

  // 1. Surface grid
  for (let iz = 0; iz <= segZ; iz++) {
    const tz = iz / segZ;
    const z = minZ + tz * (maxZ - minZ);
    for (let ix = 0; ix <= segX; ix++) {
      const tx = ix / segX;
      const x = -halfW + tx * DIORAMA_WIDTH;

      positions.push(x, SEA_LEVEL_BASE, z);
      uvs.push(tx, tz);
      terrainHeights.push(getHeightAt(x, z));
      isSkirtBottom.push(0);

      if (ix < segX && iz < segZ) {
        const row1 = iz * (segX + 1) + ix;
        const row2 = (iz + 1) * (segX + 1) + ix;
        indices.push(row1, row2, row1 + 1);
        indices.push(row1 + 1, row2, row2 + 1);
      }
    }
  }

  // 2. Front Cut Vertical Skirt (at Z = maxZ = 8.0)
  // Pin bottom vertices to BASE_Y (-1.5) so it never detaches during tide shifts!
  for (let ix = 0; ix < segX; ix++) {
    const tx0 = ix / segX;
    const tx1 = (ix + 1) / segX;
    const x0 = -halfW + tx0 * DIORAMA_WIDTH;
    const x1 = -halfW + tx1 * DIORAMA_WIDTH;

    const baseIdx = positions.length / 3;

    // Top v0, v1 (at water level, moves with tide)
    positions.push(x0, SEA_LEVEL_BASE, maxZ);
    uvs.push(tx0, 1.0);
    terrainHeights.push(getHeightAt(x0, maxZ));
    isSkirtBottom.push(0);

    positions.push(x1, SEA_LEVEL_BASE, maxZ);
    uvs.push(tx1, 1.0);
    terrainHeights.push(getHeightAt(x1, maxZ));
    isSkirtBottom.push(0);

    // Bottom v2, v3 (at BASE_Y, fixed in world space)
    positions.push(x0, BASE_Y, maxZ);
    uvs.push(tx0, 1.0);
    terrainHeights.push(BASE_Y);
    isSkirtBottom.push(1);

    positions.push(x1, BASE_Y, maxZ);
    uvs.push(tx1, 1.0);
    terrainHeights.push(BASE_Y);
    isSkirtBottom.push(1);

    indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
    indices.push(baseIdx + 1, baseIdx + 2, baseIdx + 3);
  }

  const waterGeo = new THREE.BufferGeometry();
  waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  waterGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  waterGeo.setAttribute('aTerrainH', new THREE.Float32BufferAttribute(terrainHeights, 1));
  waterGeo.setAttribute('aSkirtBottom', new THREE.Float32BufferAttribute(isSkirtBottom, 1));
  waterGeo.setIndex(indices);
  waterGeo.computeVertexNormals();

  // --- Ping-Pong GPU Ripple Simulation ---
  const simRes = WATER_RES;
  const isFloatSupported = renderer.capabilities.isWebGL2 || renderer.extensions.has('OES_texture_float');
  const simType = isFloatSupported ? THREE.FloatType : THREE.HalfFloatType;

  const rtOptions: THREE.RenderTargetOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: simType,
  };

  let rtA = new THREE.WebGLRenderTarget(simRes, simRes, rtOptions);
  let rtB = new THREE.WebGLRenderTarget(simRes, simRes, rtOptions);

  // Clear render targets
  renderer.setRenderTarget(rtA);
  renderer.clearColor();
  renderer.setRenderTarget(rtB);
  renderer.clearColor();
  renderer.setRenderTarget(null);

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
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main() {
        float dist = length(vUv - vec2(0.5));
        float strength = smoothstep(0.5, 0.0, dist) * 0.45;
        gl_FragColor = vec4(strength, 0.0, 0.0, 1.0);
      }
    `,
  });
  const impulseMesh = new THREE.Mesh(impulseGeo, impulseMat);
  impulseScene.add(impulseMesh);
  const impulseCamera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);

  // --- Water Surface ShaderMaterial ---
  const waterMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uWaterLevel: { value: currentWaterLevel },
      uTideOffset: { value: 0 },
      uRippleMap: { value: rtA.texture },
      uShallowColor: { value: PHUQUOC_COLORS.water.shallow },
      uDeepColor: { value: PHUQUOC_COLORS.water.deep },
      uSunsetSkyColor: { value: new THREE.Color(0xffa785) }, // Rose-peach sunset
      uSunDirection: { value: new THREE.Vector3(-0.8, 0.35, -0.4).normalize() },
      uFlowSpeed: { value: 0.45 },
      uWindStrength: { value: 0.35 },
    },
    vertexShader: `
      attribute float aTerrainH;
      attribute float aSkirtBottom;
      uniform float uTime;
      uniform float uWaterLevel;
      uniform float uTideOffset;
      uniform float uWindStrength;
      uniform sampler2D uRippleMap;

      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying float vTerrainH;
      varying float vIsSkirtBottom;
      varying vec3 vViewDir;

      void main() {
        vUv = uv;
        vTerrainH = aTerrainH;
        vIsSkirtBottom = aSkirtBottom;

        vec3 pos = position;
        
        // Only surface and top-skirt vertices move with tide
        if (aSkirtBottom < 0.5) {
          pos.y = uWaterLevel;

          // Gentle ocean swell waves
          float swell = sin(pos.z * 1.8 - uTime * 1.5) * 0.035 * uWindStrength;
          swell += cos(pos.x * 1.2 + pos.z * 0.8 - uTime * 2.0) * 0.02 * uWindStrength;

          // Add GPU ripple displacement
          vec4 ripple = texture2D(uRippleMap, uv);
          pos.y += swell + ripple.r * 0.12;
        }

        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
        vViewDir = normalize(cameraPosition - vWorldPos);

        gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uWaterLevel;
      uniform vec3 uShallowColor;
      uniform vec3 uDeepColor;
      uniform vec3 uSunsetSkyColor;
      uniform vec3 uSunDirection;
      uniform sampler2D uRippleMap;

      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying float vTerrainH;
      varying float vIsSkirtBottom;
      varying vec3 vViewDir;

      void main() {
        // Skirt face styling
        if (vIsSkirtBottom > 0.5 || (vWorldPos.y < uWaterLevel - 0.02 && vWorldPos.z > 7.95)) {
          // Front diorama water cut: crystal translucent teal
          gl_FragColor = vec4(uDeepColor * 0.7, 0.82);
          return;
        }

        // Calculate physical water depth
        float depth = max(0.0, uWaterLevel - vTerrainH);

        // Discard water where terrain is clearly above water line
        if (depth < 0.005) {
          discard;
        }

        // 1. Exponential Beer-Lambert Absorption
        // Water exponentially absorbs red wavelengths first, then green, blue penetrates deep
        vec3 absorptionCoeff = vec3(1.6, 0.5, 0.2);
        vec3 absorption = exp(-depth * absorptionCoeff * 2.2);
        vec3 waterColor = mix(uDeepColor, uShallowColor, absorption);

        // 2. Ripple normal perturbation
        vec2 texel = vec2(1.0 / 256.0);
        float hL = texture2D(uRippleMap, vUv + vec2(-texel.x, 0.0)).r;
        float hR = texture2D(uRippleMap, vUv + vec2(texel.x, 0.0)).r;
        float hD = texture2D(uRippleMap, vUv + vec2(0.0, -texel.y)).r;
        float hU = texture2D(uRippleMap, vUv + vec2(0.0, texel.y)).r;

        vec3 N = normalize(vec3(hL - hR, 0.25, hD - hU));

        // Add subtle procedural swell normal
        N.x += sin(vWorldPos.z * 3.0 + uTime * 2.0) * 0.08;
        N.z += cos(vWorldPos.x * 2.5 - uTime * 1.5) * 0.06;
        N = normalize(N);

        // 3. Sunset Fresnel Reflection
        float F0 = 0.035;
        float cosTheta = max(0.0, dot(N, vViewDir));
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 4.0);

        // Sunset specular highlight (glint on the bay)
        vec3 H = normalize(uSunDirection + vViewDir);
        float NdotH = max(0.0, dot(N, H));
        float specular = pow(NdotH, 64.0) * 0.8;

        // 4. Shore Surf Wave Foam
        // Foam forms where shallow depth meets breaking wave frequency
        float waveBreak = sin(depth * 35.0 - uTime * 3.0) * 0.5 + 0.5;
        float foamFactor = smoothstep(0.08, 0.01, depth) * step(0.4, waveBreak);
        vec3 foamColor = vec3(0.96, 0.99, 1.0);

        // Combine: refracted absorption color + sky reflection + specular + surf foam
        vec3 finalColor = mix(waterColor, uSunsetSkyColor, fresnel * 0.65);
        finalColor += vec3(1.0, 0.8, 0.6) * specular;
        finalColor = mix(finalColor, foamColor, foamFactor * 0.75);

        // Opacity smoothly increases with depth
        float alpha = clamp(0.55 + depth * 0.8, 0.0, 0.92);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });

  const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.renderOrder = 2; // Render after opaque terrain
  waterGroup.add(waterMesh);

  return {
    group: waterGroup,
    mesh: waterMesh,
    update(dt: number, elapsed: number, windStrength: number, flowSpeed: number) {
      // Smooth tide transition
      if (Math.abs(tideOffset - targetTideOffset) > 0.001) {
        tideOffset += (targetTideOffset - tideOffset) * Math.min(1.0, dt * 1.8);
        currentWaterLevel = getWaterLevel(tideOffset);
        waterMaterial.uniforms.uWaterLevel.value = currentWaterLevel;
        waterMaterial.uniforms.uTideOffset.value = tideOffset;
      }

      waterMaterial.uniforms.uTime.value = elapsed;
      waterMaterial.uniforms.uWindStrength.value = windStrength;
      waterMaterial.uniforms.uFlowSpeed.value = flowSpeed;

      // Ping-pong GPU simulation step
      simMaterial.uniforms.uPrevTexture.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, simCamera);

      // Swap render targets
      const tmp = rtA;
      rtA = rtB;
      rtB = tmp;

      renderer.setRenderTarget(null);
      waterMaterial.uniforms.uRippleMap.value = rtA.texture;
    },
    addRipple(worldX: number, worldZ: number, strength: number) {
      // Validate water region
      if (!isInWater(worldX, worldZ, tideOffset)) return;

      // Map world (X, Z) to UV on water simulation texture
      // X in [-10, 10], Z in [-1.5, 8.0]
      const uvX = (worldX + halfW) / DIORAMA_WIDTH;
      const uvZ = (worldZ - minZ) / (maxZ - minZ);

      if (uvX < 0 || uvX > 1 || uvZ < 0 || uvZ > 1) return;

      impulseMesh.position.set(uvX, uvZ, 0);
      impulseMesh.scale.setScalar(0.08 + strength * 0.08);

      renderer.setRenderTarget(rtA);
      renderer.render(impulseScene, impulseCamera);
      renderer.setRenderTarget(null);
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
    dispose() {
      waterGeo.dispose();
      waterMaterial.dispose();
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
      simQuadGeo.dispose();
      impulseMat.dispose();
      impulseGeo.dispose();
      waterGroup.clear();
      parentGroup.remove(waterGroup);
    },
  };
}
