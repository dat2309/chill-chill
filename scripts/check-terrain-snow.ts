import * as THREE from 'three';
import { createTerrain } from '../src/three/themes/garden/terrain.js';

const terrain = createTerrain(new THREE.Scene());
terrain.updateSeason('winter', 1);
const mesh = terrain.group.getObjectByName('DioramaTerrainMesh') as THREE.Mesh;
const p = mesh.geometry.getAttribute('position');
const n = mesh.geometry.getAttribute('normal');
const c = mesh.geometry.getAttribute('color');
const idx = mesh.geometry.index!;
const count = mesh.geometry.userData.topVertexCount;

// 1. Smoothness check: adjacent vertices on smooth mountain faces must not have hard color jumps
let worst = 0, where: unknown, samples = 0;
for (let i = 0; i < idx.count; i += 3) {
  for (let j = 0; j < 3; j++) {
    const a = idx.getX(i + j);
    const b = idx.getX(i + (j + 1) % 3);
    if (a >= count || b >= count) continue;
    if (p.getZ(a) > -3.6 || p.getZ(b) > -3.6 || p.getY(a) < 2.25 || p.getY(b) < 2.25) continue;
    if (Math.abs(n.getY(a) - n.getY(b)) > 0.025) continue;
    const distance = new THREE.Vector3().fromBufferAttribute(p, a).distanceTo(new THREE.Vector3().fromBufferAttribute(p, b));
    if (distance > 0.14) continue;
    const colorDelta = new THREE.Vector3().fromBufferAttribute(c, a).distanceTo(new THREE.Vector3().fromBufferAttribute(c, b));
    samples++;
    if (colorDelta > worst) {
      worst = colorDelta;
      where = {
        a: [p.getX(a), p.getY(a), p.getZ(a), n.getY(a)],
        b: [p.getX(b), p.getY(b), p.getZ(b), n.getY(b)],
      };
    }
  }
}
console.log('Smoothness check:', { samples, worst });
if (samples < 100 || worst > 0.20) {
  throw new Error(`Smooth mountain faces must not acquire a hard winter snow-color contour (worst: ${worst})`);
}

// 2. Snow coverage ratio by elevation tier
let peakTotal = 0, peakSnow = 0; // y > 3.0 (mountain peaks)
let highTotal = 0, highSnow = 0; // 2.5 < y <= 3.0 (high slopes)
let midTotal = 0, midSnow = 0;   // 2.0 < y <= 2.5 (mid slopes)

for (let i = 0; i < count; i++) {
  const y = p.getY(i);
  const z = p.getZ(i);
  const r = c.getX(i);
  const g = c.getY(i);
  const b = c.getZ(i);

  const lightness = (r + g + b) / 3;
  const isWhiteSnow = lightness > 0.78 && b >= r - 0.05;

  if (z < -3.6) {
    if (y > 3.0) {
      peakTotal++;
      if (isWhiteSnow) peakSnow++;
    } else if (y > 2.5) {
      highTotal++;
      if (isWhiteSnow) highSnow++;
    } else if (y > 2.0) {
      midTotal++;
      if (isWhiteSnow) midSnow++;
    }
  }
}

const peakRatio = peakSnow / peakTotal;
const highRatio = highSnow / highTotal;
const midRatio = midSnow / midTotal;

console.log(`Peak (y > 3.0) snow coverage: ${(peakRatio * 100).toFixed(1)}% (${peakSnow}/${peakTotal})`);
console.log(`High slope (2.5 < y <= 3.0) snow coverage: ${(highRatio * 100).toFixed(1)}% (${highSnow}/${highTotal})`);
console.log(`Mid slope (2.0 < y <= 2.5) snow coverage: ${(midRatio * 100).toFixed(1)}% (${midSnow}/${midTotal})`);

terrain.dispose();

// Assert that snow is clearly visible on peaks (>= 80%) and high slopes (>= 40%)
if (peakRatio < 0.80) {
  throw new Error(`Peak snow coverage too low: ${(peakRatio * 100).toFixed(1)}% < 80%`);
}
if (highRatio < 0.40) {
  throw new Error(`High slope snow coverage too low: ${(highRatio * 100).toFixed(1)}% < 40%`);
}

console.log('PASS: Winter snow coverage test passed (peaks >= 80%, high slopes >= 40%, smooth contour)!');
