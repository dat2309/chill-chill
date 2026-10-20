import * as THREE from 'three';
import { PHUQUOC_COLORS, PhuQuocSeason } from './constants';
import { BUNGALOW_SPOTS, PIER_CONFIG } from './shoreline';

export interface PhuQuocArchitectureSystem {
  group: THREE.Group;
  emissiveMeshes: THREE.Mesh[];
  lanternLights: THREE.PointLight[];
  update(dt: number, elapsed: number, timeOfDay: number): void;
  updateSeason(season: PhuQuocSeason, t: number): void;
  dispose(): void;
}

export function createPhuQuocArchitecture(
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number
): PhuQuocArchitectureSystem {
  const archGroup = new THREE.Group();
  archGroup.name = 'PhuQuocArchitecture';
  parentGroup.add(archGroup);

  const emissiveMeshes: THREE.Mesh[] = [];
  const lanternLights: THREE.PointLight[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // Materials
  const deckMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.wood.deck });
  const postMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.wood.weathered });
  const wallMat = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.wood.bamboo });
  const thatchMatDry = new THREE.MeshLambertMaterial({ color: PHUQUOC_COLORS.wood.thatch });
  materialsToDispose.push(deckMat, postMat, wallMat, thatchMatDry);

  const lanternMat = new THREE.MeshStandardMaterial({
    color: PHUQUOC_COLORS.architecture.lanternWarm,
    emissive: PHUQUOC_COLORS.architecture.lanternGlow,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });
  materialsToDispose.push(lanternMat);

  // --- 1. Thatched Stilt Bungalows (Mái Lá Phú Quốc) ---
  const thatchMeshes: THREE.Mesh[] = [];

  BUNGALOW_SPOTS.forEach((spot, idx) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(spot.x, 0, spot.z);
    bGroup.rotation.y = spot.rotationY;

    const groundH = getHeightAt(spot.x, spot.z);
    const floorH = groundH + 0.45; // Stilt elevation

    // A. Wooden Stilts (4 corner posts)
    const postRadius = 0.055;
    const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, 1, 8);
    geometriesToDispose.push(postGeo);

    const cornerOffsets = [
      [-0.9, -0.9],
      [0.9, -0.9],
      [-0.9, 0.9],
      [0.9, 0.9],
    ];

    cornerOffsets.forEach(([ox, oz]) => {
      // Rotate offset to world space to query ground height
      const cosR = Math.cos(spot.rotationY);
      const sinR = Math.sin(spot.rotationY);
      const wx = spot.x + ox * cosR - oz * sinR;
      const wz = spot.z + ox * sinR + oz * cosR;
      const cornerGroundH = getHeightAt(wx, wz);

      const stiltLen = Math.max(0.2, floorH - cornerGroundH);
      const stiltMesh = new THREE.Mesh(postGeo, postMat);
      stiltMesh.scale.set(1, stiltLen, 1);
      stiltMesh.position.set(ox, cornerGroundH + stiltLen / 2, oz);
      stiltMesh.castShadow = true;
      stiltMesh.receiveShadow = true;
      bGroup.add(stiltMesh);
    });

    // B. Deck / Veranda Platform
    const deckGeo = new THREE.BoxGeometry(2.1, 0.08, 2.1);
    geometriesToDispose.push(deckGeo);
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, floorH, 0);
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    bGroup.add(deckMesh);

    // Front veranda step
    const stepGeo = new THREE.BoxGeometry(0.8, 0.12, 0.4);
    geometriesToDispose.push(stepGeo);
    const stepMesh = new THREE.Mesh(stepGeo, deckMat);
    stepMesh.position.set(0, floorH - 0.2, 1.25);
    bGroup.add(stepMesh);

    // C. Woven Bamboo Walls
    const wallGeo = new THREE.BoxGeometry(1.7, 1.1, 1.5);
    geometriesToDispose.push(wallGeo);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, floorH + 0.58, -0.15);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    bGroup.add(wallMesh);

    // Door cutout (darkened box)
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x2b1d0e });
    materialsToDispose.push(doorMat);
    const doorGeo = new THREE.PlaneGeometry(0.5, 0.85);
    geometriesToDispose.push(doorGeo);
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.set(0, floorH + 0.45, 0.605);
    bGroup.add(doorMesh);

    // D. Steep Thatched Roof (Mái lá dừa dạng tháp dốc truyền thống)
    const roofGeo = new THREE.ConeGeometry(1.65, 1.2, 4);
    geometriesToDispose.push(roofGeo);
    // Rotate 45 deg so pyramid faces align with rectangular walls
    roofGeo.rotateY(Math.PI / 4);

    const roofMesh = new THREE.Mesh(roofGeo, thatchMatDry);
    roofMesh.position.set(0, floorH + 1.15 + 0.58, -0.15);
    roofMesh.scale.set(1.15, 1.0, 1.05);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    bGroup.add(roofMesh);
    thatchMeshes.push(roofMesh);

    // E. Warm Hanging Evening Lantern
    const lanternGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.14, 8);
    geometriesToDispose.push(lanternGeo);
    const lanternMesh = new THREE.Mesh(lanternGeo, lanternMat);
    lanternMesh.position.set(0.65, floorH + 0.95, 0.85);
    bGroup.add(lanternMesh);
    emissiveMeshes.push(lanternMesh);

    // Small point light for lantern glow
    const pLight = new THREE.PointLight(0xff9922, 0.85, 3.8);
    pLight.position.set(spot.x + 0.65, floorH + 0.9, spot.z + 0.85);
    archGroup.add(pLight);
    lanternLights.push(pLight);

    archGroup.add(bGroup);
  });

  // --- 2. Wooden Jetty / Pier (Cầu Tàu Gỗ Phú Quốc) ---
  const pierGroup = new THREE.Group();
  pierGroup.name = 'Pier';

  const pCfg = PIER_CONFIG;
  const pierLength = pCfg.endZ - pCfg.startZ; // 5.0
  const pierCenterZ = (pCfg.startZ + pCfg.endZ) / 2;

  // Deck planking
  const pierDeckGeo = new THREE.BoxGeometry(pCfg.width, 0.08, pierLength);
  geometriesToDispose.push(pierDeckGeo);
  const pierDeckMesh = new THREE.Mesh(pierDeckGeo, deckMat);
  pierDeckMesh.position.set(pCfg.startX, pCfg.deckElevation, pierCenterZ);
  pierDeckMesh.castShadow = true;
  pierDeckMesh.receiveShadow = true;
  pierGroup.add(pierDeckMesh);

  // Pilings (Cọc gỗ chạm đáy biển)
  const pilingRadius = 0.05;
  const pilingGeo = new THREE.CylinderGeometry(pilingRadius, pilingRadius, 1, 8);
  geometriesToDispose.push(pilingGeo);

  const numPairs = pCfg.pilingPairs;
  const halfPierW = pCfg.width / 2 - 0.08;

  for (let i = 0; i < numPairs; i++) {
    const tz = i / (numPairs - 1);
    const pz = pCfg.startZ + tz * pierLength;

    [-halfPierW, halfPierW].forEach((ox) => {
      const px = pCfg.startX + ox;
      const bedH = getHeightAt(px, pz);
      const pilingLen = Math.max(0.15, pCfg.deckElevation - bedH + 0.05);

      const pMesh = new THREE.Mesh(pilingGeo, postMat);
      pMesh.scale.set(1, pilingLen, 1);
      pMesh.position.set(px, bedH + pilingLen / 2 - 0.02, pz);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pierGroup.add(pMesh);
    });
  }

  // Pier Head Mooring Posts & Lantern
  const postHeadGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
  geometriesToDispose.push(postHeadGeo);
  const leftHeadPost = new THREE.Mesh(postHeadGeo, postMat);
  leftHeadPost.position.set(pCfg.startX - halfPierW, pCfg.deckElevation + 0.16, pCfg.endZ - 0.05);
  pierGroup.add(leftHeadPost);

  const rightHeadPost = new THREE.Mesh(postHeadGeo, postMat);
  rightHeadPost.position.set(pCfg.startX + halfPierW, pCfg.deckElevation + 0.16, pCfg.endZ - 0.05);
  pierGroup.add(rightHeadPost);

  // Lantern on Pier Head
  const pierLantern = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.08),
    lanternMat
  );
  geometriesToDispose.push(pierLantern.geometry);
  pierLantern.position.set(pCfg.startX + halfPierW, pCfg.deckElevation + 0.38, pCfg.endZ - 0.05);
  pierGroup.add(pierLantern);
  emissiveMeshes.push(pierLantern);

  const pierLight = new THREE.PointLight(0xff9922, 0.7, 3.5);
  pierLight.position.copy(pierLantern.position);
  archGroup.add(pierLight);
  lanternLights.push(pierLight);

  archGroup.add(pierGroup);

  // --- 3. Beach Relaxation Elements ---
  // A. Sun Loungers (2 wooden beach chairs on dry sand)
  const loungerMat = new THREE.MeshLambertMaterial({ color: 0xe0d2b4 });
  materialsToDispose.push(loungerMat);
  const loungerGeo = new THREE.BoxGeometry(0.45, 0.06, 1.0);
  geometriesToDispose.push(loungerGeo);

  const lounger1Pos = new THREE.Vector3(-3.2, getHeightAt(-3.2, 0.8) + 0.08, 0.8);
  const lounger1 = new THREE.Mesh(loungerGeo, loungerMat);
  lounger1.position.copy(lounger1Pos);
  lounger1.rotation.set(-0.25, 0.3, 0);
  lounger1.castShadow = true;
  archGroup.add(lounger1);

  const lounger2Pos = new THREE.Vector3(-2.6, getHeightAt(-2.6, 1.0) + 0.08, 1.0);
  const lounger2 = new THREE.Mesh(loungerGeo, loungerMat);
  lounger2.position.copy(lounger2Pos);
  lounger2.rotation.set(-0.25, 0.25, 0);
  lounger2.castShadow = true;
  archGroup.add(lounger2);

  // B. Beach Umbrella (Dù che bãi biển)
  const umbrellaPoleMat = new THREE.MeshLambertMaterial({ color: 0x4a4036 });
  materialsToDispose.push(umbrellaPoleMat);
  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8);
  geometriesToDispose.push(poleGeo);
  const pole = new THREE.Mesh(poleGeo, umbrellaPoleMat);
  const umbX = -2.9;
  const umbZ = 0.5;
  const umbY = getHeightAt(umbX, umbZ) + 0.65;
  pole.position.set(umbX, umbY, umbZ);
  pole.rotation.z = -0.08;
  pole.castShadow = true;
  archGroup.add(pole);

  const canopyGeo = new THREE.ConeGeometry(0.85, 0.4, 8);
  geometriesToDispose.push(canopyGeo);
  const canopyMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.architecture.umbrellaStripe1,
  });
  materialsToDispose.push(canopyMat);
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(umbX - 0.05, umbY + 0.62, umbZ);
  canopy.castShadow = true;
  archGroup.add(canopy);

  // C. Beached SUP Board (Ván SUP trên mép cát)
  const supGeo = new THREE.CylinderGeometry(0.22, 0.26, 1.6, 12);
  geometriesToDispose.push(supGeo);
  supGeo.scale(0.8, 1.0, 0.12); // flatten into board
  supGeo.rotateX(Math.PI / 2);

  const supMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.architecture.supBoard,
  });
  materialsToDispose.push(supMat);

  const supMesh = new THREE.Mesh(supGeo, supMat);
  const supX = 0.8;
  const supZ = 1.8;
  const supY = getHeightAt(supX, supZ) + 0.05;
  supMesh.position.set(supX, supY, supZ);
  supMesh.rotation.set(0.12, 0.6, -0.08);
  supMesh.castShadow = true;
  archGroup.add(supMesh);

  return {
    group: archGroup,
    emissiveMeshes,
    lanternLights,
    update(dt: number, elapsed: number, timeOfDay: number) {
      // Evening lantern glow intensity: peak during sunset / evening (17:00 to 22:00)
      let lanternFactor = 0.0;
      if (timeOfDay >= 17.0 && timeOfDay <= 21.5) {
        // Evening transition
        lanternFactor = 0.8 + 0.3 * Math.sin(elapsed * 4.0); // Gentle warm flicker
      } else if (timeOfDay > 21.5 || timeOfDay < 5.5) {
        // Night
        lanternFactor = 0.9 + 0.2 * Math.sin(elapsed * 3.5);
      } else if (timeOfDay >= 5.5 && timeOfDay < 6.5) {
        // Dawn fadeout
        lanternFactor = 0.5 * (6.5 - timeOfDay);
      }

      lanternMat.emissiveIntensity = lanternFactor;
      lanternLights.forEach((light) => {
        light.intensity = lanternFactor * 0.9;
      });
    },
    updateSeason(season: PhuQuocSeason, t: number) {
      // In rainy season, thatch roof absorbs moisture and darkens slightly
      const targetColor = season === 'rainy' ? PHUQUOC_COLORS.wood.thatchWet : PHUQUOC_COLORS.wood.thatch;
      thatchMatDry.color.lerp(targetColor, t);
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      archGroup.clear();
      parentGroup.remove(archGroup);
    },
  };
}
