import * as THREE from 'three';
import { PHUQUOC_COLORS, PhuQuocSeason, SEED } from './constants';
import { getDistanceToShore, isInWater } from './shoreline';
import { isInsidePhuQuocFootprint } from './footprint';
import { SeededRandom } from '../../core/noise';

export interface PhuQuocVegetationSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number): void;
  updateSeason(season: PhuQuocSeason, t: number): void;
  dispose(): void;
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

  const rng = new SeededRandom(SEED + 202);

  // Materials
  const palmTrunkMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.palmTrunk });
  const palmFrondMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.vegetation.palmFrond,
    side: THREE.DoubleSide,
  });
  const casuarinaMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.casuarina });
  const bushMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.vegetation.coastalBush });
  const bougainvilleaMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.vegetation.bougainvilleaPink,
  });

  materialsToDispose.push(palmTrunkMat, palmFrondMat, casuarinaMat, bushMat, bougainvilleaMat);

  // --- 1. Coconut Palms (Cây Dừa Phú Quốc) ---
  // Coconut palm geometry templates
  const numPalms = 14;
  const palmPositions = [
    { x: -6.5, z: 0.8, leanAngle: 0.28, leanDir: 0.8 },
    { x: -4.0, z: 1.4, leanAngle: 0.35, leanDir: 0.5 },
    { x: -5.5, z: -1.8, leanAngle: 0.22, leanDir: 0.2 },
    { x: -2.2, z: 0.2, leanAngle: 0.26, leanDir: 0.4 },
    { x: -0.5, z: 0.6, leanAngle: 0.32, leanDir: 0.3 },
    { x: 0.8, z: 0.5, leanAngle: 0.30, leanDir: -0.2 },
    { x: 2.5, z: 0.0, leanAngle: 0.34, leanDir: -0.5 },
    { x: 3.8, z: 0.8, leanAngle: 0.40, leanDir: -0.6 },
    { x: 5.2, z: -0.5, leanAngle: 0.25, leanDir: -0.4 },
    { x: -7.2, z: -3.5, leanAngle: 0.18, leanDir: 0.6 },
    { x: 6.8, z: 1.5, leanAngle: 0.38, leanDir: -0.8 },
    { x: 1.2, z: -2.8, leanAngle: 0.15, leanDir: 0.1 },
    { x: -3.2, z: -3.2, leanAngle: 0.20, leanDir: 0.4 },
    { x: 4.5, z: -2.5, leanAngle: 0.22, leanDir: -0.3 },
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

    let totalFrondIdx = 0;
    frondTiers.forEach((tier, tierIdx) => {
      for (let f = 0; f < tier.count; f++) {
        const baseAngle = (f / tier.count) * Math.PI * 2 + (tierIdx * 0.42) + rng.range(-0.10, 0.10);
        const frondGeo = new THREE.BufferGeometry();

        // 8 smooth curved steps for natural arch & tip droop
        const fSteps = 8;
        const fPos: number[] = [];
        const fIndices: number[] = [];

        for (let step = 0; step <= fSteps; step++) {
          const ft = step / fSteps;
          // Arching curve: rises gently near trunk, arches gracefully, droops at the tip
          const rise = Math.sin(ft * Math.PI * 0.55) * tier.archMul;
          const droop = Math.pow(ft, 1.85) * tier.droopMul;
          const tipDroop = Math.pow(Math.max(0, ft - 0.65) / 0.35, 2) * 0.25;
          const archY = rise - droop - tipDroop + tier.tilt * (1.0 - ft);

          const archDist = ft * tier.len;
          // Tapered pinnate frond profile: narrow base, wide mid-blade, pointed tip
          const w = Math.sin(ft * Math.PI) * (0.24 * (1.0 - ft * 0.25));

          const lx = Math.cos(baseAngle) * archDist;
          const lz = Math.sin(baseAngle) * archDist;
          const perpX = -Math.sin(baseAngle) * w;
          const perpZ = Math.cos(baseAngle) * w;

          // Subtle V-angle depth on frond leaflets
          const leafV = -Math.sin(ft * Math.PI) * 0.035;

          fPos.push(lx + perpX, archY + leafV, lz + perpZ);
          fPos.push(lx - perpX, archY + leafV, lz - perpZ);

          if (step < fSteps) {
            const b = step * 2;
            fIndices.push(b, b + 1, b + 2);
            fIndices.push(b + 1, b + 3, b + 2);
          }
        }

        frondGeo.setAttribute('position', new THREE.Float32BufferAttribute(fPos, 3));
        frondGeo.setIndex(fIndices);
        frondGeo.computeVertexNormals();
        geometriesToDispose.push(frondGeo);

        const frondMesh = new THREE.Mesh(frondGeo, palmFrondMat);
        frondMesh.castShadow = true;
        crown.add(frondMesh);
        totalFrondIdx++;
      }
    });

    // Coconut cluster
    const coconutGeo = new THREE.SphereGeometry(0.08, 6, 6);
    geometriesToDispose.push(coconutGeo);
    const cocoMat = new THREE.MeshLambertMaterial({ color: 0x4e3e2c });
    materialsToDispose.push(cocoMat);

    for (let c = 0; c < 4; c++) {
      const coco = new THREE.Mesh(coconutGeo, cocoMat);
      coco.position.set(
        Math.cos(c * 1.5) * 0.12,
        -0.08,
        Math.sin(c * 1.5) * 0.12
      );
      crown.add(coco);
    }

    palmObj.add(crown);
    vegGroup.add(palmObj);

    dynamicMeshes.push({
      mesh: crown,
      baseRotation: crown.rotation.clone(),
      swayScale: 0.08,
    });
  }

  palmPositions.forEach((p) => {
    // Ensure inside natural footprint and not in water
    if (isInsidePhuQuocFootprint(p.x, p.z, 0.40) && !isInWater(p.x, p.z)) {
      createPalmTree(p.x, p.z, p.leanAngle, p.leanDir);
    }
  });

  // --- 2. Whistling Pines (Cây Phi Lao) on High Ground (Z < -3) ---
  const pineCount = 20;
  const pineTrunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 6);
  geometriesToDispose.push(pineTrunkGeo);
  const pineCanopyGeo = new THREE.IcosahedronGeometry(0.65, 2);
  pineCanopyGeo.scale(1, 1.9, 0.85);
  geometriesToDispose.push(pineCanopyGeo);

  const pineTrunkMesh = new THREE.InstancedMesh(pineTrunkGeo, palmTrunkMat, pineCount);
  const pineCanopyMesh = new THREE.InstancedMesh(pineCanopyGeo, casuarinaMat, pineCount);
  pineTrunkMesh.castShadow = true;
  pineCanopyMesh.castShadow = true;

  const dummy = new THREE.Object3D();
  let placedPines = 0;

  for (let i = 0; i < pineCount * 5 && placedPines < pineCount; i++) {
    const cluster = [[-6.7, -5.5], [-1.4, -6.0], [5.8, -4.7]][i % 3];
    const px = cluster[0] + rng.range(-1.5, 1.5);
    const pz = cluster[1] + rng.range(-1.1, 1.1);

    if (isInsidePhuQuocFootprint(px, pz, 0.45) && getDistanceToShore(px, pz) > 4.0 && !isInWater(px, pz)) {
      const py = getHeightAt(px, pz);
      const scale = rng.range(0.65, 1.05);

      // Trunk
      dummy.position.set(px, py + 0.6 * scale, pz);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.updateMatrix();
      pineTrunkMesh.setMatrixAt(placedPines, dummy.matrix);

      // Canopy
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
  // Cascades softly over bungalow trellises and granite boulders
  const bougCount = 35;
  const bougGeo = new THREE.SphereGeometry(0.22, 7, 5);
  bougGeo.scale(1.2, 0.62, 1.1);
  geometriesToDispose.push(bougGeo);
  const bougMesh = new THREE.InstancedMesh(bougGeo, bougainvilleaMat, bougCount);
  bougMesh.castShadow = true;

  // Concentrated near bungalows and eastern headland rocks
  const bougCenters = [
    { x: -4.8, z: -0.6, r: 1.1 }, // Bungalow 1
    { x: -1.8, z: -2.2, r: 1.1 }, // Bungalow 2
    { x: 1.8, z: -1.5, r: 1.1 },  // Bungalow 3
    { x: 4.5, z: 1.5, r: 1.6 },   // Eastern granite rocks
  ];

  let placedBoug = 0;
  for (let i = 0; i < bougCount; i++) {
    const center = bougCenters[i % bougCenters.length];
    const ox = rng.range(-center.r, center.r);
    const oz = rng.range(-center.r, center.r);
    const bx = center.x + ox;
    const bz = center.z + oz;
    if (!isInsidePhuQuocFootprint(bx, bz, 0.30)) continue;
    const scale = rng.range(0.45, 0.95);
    const by = getHeightAt(bx, bz) + 0.08 * scale;

    dummy.position.set(bx, by, bz);
    dummy.scale.set(scale, scale * 0.75, scale);
    dummy.rotation.set(rng.range(0, 0.3), rng.range(0, Math.PI * 2), 0);
    dummy.updateMatrix();
    bougMesh.setMatrixAt(placedBoug, dummy.matrix);
    placedBoug++;
  }
  bougMesh.count = Math.max(1, placedBoug);
  bougMesh.instanceMatrix.needsUpdate = true;
  vegGroup.add(bougMesh);

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
      const lushGreen = new THREE.Color(0x235f26);
      const dryGreen = PHUQUOC_COLORS.vegetation.palmFrond;
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
