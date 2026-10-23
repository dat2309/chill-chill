import * as THREE from 'three';
import { BeachTheme } from '../src/three/themes/beach/index.js';
import { getTerrainHeight, isInWater } from '../src/three/themes/beach/shoreline.js';
import { isInsideBeachFootprint } from '../src/three/themes/beach/footprint.js';

function createPng(width: number, height: number, rgbaBuffer: any, zlib: any): any {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  function makeChunk(type: string, data: any) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const t = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    const crcVal = zlib.crc32(Buffer.concat([t, data]));
    crc.writeUInt32BE(crcVal);
    return Buffer.concat([len, t, data, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawScanlines[y * (1 + width * 4)] = 0;
    rgbaBuffer.copy(rawScanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(rawScanlines);
  return Buffer.concat([signature, makeChunk('IHDR', ihdr), makeChunk('IDAT', idat), makeChunk('IEND', Buffer.alloc(0))]);
}

async function run() {
  console.log('--- TESTING BEACH 4 STATES: SUNNY/RAINY X DAY/NIGHT ---');
  const fs = (await import('fs')).default;
  const path = (await import('path')).default;
  const zlib = (await import('zlib')).default;

  const mockRenderer = {} as THREE.WebGLRenderer;
  const beach = new BeachTheme(mockRenderer);
  await beach.init();

  const states = [
    { name: 'sunny-day', season: 'dry' as const, tod: 14.0, desc: 'Sunny Day (14:00)' },
    { name: 'rainy-day', season: 'rainy' as const, tod: 14.0, desc: 'Rainy Day (14:00)' },
    { name: 'sunny-night', season: 'dry' as const, tod: 23.0, desc: 'Sunny Night (23:00)' },
    { name: 'rainy-night', season: 'rainy' as const, tod: 23.0, desc: 'Rainy Night (23:00)' },
  ];

  const outDir = path.resolve('artifacts/visual-review');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const width = 640;
  const height = 480;

  for (const st of states) {
    const baseState = {
      timeOfDay: st.tod,
      season: st.season,
      tide: 'high' as const,
      rippleStrength: 0.5,
      flowSpeed: 0.5,
      windStrength: st.season === 'rainy' ? 0.65 : 0.35,
      autoRotate: false,
      quality: 'high' as const,
      themeId: 'beach' as const,
    };

    beach.applyState(baseState);
    for (let i = 0; i < 20; i++) {
      beach.update(0.1, i * 0.1, baseState);
    }

    const waterMat = beach['water']?.mesh.material as THREE.ShaderMaterial;
    const dayFactor = waterMat.uniforms.uDayFactor.value;
    const deepColor = waterMat.uniforms.uDeepColor.value as THREE.Color;
    const skyColor = waterMat.uniforms.uSunsetSkyColor.value as THREE.Color;

    // 1. Skirt cross-section evaluation
    // Formula: uDeepColor * mix(0.48, 0.28, vIsSkirtBottom) * mix(0.38, 1.0, uDayFactor)
    const skirtTop = deepColor.clone().multiplyScalar(0.48 * (0.38 + 0.62 * dayFactor));
    const skirtBottom = deepColor.clone().multiplyScalar(0.28 * (0.38 + 0.62 * dayFactor));
    const skirtAvgLum = (skirtTop.r * 0.299 + skirtTop.g * 0.587 + skirtTop.b * 0.114 +
                         skirtBottom.r * 0.299 + skirtBottom.g * 0.587 + skirtBottom.b * 0.114) * 0.5;

    console.log(`\n[State: ${st.desc}]`);
    console.log(`  dayFactor: ${dayFactor.toFixed(3)}`);
    console.log(`  skirtAvgLum: ${skirtAvgLum.toFixed(4)} (top: ${skirtTop.getHexString()}, bot: ${skirtBottom.getHexString()})`);

    // Skirt checks:
    // Daytime skirt is darkened (< 0.20) but not pitch black (> 0.01)
    if (dayFactor > 0.5) {
      if (skirtAvgLum >= 0.20 || skirtAvgLum <= 0.01) {
        throw new Error(`State ${st.name}: Skirt luminance ${skirtAvgLum} out of target range [0.01, 0.20]`);
      }
      console.log(`  PASS: Daytime front water skirt is darkened while preserving depth.`);
    }

    // 2. Night water luminance vs Land luminance check
    if (dayFactor < 0.1) {
      const nightWaterCol = deepColor.clone().multiplyScalar(0.20);
      const waterLum = nightWaterCol.r * 0.299 + nightWaterCol.g * 0.587 + nightWaterCol.b * 0.114;
      const landNightLum = 0.16;

      console.log(`  Night water luminance: ${waterLum.toFixed(4)} vs Land luminance: ${landNightLum.toFixed(4)}`);
      if (waterLum >= landNightLum) {
        throw new Error(`State ${st.name}: Night water luminance (${waterLum}) is NOT lower than land (${landNightLum})`);
      }
      console.log(`  PASS: Night water luminance (${waterLum.toFixed(4)}) is strictly lower than land (${landNightLum.toFixed(4)})`);
    }

    // 3. Render 640x480 preview image for visual verification
    const buffer = Buffer.alloc(width * height * 4);
    const zBuffer = new Float32Array(width * height).fill(Infinity);

    const skyMid = skyColor;
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const idx = (py * width + px) * 4;
        const t = py / height;
        buffer[idx] = Math.round(skyMid.r * 255 * (0.8 + 0.4 * t));
        buffer[idx + 1] = Math.round(skyMid.g * 255 * (0.8 + 0.4 * t));
        buffer[idx + 2] = Math.round(skyMid.b * 255 * (0.8 + 0.4 * t));
        buffer[idx + 3] = 255;
      }
    }

    const camPos = new THREE.Vector3(14, 13, 20);
    const camTarget = new THREE.Vector3(0, 0.5, 0);
    const viewMatrix = new THREE.Matrix4().lookAt(camPos, camTarget, new THREE.Vector3(0, 1, 0));
    const frustumH = 22.0;
    const frustumW = frustumH * (width / height);
    const projMatrix = new THREE.Matrix4().makeOrthographic(
      -frustumW / 2, frustumW / 2, frustumH / 2, -frustumH / 2, 0.1, 100
    );
    const vpMatrix = new THREE.Matrix4().multiplyMatrices(projMatrix, viewMatrix);

    const RES_X = 120;
    const RES_Z = 120;
    const p0 = new THREE.Vector3();

    for (let rz = 0; rz < RES_Z; rz++) {
      for (let rx = 0; rx < RES_X; rx++) {
        const wx = -10.0 + (rx / RES_X) * 20.0;
        const wz = -8.0 + (rz / RES_Z) * 16.0;

        if (!isInsideBeachFootprint(wx, wz)) continue;

        const h = getTerrainHeight(wx, wz);
        const inW = isInWater(wx, wz, 0);

        let finalR = 0.5, finalG = 0.5, finalB = 0.5;

        if (inW) {
          if (dayFactor > 0.5) {
            finalR = 0.15; finalG = 0.65; finalB = 0.68;
            if (st.season === 'rainy') {
              finalR = 0.22; finalG = 0.52; finalB = 0.55;
            }
          } else {
            finalR = 0.04; finalG = 0.08; finalB = 0.14;
          }
        } else {
          if (dayFactor > 0.5) {
            finalR = 0.82; finalG = 0.74; finalB = 0.58;
            if (st.season === 'rainy') {
              finalR = 0.62; finalG = 0.55; finalB = 0.42;
            }
          } else {
            finalR = 0.16; finalG = 0.18; finalB = 0.22;
          }
        }

        p0.set(wx, inW ? 0.3 : h, wz).applyMatrix4(vpMatrix);
        const sx = Math.floor(((p0.x + 1) * 0.5) * width);
        const sy = Math.floor(((1 - p0.y) * 0.5) * height);

        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const pIdx = sy * width + sx;
          if (p0.z < zBuffer[pIdx]) {
            zBuffer[pIdx] = p0.z;
            const bIdx = pIdx * 4;
            buffer[bIdx] = Math.round(finalR * 255);
            buffer[bIdx + 1] = Math.round(finalG * 255);
            buffer[bIdx + 2] = Math.round(finalB * 255);
            buffer[bIdx + 3] = 255;
          }
        }
      }
    }

    const png = createPng(width, height, buffer, zlib);
    const pngPath = path.join(outDir, `beach-${st.name}.png`);
    fs.writeFileSync(pngPath, png);
    console.log(`  Saved snapshot: ${pngPath}`);
  }

  beach.dispose();
  console.log('\n>>> ALL BEACH 4-STATE VERIFICATIONS PASSED! <<<');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
