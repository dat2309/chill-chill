import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  WATER_LEVEL,
  COLORS,
  Season,
  SEASON_PALETTES,
} from './constants';
import { SeededRandom, simplexNoise3D } from './noise';
import { isInsideGardenFootprint } from './footprint';
import { GARDEN_STEPPING_STONES } from './architecture';

export interface VegetationSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number): void;
  updateSeason(season: Season, t: number): void;
  dispose(): void;
}

interface ExclusionBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Building footprints and clear sightline corridor
const EXCLUSION_BOXES: ExclusionBox[] = [
  { minX: -7.0, maxX: -5.0, minZ: -3.2, maxZ: -1.2 }, // Dome 1 & deck
  { minX: -4.8, maxX: -2.8, minZ: -2.8, maxZ: -0.8 }, // Dome 2 & deck
  { minX: -5.3, maxX: -3.3, minZ: -0.90, maxZ: 1.10 }, // Dome 3 & deck
  { minX: -2.0, maxX: 0.1,  minZ: -3.6, maxZ: -1.2 }, // Cabin & deck
  { minX: -3.8, maxX: -2.6, minZ: -1.4, maxZ: -0.2 }, // Campfire
  { minX: -7.0, maxX: -5.4, minZ: -1.2, maxZ: 0.2 },  // Picnic table
  { minX: 4.4,  maxX: 6.4,  minZ: 3.4,  maxZ: 5.5 },  // SUP board & beach props on bank
];

function isInsideBuildingExclusion(x: number, z: number, pad: number = 0.2): boolean {
  for (let i = 0; i < EXCLUSION_BOXES.length; i++) {
    const b = EXCLUSION_BOXES[i];
    if (x >= b.minX - pad && x <= b.maxX + pad && z >= b.minZ - pad && z <= b.maxZ + pad) {
      return true;
    }
  }
  return false;
}

function isNearWalkingTrail(x: number, z: number, clearance = 0.35): boolean {
  for (let i = 0; i < GARDEN_STEPPING_STONES.length; i++) {
    const st = GARDEN_STEPPING_STONES[i];
    const r = (st.r ?? 0.22) + clearance;
    const dx = x - st.x;
    const dz = z - st.z;
    if (dx * dx + dz * dz < r * r) {
      return true;
    }
  }
  return false;
}

export function createVegetation(
  scene: THREE.Scene,
  getHeightAt: (x: number, z: number) => number,
  getSlopeAt: (x: number, z: number) => number,
  isInStream: (x: number, z: number) => boolean,
  isOnPlateau: (x: number, z: number) => boolean
): VegetationSystem {
  const group = new THREE.Group();
  group.name = 'VegetationSystem';

  const vRng = new SeededRandom(777);
  const halfW = DIORAMA_WIDTH * 0.5;
  const halfD = DIORAMA_DEPTH * 0.5;

  const dummy = new THREE.Object3D();

  // 1. PINE / CONIFER TREES (~26 well-scaled trees in natural alpine groves, not in a rigid line)
  // Height: 1.4 - 2.3, Radius: 0.36 - 0.58, with varied silhouettes per tree
  const pineTrunkGeom = new THREE.CylinderGeometry(0.04, 0.08, 1.0, 6);
  pineTrunkGeom.translate(0, 0.5, 0);

  // 9-segment cone with smooth vertex normals for rich evergreen light wrap (never black)
  const pineConeGeom = new THREE.ConeGeometry(1.0, 1.0, 9);
  pineConeGeom.computeVertexNormals();
  pineConeGeom.translate(0, 0.5, 0);

  const pineTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x5c4230,
    roughness: 0.88,
    metalness: 0.05,
    flatShading: true,
  });

  const pineFoliageMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base so instanceColor reflects exact alpine evergreen tint
    roughness: 0.65,
    metalness: 0.03,
    flatShading: false, // Smooth cone lighting wrap so shaded sides retain rich evergreen depth
  });

  const pineCount = 26;
  const maxPineLayers = 5;
  const pineTrunkMesh = new THREE.InstancedMesh(pineTrunkGeom, pineTrunkMat, pineCount);
  const pineFoliageMesh = new THREE.InstancedMesh(pineConeGeom, pineFoliageMat, pineCount * maxPineLayers);
  pineTrunkMesh.castShadow = true;
  pineFoliageMesh.castShadow = true;
  pineFoliageMesh.receiveShadow = true;
  group.add(pineTrunkMesh);
  group.add(pineFoliageMesh);

  interface PineInstance {
    x: number;
    y: number;
    z: number;
    h: number;
    r: number;
    layers: number;
    tint: THREE.Color;
  }
  const pineInstances: PineInstance[] = [];

  // Grouped into 4 distinct natural alpine groves across mountain backdrop (breaking up any straight lines)
  const pineGroves = [
    [-7.8, -5.2], // Far-left high crags
    [-4.6, -5.9], // Mid-left mountain saddle
    [-2.0, -6.3], // Rear gorge flank
    [5.0, -5.5],  // Right mountain knolls
    [6.8, -4.5],  // Far-right slope
  ];

  let pAttempts = 0;
  while (pineInstances.length < pineCount && pAttempts < 1800) {
    pAttempts++;
    const grove = pineGroves[pAttempts % pineGroves.length];
    const x = grove[0] + vRng.range(-1.4, 1.4);
    const z = grove[1] + vRng.range(-0.95, 0.95);

    if (!isInsideGardenFootprint(x, z, 0.65) || isInStream(x, z) || isInsideBuildingExclusion(x, z, 0.6)) continue;
    const h = getHeightAt(x, z);
    if (h < 1.95) continue; // Only on mountain slopes and crags

    // Leave a pleasant view corridor in the center rear gorge
    if (Math.abs(x) < 1.3 && z > -5.5) continue;

    let tooClose = false;
    for (const p of pineInstances) {
      if (Math.hypot(x - p.x, z - p.z) < 0.72) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;

    const treeH = vRng.range(1.35, 2.35);
    const treeR = vRng.range(0.34, 0.58);
    const layers = Math.floor(vRng.range(3, 5.99));
    const pineTint = SEASON_PALETTES.spring.pineFoliage.clone().offsetHSL(
      vRng.range(-0.02, 0.02),
      vRng.range(-0.04, 0.04),
      vRng.range(-0.03, 0.04)
    );
    pineInstances.push({ x, y: h, z, h: treeH, r: treeR, layers, tint: pineTint });
  }

  let pFolIdx = 0;
  for (let i = 0; i < pineInstances.length; i++) {
    const p = pineInstances[i];
    dummy.position.set(p.x, p.y, p.z);
    dummy.rotation.set(vRng.range(-0.06, 0.06), vRng.range(0, Math.PI * 2), vRng.range(-0.06, 0.06));
    dummy.scale.set(1.0, p.h, 1.0);
    dummy.updateMatrix();
    pineTrunkMesh.setMatrixAt(i, dummy.matrix);

    for (let l = 0; l < maxPineLayers; l++) {
      if (l < p.layers) {
        const frac = 0.32 + (l / (p.layers - 0.2)) * 0.58;
        const ly = p.y + p.h * frac;
        const layerRScale = 1.0 - (l / p.layers) * 0.60;
        const lr = p.r * layerRScale;
        const lh = p.h * (0.44 / p.layers * 4.0) * layerRScale;
        dummy.position.set(p.x, ly, p.z);
        dummy.rotation.set(0, vRng.range(0, Math.PI * 2), 0);
        dummy.scale.set(lr, lh, lr);

        // Subtle gradient from darker lower branches to sunlit crown
        const layerTint = p.tint.clone().offsetHSL(0, 0, (l / p.layers - 0.5) * 0.05);
        pineFoliageMesh.setColorAt(pFolIdx, layerTint);
      } else {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(0, 0, 0);
        pineFoliageMesh.setColorAt(pFolIdx, p.tint);
      }
      dummy.updateMatrix();
      pineFoliageMesh.setMatrixAt(pFolIdx++, dummy.matrix);
    }
  }
  pineTrunkMesh.instanceMatrix.needsUpdate = true;
  pineFoliageMesh.instanceMatrix.needsUpdate = true;
  if (pineFoliageMesh.instanceColor) pineFoliageMesh.instanceColor.needsUpdate = true;

  // 2. LARGE DECIDUOUS SHADE TREES WITH SOFT MULTI-TIER CLOUD-LIKE CANOPIES (11 overlapping puffs per tree)
  const decTrunkGeom = new THREE.CylinderGeometry(0.08, 0.16, 1.0, 7);
  decTrunkGeom.translate(0, 0.5, 0);

  const decBranchGeom = new THREE.CylinderGeometry(0.035, 0.065, 0.55, 6);
  decBranchGeom.translate(0, 0.27, 0);

  // Smooth shaded icosahedron deformed with soft simplex noise for cloud-like foliage puffs
  const decCanopyGeom = new THREE.IcosahedronGeometry(1.0, 2);
  const decPosAttr = decCanopyGeom.attributes.position;
  const decP = new THREE.Vector3();
  for (let i = 0; i < decPosAttr.count; i++) {
    decP.fromBufferAttribute(decPosAttr, i);
    const n = simplexNoise3D(decP.x * 1.8, decP.y * 1.8, decP.z * 1.8) * 0.16;
    decP.multiplyScalar(1.0 + n);
    decPosAttr.setXYZ(i, decP.x, decP.y, decP.z);
  }
  decCanopyGeom.computeVertexNormals();

  const decTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x5a4230,
    roughness: 0.86,
    metalness: 0.05,
    flatShading: true,
  });

  // Soft non-flat shading with white base so instanceColor renders sun-dappled and shadowed foliage layers
  const decCanopyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0.02,
    flatShading: false,
  });

  const decTreeCount = 13;
  const blobsPerTree = 11; // 11 smaller hierarchical puffs per tree for soft cloud-like volume
  const branchesPerTree = 4;
  const decTrunkMesh = new THREE.InstancedMesh(decTrunkGeom, decTrunkMat, decTreeCount);
  const decBranchMesh = new THREE.InstancedMesh(decBranchGeom, decTrunkMat, decTreeCount * branchesPerTree);
  const decCanopyMesh = new THREE.InstancedMesh(decCanopyGeom, decCanopyMat, decTreeCount * blobsPerTree);
  decTrunkMesh.castShadow = true;
  decBranchMesh.castShadow = true;
  decCanopyMesh.castShadow = true;
  decCanopyMesh.receiveShadow = true;
  group.add(decTrunkMesh);
  group.add(decBranchMesh);
  group.add(decCanopyMesh);

  interface DecTree {
    x: number;
    y: number;
    z: number;
    h: number;
    r: number;
    baseTint: THREE.Color;
  }
  const decTrees: DecTree[] = [];

  // Perimeter placement strictly on flanks and rear (leaving 100% open sightline to domes, cabin, and stream)
  const candidateDecSpots = [
    // Far left flank
    { x: -7.8, z: -2.8, r: 0.82, h: 1.85 },
    { x: -8.0, z: -1.2, r: 0.80, h: 1.75 },
    { x: -7.6, z: 0.3,  r: 0.75, h: 1.65 },
    // Rear mountain slope backdrop
    { x: -5.6, z: -3.8, r: 0.85, h: 1.95 },
    { x: -3.4, z: -4.0, r: 0.88, h: 2.05 },
    { x: -1.2, z: -4.0, r: 0.85, h: 1.95 },
    { x: 0.8,  z: -3.8, r: 0.88, h: 2.00 },
    { x: 2.6,  z: -3.2, r: 0.85, h: 1.90 },
    // Right hill / right flank embracing the diorama
    { x: 4.8,  z: -2.2, r: 0.82, h: 1.80 },
    { x: 6.2,  z: -1.2, r: 0.85, h: 1.80 },
    { x: 7.2,  z: -0.2, r: 0.80, h: 1.75 },
    { x: 7.5,  z: 1.2,  r: 0.78, h: 1.65 },
    { x: 7.2,  z: 2.8,  r: 0.75, h: 1.60 },
  ];

  candidateDecSpots.forEach((spot) => {
    if (!isInsideGardenFootprint(spot.x, spot.z, spot.r + 0.15) || Math.abs(spot.x) > halfW - 0.9 || Math.abs(spot.z) > halfD - 0.9) return;
    if (isInStream(spot.x, spot.z) || isInsideBuildingExclusion(spot.x, spot.z, 0.4)) return;
    const h = getHeightAt(spot.x, spot.z);
    if (h < WATER_LEVEL + 0.15) return;

    const baseTint = SEASON_PALETTES.spring.canopyPrimary.clone().offsetHSL(
      vRng.range(-0.02, 0.02),
      vRng.range(-0.03, 0.03),
      vRng.range(-0.02, 0.04)
    );
    decTrees.push({
      x: spot.x,
      y: h,
      z: spot.z,
      h: spot.h,
      r: spot.r,
      baseTint,
    });
  });

  let canopyIdx = 0;
  let branchIdx = 0;
  for (let i = 0; i < decTrees.length; i++) {
    const t = decTrees[i];
    dummy.position.set(t.x, t.y, t.z);
    dummy.rotation.set(vRng.range(-0.04, 0.04), vRng.range(0, Math.PI * 2), vRng.range(-0.04, 0.04));
    dummy.scale.set(1.0, t.h, 1.0);
    dummy.updateMatrix();
    decTrunkMesh.setMatrixAt(i, dummy.matrix);

    // 4 supporting branches reaching out to leaf puffs
    const bAngles = [0.35, 1.85, 3.45, 5.05];
    for (let b = 0; b < branchesPerTree; b++) {
      const ang = bAngles[b] + vRng.range(-0.15, 0.15);
      dummy.position.set(t.x, t.y + t.h * 0.60, t.z);
      dummy.rotation.set(Math.cos(ang) * 0.45, ang, Math.sin(ang) * 0.45);
      dummy.scale.set(1.0, t.h * 0.85, 1.0);
      dummy.updateMatrix();
      decBranchMesh.setMatrixAt(branchIdx++, dummy.matrix);
    }

    // 11 overlapping smaller cloud-like foliage puffs forming a soft, varied canopy
    const offsets = [
      // Crown top
      { dx: 0, dy: t.h * 1.10, dz: 0, sx: t.r * 0.76, sy: t.r * 0.68, sz: t.r * 0.76, lightBias: 0.08 },
      // Upper tier
      { dx: 0.32, dy: t.h * 0.95, dz: 0.16, sx: t.r * 0.64, sy: t.r * 0.56, sz: t.r * 0.64, lightBias: 0.05 },
      { dx: -0.30, dy: t.h * 0.96, dz: -0.18, sx: t.r * 0.62, sy: t.r * 0.54, sz: t.r * 0.62, lightBias: 0.04 },
      { dx: -0.14, dy: t.h * 0.90, dz: 0.28, sx: t.r * 0.64, sy: t.r * 0.56, sz: t.r * 0.64, lightBias: 0.04 },
      { dx: 0.24, dy: t.h * 0.88, dz: -0.26, sx: t.r * 0.60, sy: t.r * 0.52, sz: t.r * 0.60, lightBias: 0.03 },
      // Mid-lower tier
      { dx: 0.40, dy: t.h * 0.76, dz: -0.10, sx: t.r * 0.58, sy: t.r * 0.50, sz: t.r * 0.58, lightBias: 0.0 },
      { dx: -0.40, dy: t.h * 0.78, dz: 0.14, sx: t.r * 0.58, sy: t.r * 0.50, sz: t.r * 0.58, lightBias: 0.0 },
      { dx: 0.18, dy: t.h * 0.74, dz: 0.36, sx: t.r * 0.56, sy: t.r * 0.48, sz: t.r * 0.56, lightBias: -0.01 },
      { dx: -0.22, dy: t.h * 0.72, dz: -0.34, sx: t.r * 0.56, sy: t.r * 0.48, sz: t.r * 0.56, lightBias: -0.01 },
      // Lower understory
      { dx: 0.14, dy: t.h * 0.60, dz: -0.14, sx: t.r * 0.48, sy: t.r * 0.42, sz: t.r * 0.48, lightBias: -0.06 },
      { dx: -0.16, dy: t.h * 0.62, dz: 0.18, sx: t.r * 0.48, sy: t.r * 0.42, sz: t.r * 0.48, lightBias: -0.06 },
    ];
    for (const off of offsets) {
      dummy.position.set(t.x + off.dx, t.y + off.dy, t.z + off.dz);
      dummy.rotation.set(vRng.range(-0.08, 0.08), vRng.range(0, Math.PI * 2), vRng.range(-0.08, 0.08));
      dummy.scale.set(off.sx, off.sy, off.sz);
      dummy.updateMatrix();
      decCanopyMesh.setMatrixAt(canopyIdx, dummy.matrix);

      // Color gradation from sunlit crown to shaded understory
      const puffColor = t.baseTint.clone().offsetHSL(
        off.lightBias * 0.2,
        off.lightBias * 0.3,
        off.lightBias
      );
      decCanopyMesh.setColorAt(canopyIdx, puffColor);
      canopyIdx++;
    }
  }
  decTrunkMesh.instanceMatrix.needsUpdate = true;
  decBranchMesh.instanceMatrix.needsUpdate = true;
  decCanopyMesh.instanceMatrix.needsUpdate = true;
  if (decCanopyMesh.instanceColor) decCanopyMesh.instanceColor.needsUpdate = true;

  // 3. LOW BUSHES (~110 instances along banks, cliff ledges, path edges)
  const bushGeom = new THREE.IcosahedronGeometry(0.30, 2);
  bushGeom.computeVertexNormals();
  const bushMat = new THREE.MeshStandardMaterial({
    color: SEASON_PALETTES.spring.canopyPrimary,
    roughness: 0.76,
    metalness: 0.02,
    flatShading: false,
  });

  const bushCount = 110;
  const bushMesh = new THREE.InstancedMesh(bushGeom, bushMat, bushCount);
  bushMesh.castShadow = true;
  bushMesh.receiveShadow = true;
  group.add(bushMesh);

  let bPlaced = 0;
  let bAttempts = 0;
  while (bPlaced < bushCount && bAttempts < 2500) {
    bAttempts++;
    const x = vRng.range(-halfW + 0.8, halfW - 0.8);
    const z = vRng.range(-halfD + 0.8, halfD - 0.8);

    if (!isInsideGardenFootprint(x, z, 0.40) || isInStream(x, z) || isInsideBuildingExclusion(x, z, 0.25) || isNearCampActivity(x, z) || isNearWalkingTrail(x, z, 0.35)) continue;
    const h = getHeightAt(x, z);
    if (h < WATER_LEVEL + 0.05) continue;
    const slope = getSlopeAt(x, z);
    if (slope > 0.65) continue;

    const r = vRng.range(0.24, 0.42);
    dummy.position.set(x, h + r * 0.35, z);
    dummy.rotation.set(0, vRng.range(0, Math.PI * 2), 0);
    dummy.scale.set(r, r * 0.85, r);
    dummy.updateMatrix();
    bushMesh.setMatrixAt(bPlaced++, dummy.matrix);
  }
  bushMesh.instanceMatrix.needsUpdate = true;

  // 4. CLIFF HANGING VINES & TENDRILS (TIER 2)
  // Cascade over the rock face from the plateau edge into the stream valley
  const vineGeom = new THREE.CylinderGeometry(0.04, 0.02, 0.55, 5);
  vineGeom.translate(0, -0.27, 0);
  const vineMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x3a6024),
    roughness: 0.82,
    metalness: 0.03,
    flatShading: true,
  });
  const vineCount = 45;
  const vineMesh = new THREE.InstancedMesh(vineGeom, vineMat, vineCount);
  group.add(vineMesh);

  let vPlaced = 0;
  for (let i = 0; i < vineCount; i++) {
    const vx = vRng.range(-6.2, 0.1);
    const vz = vRng.range(0.85, 1.85);
    const vSlope = getSlopeAt(vx, vz);
    if (vSlope > 0.35 && isInsideGardenFootprint(vx, vz, 0.35) && !isInStream(vx, vz) && !isInsideBuildingExclusion(vx, vz, 0.2)) {
      const vY = getHeightAt(vx, vz);
      dummy.position.set(vx, vY + 0.02, vz);
      dummy.rotation.set(vRng.range(-0.1, 0.1), vRng.range(0, Math.PI * 2), vRng.range(-0.1, 0.1));
      const vScale = vRng.range(0.7, 1.3);
      dummy.scale.set(vScale, vScale * vRng.range(0.8, 1.4), vScale);
      dummy.updateMatrix();
      vineMesh.setMatrixAt(vPlaced++, dummy.matrix);
    }
  }
  vineMesh.count = Math.max(1, vPlaced);
  vineMesh.instanceMatrix.needsUpdate = true;

  // 5. WILDFLOWERS CLUSTERED IN BOTANICAL BEDS (TIER 3)
  // Discrete, clustered beds of pink, white, and golden blooms
  const flowerStemGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 4);
  flowerStemGeom.translate(0, 0.06, 0);
  const flowerHeadGeom = new THREE.SphereGeometry(0.045, 5, 4);
  flowerHeadGeom.translate(0, 0.12, 0);

  const flowerStemMat = new THREE.MeshStandardMaterial({ color: 0x3d7023, roughness: 0.8 });
  const flowerHeadMat = new THREE.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.05,
    flatShading: true,
  });

  const flowerCount = 650;
  const flowerStemMesh = new THREE.InstancedMesh(flowerStemGeom, flowerStemMat, flowerCount);
  const flowerHeadMesh = new THREE.InstancedMesh(flowerHeadGeom, flowerHeadMat, flowerCount);
  group.add(flowerStemMesh);
  group.add(flowerHeadMesh);

  // 10 distinct asymmetrical botanical clusters across meadow, slopes and banks
  const flowerBeds = [
    { cx: -4.3, cz: -1.0, colIdx: 0, radius: 0.45 },  // Pink Cosmos bed near dome 3 rear flank
    { cx: -1.6, cz: -0.5, colIdx: 1, radius: 0.45 },  // White Chamomile bed near dome 2 flank
    { cx: -4.8, cz: -2.8, colIdx: 2, radius: 0.50 },  // Golden Buttercup bed behind dome 1
    { cx: -3.4, cz: 0.95, colIdx: 0, radius: 0.45 },  // Pink cluster along meadow edge
    { cx: -5.8, cz: 1.80, colIdx: 2, radius: 0.55 },  // Golden Buttercup on west natural slope
    { cx: -3.2, cz: 2.10, colIdx: 1, radius: 0.45 },  // White Chamomile cluster on natural slope
    { cx: -0.45, cz: 2.20, colIdx: 0, radius: 0.45 }, // Pink Cosmos on east natural slope flank
    { cx: 3.8,  cz: 2.10, colIdx: 2, radius: 0.70 },  // Golden bed on right bank
    { cx: 4.6,  cz: 3.00, colIdx: 0, radius: 0.65 },  // Pink bed on right bank
    { cx: 5.3,  cz: 3.60, colIdx: 1, radius: 0.55 },  // White bed above pebble beach
  ];

  const flowerColors = SEASON_PALETTES.spring.flowerColors;
  let flPlaced = 0;

  for (let i = 0; i < flowerCount; i++) {
    const bed = flowerBeds[i % flowerBeds.length];
    // Radial offset within bed radius
    const ang = vRng.range(0, Math.PI * 2);
    const rDist = Math.sqrt(vRng.next()) * bed.radius;
    const fx = bed.cx + Math.cos(ang) * rDist;
    const fz = bed.cz + Math.sin(ang) * rDist;

    if (!isInsideGardenFootprint(fx, fz, 0.30) || isInStream(fx, fz) || isInsideBuildingExclusion(fx, fz, 0.08) || isNearWalkingTrail(fx, fz, 0.18)) continue;
    const fh = getHeightAt(fx, fz);
    if (fh < WATER_LEVEL + 0.05) continue;
    if (getSlopeAt(fx, fz) > 0.40) continue;

    const col = flowerColors[bed.colIdx % flowerColors.length];
    dummy.position.set(fx, fh, fz);
    dummy.rotation.set(vRng.range(-0.1, 0.1), vRng.range(0, Math.PI * 2), vRng.range(-0.1, 0.1));
    const sc = vRng.range(0.75, 1.25);
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();

    flowerStemMesh.setMatrixAt(flPlaced, dummy.matrix);
    flowerHeadMesh.setMatrixAt(flPlaced, dummy.matrix);
    flowerHeadMesh.setColorAt(flPlaced, col);
    flPlaced++;
  }
  flowerStemMesh.count = Math.max(1, flPlaced);
  flowerHeadMesh.count = Math.max(1, flPlaced);
  flowerStemMesh.instanceMatrix.needsUpdate = true;
  flowerHeadMesh.instanceMatrix.needsUpdate = true;
  if (flowerHeadMesh.instanceColor) flowerHeadMesh.instanceColor.needsUpdate = true;

  // 6. GRASS TUFTS (~3,600 fan blades across walkable meadows)
  const grassBladeGeom = new THREE.BufferGeometry();
  // 5-blade fan
  const gPos: number[] = [];
  const gNorm: number[] = [];
  const gCol: number[] = [];
  const gIdx: number[] = [];

  const baseCol = new THREE.Color(0x3e6b22);
  const tipCol = new THREE.Color(0x8bc34a);

  for (let b = 0; b < 5; b++) {
    const angle = (b / 5) * Math.PI * 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const w = 0.035;
    const hBlade = 0.13;
    const tipOut = 0.05;

    const vBase = b * 3;
    gPos.push(-sinA * w, 0, cosA * w);
    gPos.push(sinA * w, 0, -cosA * w);
    gPos.push(cosA * tipOut, hBlade, sinA * tipOut);

    gNorm.push(0, 1, 0, 0, 1, 0, 0, 1, 0);

    gCol.push(baseCol.r, baseCol.g, baseCol.b);
    gCol.push(baseCol.r, baseCol.g, baseCol.b);
    gCol.push(tipCol.r, tipCol.g, tipCol.b);

    gIdx.push(vBase, vBase + 1, vBase + 2);
  }

  grassBladeGeom.setAttribute('position', new THREE.Float32BufferAttribute(gPos, 3));
  grassBladeGeom.setAttribute('normal', new THREE.Float32BufferAttribute(gNorm, 3));
  grassBladeGeom.setAttribute('color', new THREE.Float32BufferAttribute(gCol, 3));
  grassBladeGeom.setIndex(gIdx);

  const grassMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.02,
    side: THREE.DoubleSide,
    flatShading: true,
  });

  // 6. GRASS TUFTS (~1,200 tufts clustered along moist banks & cliff base)
  // Camp activity areas (around domes, cabin, campfire, picnic table) are kept as clean manicured lawns
  function isNearCampActivity(x: number, z: number): boolean {
    if (Math.hypot(x - (-3.2), z - (-0.8)) < 1.5) return true; // Campfire
    if (Math.hypot(x - (-5.0), z - (-2.0)) < 1.7) return true; // Dome 1
    if (Math.hypot(x - (-2.2), z - (-1.2)) < 1.7) return true; // Dome 2
    if (Math.hypot(x - (-4.2), z - 0.0) < 1.7) return true;    // Dome 3
    if (Math.hypot(x - (-1.0), z - (-2.5)) < 1.9) return true; // Cabin
    if (Math.hypot(x - (-6.2), z - (-0.5)) < 1.4) return true; // Picnic table
    return false;
  }

  const grassCount = 1200;
  const grassMesh = new THREE.InstancedMesh(grassBladeGeom, grassMat, grassCount);
  grassMesh.receiveShadow = true;
  group.add(grassMesh);

  let gPlaced = 0;
  let gAttempts = 0;
  while (gPlaced < grassCount && gAttempts < 15000) {
    gAttempts++;
    const x = vRng.range(-halfW + 0.5, halfW - 0.5);
    const z = vRng.range(-halfD + 0.5, halfD - 0.5);

    if (!isInsideGardenFootprint(x, z, 0.30) || isInStream(x, z) || isInsideBuildingExclusion(x, z, 0.15) || isNearCampActivity(x, z) || isNearWalkingTrail(x, z, 0.08)) continue;
    const h = getHeightAt(x, z);
    if (h < WATER_LEVEL + 0.04) continue;
    const slope = getSlopeAt(x, z);
    if (slope > 0.45) continue;

    // Cluster preferentially along moist banks (z >= 0.5), cliff base, and right hills
    const isBankOrCliffBase = z >= 0.3 || (x > 0.5) || (z < -3.0);
    if (!isBankOrCliffBase && vRng.next() > 0.15) continue; // Sparse on high plateau, keeping camp lawns neat

    dummy.position.set(x, h, z);
    dummy.rotation.set(0, vRng.range(0, Math.PI * 2), 0);
    const sc = vRng.range(0.65, 1.25);
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();
    grassMesh.setMatrixAt(gPlaced++, dummy.matrix);
  }
  grassMesh.count = Math.max(1, gPlaced);
  grassMesh.instanceMatrix.needsUpdate = true;

  // 7. FERNS & ROCK PLANTS IN CLIFF CREVICES (~75 instances)
  // Soft, flat curved fronds placed strictly on steep rocky faces (NO cone spikes on flat grass!)
  const fernGeom = new THREE.BufferGeometry();
  const frondPositions = [
    // Center frond
    0, 0, 0,   -0.06, 0.14, 0.08,   0, 0.20, 0.12,
    0, 0, 0,    0, 0.20, 0.12,       0.06, 0.14, 0.08,
    // Left frond
    0, 0, 0,   -0.12, 0.10, -0.02,  -0.15, 0.14, 0.04,
    // Right frond
    0, 0, 0,    0.15, 0.14, 0.04,    0.12, 0.10, -0.02,
  ];
  fernGeom.setAttribute('position', new THREE.Float32BufferAttribute(frondPositions, 3));
  fernGeom.computeVertexNormals();

  const fernMat = new THREE.MeshStandardMaterial({
    color: 0x3d752c,
    roughness: 0.75,
    metalness: 0.02,
    side: THREE.DoubleSide,
    flatShading: false,
  });
  const fernCount = 75;
  const fernMesh = new THREE.InstancedMesh(fernGeom, fernMat, fernCount);
  group.add(fernMesh);

  let fernPlaced = 0;
  let fernAttempts = 0;
  while (fernPlaced < fernCount && fernAttempts < 3500) {
    fernAttempts++;
    const x = vRng.range(-halfW + 0.8, halfW - 0.8);
    const z = vRng.range(0.6, halfD - 0.8);

    if (!isInsideGardenFootprint(x, z, 0.35) || isInStream(x, z) || isInsideBuildingExclusion(x, z, 0.15) || isNearCampActivity(x, z)) continue;
    const h = getHeightAt(x, z);
    if (h < WATER_LEVEL + 0.05) continue;
    const slope = getSlopeAt(x, z);
    // Strictly in steep rock crevices and cliff ledges (never on flat meadow)
    if (slope < 0.35) continue;

    dummy.position.set(x, h + 0.02, z);
    dummy.rotation.set(vRng.range(-0.15, 0.15), vRng.range(0, Math.PI * 2), vRng.range(-0.15, 0.15));
    const sc = vRng.range(0.70, 1.25);
    dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix();
    fernMesh.setMatrixAt(fernPlaced++, dummy.matrix);
  }
  fernMesh.count = Math.max(1, fernPlaced);
  fernMesh.instanceMatrix.needsUpdate = true;

  scene.add(group);

  // Wind animation & seasonal transitions
  function update(dt: number, elapsed: number, windStrength: number): void {
    // Gentle sway on tree canopies and vines
    const sway = Math.sin(elapsed * 2.2) * 0.015 * windStrength;
    decCanopyMesh.position.x = sway;
    decCanopyMesh.position.z = sway * 0.7;
    vineMesh.rotation.z = Math.sin(elapsed * 1.8) * 0.02 * windStrength;
  }

  function updateSeason(season: Season, t: number): void {
    const pal = SEASON_PALETTES[season];

    // Conifers remain deep green in winter, freshen in spring
    pineFoliageMat.color.lerp(pal.pineFoliage, t);

    // Deciduous foliage shifts with seasons
    decCanopyMat.color.lerp(pal.canopyPrimary, t);
    bushMat.color.lerp(pal.canopyPrimary, t);
    vineMat.color.lerp(season === 'winter' ? pal.pineFoliage : pal.canopyPrimary, t);

    // Flowers dormant/scaled in winter
    if (season === 'winter') {
      flowerHeadMesh.visible = false;
      flowerStemMesh.visible = false;
    } else {
      flowerHeadMesh.visible = true;
      flowerStemMesh.visible = true;
      const colList = pal.flowerColors;
      if (colList.length > 0) {
        for (let i = 0; i < flowerHeadMesh.count; i++) {
          flowerHeadMesh.setColorAt(i, colList[i % colList.length]);
        }
        if (flowerHeadMesh.instanceColor) flowerHeadMesh.instanceColor.needsUpdate = true;
      }
    }
  }

  return {
    group,
    update,
    updateSeason,
    dispose() {
      pineTrunkGeom.dispose();
      pineTrunkMat.dispose();
      pineConeGeom.dispose();
      pineFoliageMat.dispose();
      decTrunkGeom.dispose();
      decTrunkMat.dispose();
      decBranchGeom.dispose();
      decCanopyGeom.dispose();
      decCanopyMat.dispose();
      bushGeom.dispose();
      bushMat.dispose();
      vineGeom.dispose();
      vineMat.dispose();
      flowerStemGeom.dispose();
      flowerStemMat.dispose();
      flowerHeadGeom.dispose();
      flowerHeadMat.dispose();
      grassBladeGeom.dispose();
      grassMat.dispose();
      fernGeom.dispose();
      fernMat.dispose();
      group.removeFromParent();
    },
  };
}
