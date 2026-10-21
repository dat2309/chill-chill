import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { PHUQUOC_COLORS, PhuQuocSeason, SEED } from './constants';
import { getDistanceToShore, isInWater, BUNGALOW_SPOTS } from './shoreline';
import { isInsidePhuQuocFootprint } from './footprint';
import { SeededRandom } from '../../core/noise';

export interface PhuQuocVegetationSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number): void;
  updateSeason(season: PhuQuocSeason, t: number): void;
  dispose(): void;
}

/**
 * Creates an organic, multi-lobed bougainvillea floral cluster geometry with vertex colors.
 * Replaces hard polyhedral spheres with soft, cascading petal puffs and subtle green bract accents.
 */
function createBougainvilleaClusterGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  function applyVertexColor(geo: THREE.BufferGeometry, color: THREE.Color) {
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  // 1. Central floret puff (soft rose)
  const mainGeo = new THREE.SphereGeometry(0.16, 10, 8);
  mainGeo.scale(1.2, 0.72, 1.15);
  applyVertexColor(mainGeo, new THREE.Color(0xd75677));
  parts.push(mainGeo);

  // 2. Surrounding blooming petal puffs (soft varied tints of pink/coral-rose)
  const petalPuffs = [
    { pos: [0.11, -0.03, 0.07], r: 0.11, scale: [1.1, 0.65, 1.1], col: new THREE.Color(0xea6989) },
    { pos: [-0.10, -0.02, 0.08], r: 0.10, scale: [1.1, 0.65, 1.05], col: new THREE.Color(0xe35f81) },
    { pos: [0.03, -0.04, -0.10], r: 0.11, scale: [1.15, 0.65, 1.1], col: new THREE.Color(0xdc587a) },
    { pos: [-0.06, 0.04, -0.05], r: 0.09, scale: [1.0, 0.7, 1.0], col: new THREE.Color(0xf07a97) },
    { pos: [0.08, 0.05, 0.04], r: 0.085, scale: [1.0, 0.7, 1.0], col: new THREE.Color(0xf586a1) },
  ];

  petalPuffs.forEach((puff) => {
    const pGeo = new THREE.SphereGeometry(puff.r, 8, 6);
    pGeo.scale(puff.scale[0], puff.scale[1], puff.scale[2]);
    pGeo.translate(puff.pos[0], puff.pos[1], puff.pos[2]);
    applyVertexColor(pGeo, puff.col);
    parts.push(pGeo);
  });

  // 3. Subtle foliage leaf accents at the underside
  const leafAccents = [
    { pos: [0.09, -0.08, -0.07], r: 0.065, col: new THREE.Color(0x4a6a36) },
    { pos: [-0.08, -0.08, 0.06], r: 0.060, col: new THREE.Color(0x3e5b2d) },
  ];

  leafAccents.forEach((leaf) => {
    const lGeo = new THREE.SphereGeometry(leaf.r, 6, 5);
    lGeo.scale(1.4, 0.45, 1.0);
    lGeo.translate(leaf.pos[0], leaf.pos[1], leaf.pos[2]);
    applyVertexColor(lGeo, leaf.col);
    parts.push(lGeo);
  });

  const merged = BufferGeometryUtils.mergeGeometries(parts, false);
  merged.computeVertexNormals();
  return merged;
}

export function createPhuQuocVegetation(
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number,
  getSlopeAt: (x: number, z: number) => number
): PhuQuocVegetationSystem {
  const vegGroup = new THREE.Group();
  vegGroup.name = 'PhuQuocVegetation';
  parentGroup.add(vegGroup);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const dynamicMeshes: { mesh: THREE.Object3D; baseRotation: THREE.Euler; swayScale: number }[] = [];

  const rng = new SeededRandom(SEED + 999);

  // Materials
  const palmTrunkMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.palmTrunk });
  const palmFrondMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.vegetation.palmFrond,
    side: THREE.DoubleSide,
  });
  const casuarinaMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.casuarina });
  const bushMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.coastalBush });
  // Softer bougainvillea material using vertexColors and smooth Lambert shading
  const bougainvilleaMat = new THREE.MeshLambertMaterial({
    vertexColors: true,
    flatShading: false,
  });

  materialsToDispose.push(palmTrunkMat, palmFrondMat, casuarinaMat, bushMat, bougainvilleaMat);

  // --- Footprint-based Bungalow Roof Exclusion ---
  // Each bungalow roof is ~2.4m x 2.4m pyramid centered around (spot.x, spot.z - 0.15).
  // A palm crown extends ~1.65m horizontally from trunk top.
  // We check the entire crown footprint to strictly prevent any palm fronds from draping over bungalow roofs.
  function isNearBungalowRoof(trunkX: number, trunkZ: number, leanAngle: number, leanDir: number): boolean {
    const leanDistance = 2.6 * Math.sin(leanAngle) * 0.72;
    const crownX = trunkX + leanDistance * Math.cos(leanDir);
    const crownZ = trunkZ - leanDistance * Math.sin(leanDir);
    const frondRadius = 1.65; // Max horizontal reach of lower fronds

    for (const b of BUNGALOW_SPOTS) {
      const roofCenterX = b.x;
      const roofCenterZ = b.z - 0.15;
      const roofRadius = 1.55; // Half-diagonal of the steep thatched roof

      // Check crown footprint against roof bounds
      const distCrown = Math.hypot(crownX - roofCenterX, crownZ - roofCenterZ);
      if (distCrown < roofRadius + frondRadius) {
        return true;
      }

      // Also ensure trunk base is not placed within bungalow deck or veranda
      const distBase = Math.hypot(trunkX - roofCenterX, trunkZ - roofCenterZ);
      if (distBase < roofRadius + 0.6) {
        return true;
      }
    }
    return false;
  }

  // --- 1. Coconut Palms (Cây Dừa Phú Quốc) ---
  // Strategically placed along beach foreshore and rocky headlands, leaning towards water and completely clear of bungalow roofs
  const palmCandidates = [
    // West cove sandy foreshore (leaning west towards water)
    { x: -7.2, z: 0.8, leanAngle: 0.32, leanDir: 0.6 },
    { x: -4.0, z: 1.8, leanAngle: 0.35, leanDir: 0.4 },
    // Jetty approach & central beach (leaning towards sunset bay)
    { x: -0.6, z: 0.8, leanAngle: 0.30, leanDir: 0.2 },
    { x: 0.8, z: 0.6, leanAngle: 0.32, leanDir: -0.2 },
    // Beach terrace between rock outcrops
    { x: 3.2, z: 0.4, leanAngle: 0.34, leanDir: -0.5 },
    { x: 4.8, z: 1.2, leanAngle: 0.38, leanDir: -0.7 },
    { x: 6.8, z: 1.6, leanAngle: 0.38, leanDir: -0.8 },
    // Southern headland knolls (away from bungalow roofs)
    { x: -7.5, z: -3.8, leanAngle: 0.18, leanDir: 0.7 },
    { x: -2.6, z: -4.2, leanAngle: 0.18, leanDir: 0.4 },
    { x: 0.0, z: -4.2, leanAngle: 0.16, leanDir: 0.2 },
    { x: 7.2, z: -1.0, leanAngle: 0.22, leanDir: -0.5 },
    { x: 4.2, z: -4.8, leanAngle: 0.18, leanDir: -0.3 },
  ];

  // Helper to create single coconut palm
  function createPalmTree(x: number, z: number, leanAngle: number, leanDir: number) {
    const palmObj = new THREE.Group();
    const groundH = getHeightAt(x, z);
    palmObj.position.set(x, groundH, z);

    // Segmented curved trunk
    const segments = 7;
    const totalHeight = 2.6;
    const segHeight = totalHeight / segments;
    const trunkCurve = new THREE.Group();

    let currPos = new THREE.Vector3(0, 0, 0);
    const cosD = Math.cos(leanDir);
    const sinD = Math.sin(leanDir);

    for (let s = 0; s < segments; s++) {
      const t = s / (segments - 1);
      const rBot = 0.14 * (1 - t * 0.45);
      const rTop = 0.14 * (1 - (t + 1 / segments) * 0.45);

      const segGeo = new THREE.CylinderGeometry(rTop, rBot, segHeight, 8);
      geometriesToDispose.push(segGeo);
      const segMesh = new THREE.Mesh(segGeo, palmTrunkMat);
      segMesh.castShadow = true;

      const lean = leanAngle * Math.pow(t, 1.4);
      segMesh.position.copy(currPos).add(new THREE.Vector3(0, segHeight / 2, 0));
      segMesh.rotation.z = -lean * cosD;
      segMesh.rotation.x = lean * sinD;

      trunkCurve.add(segMesh);

      // Advance currPos along lean
      currPos.y += segHeight * Math.cos(lean);
      currPos.x += segHeight * Math.sin(lean) * cosD;
      currPos.z -= segHeight * Math.sin(lean) * sinD;
    }
    palmObj.add(trunkCurve);

    // Crown of arching palm fronds in 3 realistic tiers (upper upright, middle spreading, lower drooping)
    const crown = new THREE.Group();
    crown.position.copy(currPos);

    const frondTiers = [
      // Upper tier: younger fronds reaching upward & outward
      { count: 5, len: 1.15, archMul: 0.42, droopMul: 0.40, tilt: 0.25 },
      // Middle tier: mature spreading fronds sweeping outward
      { count: 6, len: 1.45, archMul: 0.36, droopMul: 0.72, tilt: 0.05 },
      // Lower tier: mature drooping fronds with graceful downward curve
      { count: 5, len: 1.60, archMul: 0.24, droopMul: 1.05, tilt: -0.22 },
    ];

    frondTiers.forEach((tier, tierIdx) => {
      for (let f = 0; f < tier.count; f++) {
        const baseAngle = (f / tier.count) * Math.PI * 2 + (tierIdx * 0.42) + rng.range(-0.10, 0.10);
        const frondGeo = new THREE.BufferGeometry();
        const pts: number[] = [];
        const indices: number[] = [];

        // Realistic curved spine with drooping tip
        const spineSegs = 9;
        for (let i = 0; i <= spineSegs; i++) {
          const u = i / spineSegs;
          // Arch upward initially, then droop increasingly toward the tip
          const arch = Math.sin(u * Math.PI * 0.75) * tier.archMul * tier.len;
          const droop = Math.pow(u, 2.2) * tier.droopMul * tier.len;
          const y = arch - droop;
          const rad = u * tier.len;
          const x = Math.cos(baseAngle) * rad;
          const z = Math.sin(baseAngle) * rad;

          // Pinnate frond blade width (starts narrow, expands at mid, tapers to fine point at tip)
          const bladeWidth = Math.sin(u * Math.PI) * (0.16 + tierIdx * 0.04);
          const perpX = -Math.sin(baseAngle) * bladeWidth;
          const perpZ = Math.cos(baseAngle) * bladeWidth;

          // Left vertex, Center spine, Right vertex
          pts.push(x - perpX, y, z - perpZ);
          pts.push(x, y + 0.02, z);
          pts.push(x + perpX, y, z + perpZ);

          if (i < spineSegs) {
            const row1 = i * 3;
            const row2 = (i + 1) * 3;
            // Left blade quad (two triangles)
            indices.push(row1, row2, row1 + 1);
            indices.push(row1 + 1, row2, row2 + 1);
            // Right blade quad (two triangles)
            indices.push(row1 + 1, row2 + 1, row1 + 2);
            indices.push(row1 + 2, row2 + 1, row2 + 2);
          }
        }

        frondGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        frondGeo.setIndex(indices);
        frondGeo.computeVertexNormals();
        geometriesToDispose.push(frondGeo);

        const frondMesh = new THREE.Mesh(frondGeo, palmFrondMat);
        frondMesh.castShadow = true;
        frondMesh.receiveShadow = true;
        frondMesh.rotation.x += tier.tilt * Math.sin(baseAngle);
        frondMesh.rotation.z += tier.tilt * Math.cos(baseAngle);
        crown.add(frondMesh);
      }
    });

    palmObj.add(crown);
    dynamicMeshes.push({
      mesh: crown,
      baseRotation: crown.rotation.clone(),
      swayScale: 0.035 + leanAngle * 0.06,
    });

    vegGroup.add(palmObj);
  }

  // Instantiate palms that strictly pass bungalow roof clearance
  palmCandidates.forEach((p) => {
    if (!isNearBungalowRoof(p.x, p.z, p.leanAngle, p.leanDir)) {
      createPalmTree(p.x, p.z, p.leanAngle, p.leanDir);
    }
  });

  // --- 2. Coastal Pines (Phi Lao Ven Biển) ---
  const pineTrunkGeo = new THREE.CylinderGeometry(0.06, 0.10, 1.4, 6);
  pineTrunkGeo.translate(0, 0.7, 0);
  geometriesToDispose.push(pineTrunkGeo);

  const pineCanopyGeo = new THREE.ConeGeometry(0.7, 2.2, 7);
  pineCanopyGeo.translate(0, 1.1, 0);
  geometriesToDispose.push(pineCanopyGeo);

  const maxPines = 35;
  const pineTrunkMesh = new THREE.InstancedMesh(pineTrunkGeo, palmTrunkMat, maxPines);
  const pineCanopyMesh = new THREE.InstancedMesh(pineCanopyGeo, casuarinaMat, maxPines);
  pineTrunkMesh.castShadow = true;
  pineCanopyMesh.castShadow = true;

  const dummy = new THREE.Object3D();
  let placedPines = 0;

  for (let i = 0; i < maxPines * 4 && placedPines < maxPines; i++) {
    const px = rng.range(-8.5, 8.5);
    const pz = rng.range(-7.5, -2.5);

    if (isInsidePhuQuocFootprint(px, pz, 0.45) && getDistanceToShore(px, pz) > 1.8 && !isInWater(px, pz)) {
      const py = getHeightAt(px, pz);
      const scale = rng.range(0.75, 1.25);

      dummy.position.set(px, py, pz);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.updateMatrix();
      pineTrunkMesh.setMatrixAt(placedPines, dummy.matrix);

      dummy.position.set(px, py + 1.7 * scale, pz);
      dummy.updateMatrix();
      pineCanopyMesh.setMatrixAt(placedPines, dummy.matrix);

      placedPines++;
    }
  }
  pineTrunkMesh.count = Math.max(1, placedPines);
  pineCanopyMesh.count = Math.max(1, placedPines);
  pineTrunkMesh.instanceMatrix.needsUpdate = true;
  pineCanopyMesh.instanceMatrix.needsUpdate = true;
  vegGroup.add(pineTrunkMesh);
  vegGroup.add(pineCanopyMesh);

  // --- 3. Coastal Bushes & Shrubs ---
  const bushCount = 50;
  const bushGeo = new THREE.DodecahedronGeometry(0.35, 1);
  geometriesToDispose.push(bushGeo);
  const bushMesh = new THREE.InstancedMesh(bushGeo, bushMat, bushCount);
  bushMesh.castShadow = true;

  let placedBushes = 0;
  for (let i = 0; i < bushCount * 5 && placedBushes < bushCount; i++) {
    const bx = rng.range(-9.2, 9.2);
    const bz = rng.range(-6.5, 2.0);

    if (isInsidePhuQuocFootprint(bx, bz, 0.40) && getDistanceToShore(bx, bz) > 0.5 && !isInWater(bx, bz)) {
      const by = getHeightAt(bx, bz);
      const bScale = rng.range(0.5, 1.1);

      dummy.position.set(bx, by + bScale * 0.25, bz);
      dummy.scale.set(bScale * 1.2, bScale * 0.8, bScale * 1.2);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.updateMatrix();
      bushMesh.setMatrixAt(placedBushes, dummy.matrix);
      placedBushes++;
    }
  }
  bushMesh.count = Math.max(1, placedBushes);
  bushMesh.instanceMatrix.needsUpdate = true;
  vegGroup.add(bushMesh);

  // --- 4. Soft Rose Bougainvillea (Hoa Giấy Hồng Êm) ---
  // Cascading multi-lobed floral clusters with soft rose-pink petals and subtle foliage undertones
  const bougCount = 38;
  const bougClusterGeo = createBougainvilleaClusterGeometry();
  geometriesToDispose.push(bougClusterGeo);

  const bougMesh = new THREE.InstancedMesh(bougClusterGeo, bougainvilleaMat, bougCount);
  bougMesh.castShadow = true;

  // Concentrated near bungalows walkways, stone paths and eastern headland rocks
  const bougCenters = [
    { x: -4.8, z: -0.6, r: 1.0 }, // Bungalow 1 walkway
    { x: -1.8, z: -2.2, r: 1.0 }, // Bungalow 2 terrace
    { x: 1.8, z: -1.5, r: 1.0 },  // Bungalow 3 terrace
    { x: 4.5, z: 1.5, r: 1.5 },   // Eastern granite rocks
    { x: -1.2, z: 0.5, r: 0.8 },  // Pier garden approach
  ];

  let placedBoug = 0;
  for (let i = 0; i < bougCount; i++) {
    const center = bougCenters[i % bougCenters.length];
    const ox = rng.range(-center.r, center.r);
    const oz = rng.range(-center.r, center.r);
    const bx = center.x + ox;
    const bz = center.z + oz;
    if (!isInsidePhuQuocFootprint(bx, bz, 0.30) || isInWater(bx, bz)) continue;
    const scale = rng.range(0.55, 1.15);
    const by = getHeightAt(bx, bz) + 0.05 * scale;

    dummy.position.set(bx, by, bz);
    dummy.scale.set(scale * 1.2, scale * 0.85, scale * 1.15);
    dummy.rotation.set(rng.range(0, 0.25), rng.range(0, Math.PI * 2), rng.range(0, 0.2));
    dummy.updateMatrix();
    bougMesh.setMatrixAt(placedBoug, dummy.matrix);
    placedBoug++;
  }
  bougMesh.count = Math.max(1, placedBoug);
  bougMesh.instanceMatrix.needsUpdate = true;
  vegGroup.add(bougMesh);

  // Cached seasonal target colors
  const lushGreen = new THREE.Color(0x235f26);
  const dryGreen = PHUQUOC_COLORS.vegetation.palmFrond;

  return {
    group: vegGroup,
    update(dt: number, elapsed: number, windStrength: number) {
      // Wind sway on palm frond crowns
      dynamicMeshes.forEach((item, idx) => {
        const timeOffset = elapsed * 2.2 + idx * 0.7;
        const swayAngle = Math.sin(timeOffset) * item.swayScale * windStrength;
        item.mesh.rotation.z = item.baseRotation.z + swayAngle;
        item.mesh.rotation.x = item.baseRotation.x + Math.cos(timeOffset * 0.8) * item.swayScale * 0.5 * windStrength;
      });
    },
    updateSeason(season: PhuQuocSeason, t: number) {
      palmFrondMat.color.lerpColors(dryGreen, lushGreen, season === 'rainy' ? t : 1 - t);
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      vegGroup.clear();
      parentGroup.remove(vegGroup);
    },
  };
}
