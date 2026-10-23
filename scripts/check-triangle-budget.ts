import * as THREE from 'three';
import { GardenTheme } from '../src/three/themes/garden/index.js';
import { BeachTheme } from '../src/three/themes/beach/index.js';

export function countGroupTriangles(group: THREE.Object3D): { total: number; breakdown: Record<string, number> } {
  let total = 0;
  const breakdown: Record<string, number> = {};

  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const geom = obj.geometry;
      if (!geom) return;
      const baseTris = geom.index
        ? geom.index.count / 3
        : (geom.attributes.position ? geom.attributes.position.count / 3 : 0);
      const instances = (obj instanceof THREE.InstancedMesh) ? obj.count : 1;
      const meshTris = Math.round(baseTris * instances);
      total += meshTris;
      const name = obj.name || obj.constructor.name || 'unnamed';
      breakdown[name] = (breakdown[name] || 0) + meshTris;
    }
  });

  return { total, breakdown };
}

async function run() {
  const mockRenderer = {} as THREE.WebGLRenderer;
  const garden = new GardenTheme(mockRenderer);
  await garden.init();

  const groups: Record<string, THREE.Object3D | null | undefined> = {
    terrain: garden['terrain']?.group,
    vegetation: garden['vegetation']?.group,
    architecture: garden['architecture']?.group,
    water: garden['water']?.group,
    fish: garden['fish']?.group,
  };

  let grandTotal = 0;
  console.log('--- GARDEN TRIANGLE BUDGET REPORT ---');
  for (const [name, grp] of Object.entries(groups)) {
    if (!grp) continue;
    const { total, breakdown } = countGroupTriangles(grp);
    grandTotal += total;
    console.log(`\n[Group: ${name}] Total: ${total.toLocaleString()} triangles`);
    const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
    for (const [meshName, tris] of sorted.slice(0, 10)) {
      console.log(`  - ${meshName}: ${tris.toLocaleString()}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`GRAND TOTAL GARDEN TRIANGLES: ${grandTotal.toLocaleString()}`);
  console.log(`BUDGET LIMIT: 400,000`);
  console.log(`========================================`);

  if (grandTotal > 400_000) {
    console.error(`FAILED: Grand total ${grandTotal} exceeds 400k triangle budget!`);
    process.exit(1);
  } else {
    console.log(`PASSED: Triangle count within budget (${grandTotal.toLocaleString()} <= 400,000)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
