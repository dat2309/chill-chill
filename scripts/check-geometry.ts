import { createStreamGeometry } from '../src/three/themes/garden/water';
import * as THREE from 'three';
import { createTerrain } from '../src/three/themes/garden/terrain';
import { createBeachTerrain } from '../src/three/themes/beach/terrain';
import { GARDEN_BOUNDARY_POINTS } from '../src/three/themes/garden/footprint';
import { BEACH_BOUNDARY_POINTS } from '../src/three/themes/beach/footprint';

// Check actual generated triangles, rather than normals supplied to the shader.
for (const [name, system] of [
  ['garden', createTerrain(new THREE.Scene())],
  ['beach', createBeachTerrain(new THREE.Group())],
] as const) {
  const mesh = system.group.children.find(o => o instanceof THREE.Mesh) as THREE.Mesh;
  const geometry = mesh.geometry;
  const position = geometry.getAttribute('position');
  const index = geometry.getIndex()!;
  const topCount = geometry.userData.topVertexCount ?? (1 + 140 * 256);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let top = 0, bottom = 0, walls = 0;
  for (let i = 0; i < index.count; i += 3) {
    const ids = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    a.fromBufferAttribute(position, ids[0]);
    b.fromBufferAttribute(position, ids[1]);
    c.fromBufferAttribute(position, ids[2]);
    const normal = b.clone().sub(a).cross(c.clone().sub(a));
    if (normal.lengthSq() < 1e-16) throw new Error(`${name}: degenerate triangle ${i / 3}`);
    if (ids.every(id => id < topCount)) {
      if (normal.y <= 0) throw new Error(`${name}: inverted top`);
      top++;
    } else if (Math.abs(a.y - b.y) < 1e-6 && Math.abs(a.y - c.y) < 1e-6) {
      if (normal.y >= 0) throw new Error(`${name}: inverted bottom`);
      bottom++;
    } else {
      const center = a.clone().add(b).add(c).divideScalar(3);
      if (normal.x * center.x + normal.z * center.z <= 0) throw new Error(`${name}: inward wall`);
      walls++;
    }
  }
  console.log(`${name}: ${top} upward top, ${walls} outward wall/bevel, ${bottom} downward bottom triangles`);
  system.dispose();
}
for (const points of [GARDEN_BOUNDARY_POINTS, BEACH_BOUNDARY_POINTS]) {
  // Convex display perimeters cannot self-intersect; every turn must agree.
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length], c = points[(i + 2) % points.length];
    if ((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x) < -1e-8) {
      throw new Error('Display perimeter has a reversed turn');
    }
  }
}
console.log('Both display perimeters are closed, convex and free of intersections.');

// The front display cut must reuse the exact last surface row.
const terrain = createTerrain(new THREE.Scene());
const water = createStreamGeometry(terrain.getHeightAt);
const waterPosition = water.getAttribute('position');
const cut = water.getAttribute('aIsFrontCut');
const uv = water.getAttribute('uv');
const lastRow = 140 * 55;
const frontStart = 141 * 55;
for (let x = 0; x <= 54; x++) {
  const top = frontStart + x * 2;
  for (const axis of ['getX', 'getY', 'getZ'] as const) {
    if (waterPosition[axis](lastRow + x) !== waterPosition[axis](top)) throw new Error('Water cut detached from surface');
  }
}
const waterIndex = water.getIndex()!;
for (let i = 0; i < waterIndex.count; i += 3) {
  const ids = [waterIndex.getX(i), waterIndex.getX(i + 1), waterIndex.getX(i + 2)];
  const [a,b,c] = ids.map(id => new THREE.Vector3().fromBufferAttribute(waterPosition,id));
  const n = b.clone().sub(a).cross(c.clone().sub(a));
  if (cut.getX(ids[0]) < 0.5 && n.y <= 0) throw new Error('Inverted water top');
  // Skirt height responds to tide in the shader; check its winding at high tide.
  if (cut.getX(ids[0]) > 0.5) {
    for (let j=0;j<3;j++) if (uv.getY(ids[j]) > 0.5) [a,b,c][j].y += 0.07;
    const face = b.clone().sub(a).cross(c.clone().sub(a));
    if (face.z < -1e-8) throw new Error('Inverted water cut');
  }
}
water.dispose(); terrain.dispose();
console.log('Garden water top/cut winding and shared seam passed.');
