import * as THREE from 'three';
import { SEED } from './constants';
import { getWaterDepth, isInWater, PIER_CONFIG } from './shoreline';
import { SeededRandom } from '../../core/noise';

export interface PhuQuocFishSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, waterLevel: number): void;
  reactToRipple(x: number, z: number): void;
  dispose(): void;
}

interface FishAgent {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  targetDepth: number;
  swimSpeed: number;
  wanderAngle: number;
  colorType: 'yellow' | 'blue' | 'clown';
}

export function createPhuQuocFish(
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number
): PhuQuocFishSystem {
  const fishGroup = new THREE.Group();
  fishGroup.name = 'PhuQuocFish';
  parentGroup.add(fishGroup);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // Fish geometry template (pointed nose, tapered body, tail fin)
  const fishGeo = new THREE.BufferGeometry();
  const fVerts = [
    // Nose
    0, 0, 0.12,
    // Mid body
    -0.035, 0.025, 0.0,
    0.035, 0.025, 0.0,
    -0.035, -0.025, 0.0,
    0.035, -0.025, 0.0,
    // Tail base
    0, 0, -0.09,
    // Tail fin
    0, 0.05, -0.15,
    0, -0.05, -0.15,
  ];

  const fIndices = [
    // Front pyramid
    0, 1, 2,
    0, 3, 1,
    0, 2, 4,
    0, 4, 3,
    // Rear taper
    1, 5, 2,
    3, 5, 1,
    2, 5, 4,
    4, 5, 3,
    // Tail fin
    5, 6, 7,
  ];

  fishGeo.setAttribute('position', new THREE.Float32BufferAttribute(fVerts, 3));
  fishGeo.setIndex(fIndices);
  fishGeo.computeVertexNormals();
  geometriesToDispose.push(fishGeo);

  // Tropical palettes
  const colorPalettes = [
    { type: 'yellow', color: new THREE.Color(0xffd54f) }, // Yellow tang
    { type: 'blue', color: new THREE.Color(0x29b6f6) },   // Blue tang
    { type: 'clown', color: new THREE.Color(0xff7043) },  // Clownfish orange
  ];

  const fishCount = 14;
  const agents: FishAgent[] = [];
  const rng = new SeededRandom(SEED + 303);

  for (let i = 0; i < fishCount; i++) {
    const pal = colorPalettes[i % colorPalettes.length];
    const mat = new THREE.MeshLambertMaterial({
      color: pal.color,
      side: THREE.DoubleSide,
    });
    materialsToDispose.push(mat);

    const mesh = new THREE.Mesh(fishGeo, mat);
    fishGroup.add(mesh);

    // Initial position in the bay (Z > 3.0)
    const initX = rng.range(-6.0, 5.0);
    const initZ = rng.range(3.5, 7.2);
    const pos = new THREE.Vector3(initX, 0.1, initZ);

    agents.push({
      mesh,
      position: pos,
      velocity: new THREE.Vector3(rng.range(-0.2, 0.2), 0, rng.range(-0.2, 0.2)),
      targetDepth: rng.range(0.08, 0.25),
      swimSpeed: rng.range(0.35, 0.7),
      wanderAngle: rng.range(0, Math.PI * 2),
      colorType: pal.type as any,
    });
  }

  return {
    group: fishGroup,
    update(dt: number, elapsed: number, waterLevel: number) {
      const pCfg = PIER_CONFIG;

      agents.forEach((fish, idx) => {
        // 1. Wandering and schooling
        fish.wanderAngle += (rng.next() - 0.5) * 1.5 * dt;
        const wanderForce = new THREE.Vector3(
          Math.cos(fish.wanderAngle) * 0.4,
          0,
          Math.sin(fish.wanderAngle) * 0.4
        );

        fish.velocity.addScaledVector(wanderForce, dt);

        // 2. Avoid shoreline and shallow water
        const bedH = getHeightAt(fish.position.x, fish.position.z);
        const depth = waterLevel - bedH;

        if (depth < 0.12) {
          // Push away from shallow water into deep bay (positive Z)
          fish.velocity.z += 1.2 * dt;
          fish.velocity.x += (fish.position.x > 0 ? -0.5 : 0.5) * dt;
        }

        // Avoid pier pilings
        const distToPier = Math.abs(fish.position.x - pCfg.startX);
        if (distToPier < 0.8 && fish.position.z >= pCfg.startZ && fish.position.z <= pCfg.endZ) {
          const pushX = fish.position.x > pCfg.startX ? 1.0 : -1.0;
          fish.velocity.x += pushX * 1.5 * dt;
        }

        // Diorama bay boundary bounce
        if (fish.position.x < -8.5) fish.velocity.x += 1.5 * dt;
        if (fish.position.x > 8.5) fish.velocity.x -= 1.5 * dt;
        if (fish.position.z > 7.4) fish.velocity.z -= 1.5 * dt;
        if (fish.position.z < 2.5) fish.velocity.z += 1.5 * dt;

        // Speed limit
        fish.velocity.clampLength(0.15, fish.swimSpeed);

        // Update position
        fish.position.addScaledVector(fish.velocity, dt);

        // Target depth: maintain comfortable elevation below waterLevel and above seabed
        const safeY = Math.max(bedH + 0.05, waterLevel - fish.targetDepth);
        fish.position.y += (safeY - fish.position.y) * Math.min(1.0, dt * 2.0);

        fish.mesh.position.copy(fish.position);

        // Heading rotation and gentle tail wiggle
        const heading = Math.atan2(fish.velocity.x, fish.velocity.z);
        const wiggle = Math.sin(elapsed * 6.0 + idx) * 0.15;
        fish.mesh.rotation.set(0, heading + wiggle, 0);
      });
    },
    reactToRipple(x: number, z: number) {
      // Dart rapidly away from ripple disturbance
      agents.forEach((fish) => {
        const dx = fish.position.x - x;
        const dz = fish.position.z - z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 2.5 && dist > 0.01) {
          const impulse = (2.5 - dist) * 1.8;
          fish.velocity.x += (dx / dist) * impulse;
          fish.velocity.z += (dz / dist) * impulse;
        }
      });
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      fishGroup.clear();
      parentGroup.remove(fishGroup);
    },
  };
}
