import * as THREE from 'three';
import { PHUQUOC_COLORS } from './constants';
import { BOAT_SPOTS } from './shoreline';

export interface PhuQuocBoatsSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, waterLevel: number, windStrength: number, flowSpeed: number): void;
  dispose(): void;
}

export function createPhuQuocBoats(parentGroup: THREE.Group): PhuQuocBoatsSystem {
  const boatsGroup = new THREE.Group();
  boatsGroup.name = 'PhuQuocBoats';
  parentGroup.add(boatsGroup);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // --- 1. Thuyền Thúng (Vietnamese Coracle / Basket Boat) ---
  const thungGroup = new THREE.Group();
  thungGroup.name = 'ThuyenThung';

  const thungRadius = 0.55;
  const thungDepth = 0.35;

  // Basket bowl geometry (hemisphere)
  const bowlGeo = new THREE.SphereGeometry(
    thungRadius,
    16,
    12,
    0,
    Math.PI * 2,
    Math.PI * 0.35,
    Math.PI * 0.65
  );
  geometriesToDispose.push(bowlGeo);
  bowlGeo.scale(1.0, thungDepth / thungRadius, 1.0);

  // Black pitch/tar base & bamboo weave material
  const pitchMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungPitch,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(pitchMat);
  const bowlMesh = new THREE.Mesh(bowlGeo, pitchMat);
  thungGroup.add(bowlMesh);

  // Top rim (blue painted bamboo ring)
  const rimGeo = new THREE.TorusGeometry(thungRadius, 0.035, 8, 24);
  geometriesToDispose.push(rimGeo);
  rimGeo.rotateX(Math.PI / 2);
  const rimMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungRimBlue,
  });
  materialsToDispose.push(rimMat);
  const rimMesh = new THREE.Mesh(rimGeo, rimMat);
  rimMesh.position.y = 0.12;
  thungGroup.add(rimMesh);

  // Cross bamboo seat bench
  const seatGeo = new THREE.BoxGeometry(thungRadius * 1.8, 0.04, 0.18);
  geometriesToDispose.push(seatGeo);
  const seatMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungBamboo,
  });
  materialsToDispose.push(seatMat);
  const seatMesh = new THREE.Mesh(seatGeo, seatMat);
  seatMesh.position.y = 0.06;
  thungGroup.add(seatMesh);

  // Wooden paddle resting inside
  const paddleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6);
  geometriesToDispose.push(paddleGeo);
  const paddleMat = new THREE.MeshLambertMaterial({ color: 0x8a603c });
  materialsToDispose.push(paddleMat);
  const paddle = new THREE.Mesh(paddleGeo, paddleMat);
  paddle.position.set(0.1, 0.08, 0.1);
  paddle.rotation.set(0.3, 0.2, 0.6);
  thungGroup.add(paddle);

  boatsGroup.add(thungGroup);

  // --- 2. Ghe Nhỏ (Vietnamese Coastal Fishing Boat / Skiff) ---
  const gheGroup = new THREE.Group();
  gheGroup.name = 'GheNho';

  // Hull profile: pointed bow, tapered stern, flat bottom
  const hullLength = 2.4;
  const hullWidth = 0.65;
  const hullHeight = 0.38;

  const hullGeo = new THREE.BufferGeometry();
  // Construct procedural faceted skiff hull
  const hPositions: number[] = [
    // Keel bottom (Z: -half to +half)
    0, -hullHeight * 0.45, 1.2,    // 0: bow tip
    0, -hullHeight * 0.48, 0.0,    // 1: mid keel
    0, -hullHeight * 0.42, -1.1,   // 2: stern bottom

    // Port gunwale
    -hullWidth * 0.05, hullHeight * 0.52, 1.25,  // 3: bow port gunwale
    -hullWidth * 0.52, hullHeight * 0.48, 0.0,   // 4: mid port gunwale
    -hullWidth * 0.38, hullHeight * 0.45, -1.1,  // 5: stern port gunwale

    // Starboard gunwale
    hullWidth * 0.05, hullHeight * 0.52, 1.25,   // 6: bow stbd gunwale
    hullWidth * 0.52, hullHeight * 0.48, 0.0,    // 7: mid stbd gunwale
    hullWidth * 0.38, hullHeight * 0.45, -1.1,   // 8: stern stbd gunwale
  ];

  const hIndices: number[] = [
    // Port side
    0, 3, 4,
    0, 4, 1,
    1, 4, 5,
    1, 5, 2,

    // Starboard side
    0, 7, 6,
    0, 1, 7,
    1, 8, 7,
    1, 2, 8,

    // Stern transom
    2, 5, 8,
  ];

  hullGeo.setAttribute('position', new THREE.Float32BufferAttribute(hPositions, 3));
  hullGeo.setIndex(hIndices);
  hullGeo.computeVertexNormals();
  geometriesToDispose.push(hullGeo);

  const hullMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheHull,
    side: THREE.DoubleSide,
  });
  materialsToDispose.push(hullMat);
  const hullMesh = new THREE.Mesh(hullGeo, hullMat);
  hullMesh.castShadow = true;
  gheGroup.add(hullMesh);

  // Red gunwale trim
  const trimGeo = new THREE.BoxGeometry(hullWidth * 1.05, 0.04, hullLength * 0.98);
  geometriesToDispose.push(trimGeo);
  trimGeo.scale(0.9, 1, 1);
  const trimMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheRedTrim,
  });
  materialsToDispose.push(trimMat);
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.y = hullHeight * 0.46;
  gheGroup.add(trimMesh);

  // Wooden deck thwarts / cross benches
  const thwartGeo = new THREE.BoxGeometry(hullWidth * 0.7, 0.03, 0.16);
  geometriesToDispose.push(thwartGeo);
  const thwartMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheWood,
  });
  materialsToDispose.push(thwartMat);

  const thwart1 = new THREE.Mesh(thwartGeo, thwartMat);
  thwart1.position.set(0, hullHeight * 0.25, 0.4);
  gheGroup.add(thwart1);

  const thwart2 = new THREE.Mesh(thwartGeo, thwartMat);
  thwart2.position.set(0, hullHeight * 0.25, -0.4);
  gheGroup.add(thwart2);

  // Eye of the boat (Mắt thuyền truyền thống Việt Nam)
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  geometriesToDispose.push(eyeGeo);
  eyeGeo.scale(0.3, 1, 1);
  const eyeMat = new THREE.MeshBasicMaterial({
    color: PHUQUOC_COLORS.boats.gheYellowEye,
  });
  materialsToDispose.push(eyeMat);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-hullWidth * 0.18, hullHeight * 0.32, 1.05);
  gheGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(hullWidth * 0.18, hullHeight * 0.32, 1.05);
  gheGroup.add(rightEye);

  boatsGroup.add(gheGroup);

  return {
    group: boatsGroup,
    update(dt: number, elapsed: number, waterLevel: number, windStrength: number, flowSpeed: number) {
      // 1. Update Thuyen Thung Bobbing & Roll
      const thungCfg = BOAT_SPOTS.thung;
      const thungY = waterLevel - thungCfg.draft;
      // Wave oscillation at thung position
      const thungWave = Math.sin(elapsed * 2.2 * flowSpeed + thungCfg.x * 0.8) * 0.025 * windStrength;
      const thungRoll = Math.sin(elapsed * 1.8 * flowSpeed) * 0.06 * windStrength;
      const thungPitch = Math.cos(elapsed * 2.0 * flowSpeed) * 0.04 * windStrength;

      thungGroup.position.set(thungCfg.x, thungY + thungWave, thungCfg.z);
      thungGroup.rotation.set(thungPitch, 0.4 + Math.sin(elapsed * 0.3) * 0.1, thungRoll);

      // 2. Update Ghe Nho Swell Pitch & Yaw
      const gheCfg = BOAT_SPOTS.ghe;
      const gheY = waterLevel - gheCfg.draft;
      const gheWave = Math.sin(elapsed * 1.9 * flowSpeed + gheCfg.z * 0.5) * 0.03 * windStrength;
      const ghePitch = Math.sin(elapsed * 1.6 * flowSpeed) * 0.07 * windStrength;
      const gheRoll = Math.cos(elapsed * 1.4 * flowSpeed) * 0.05 * windStrength;

      gheGroup.position.set(gheCfg.x, gheY + gheWave, gheCfg.z);
      gheGroup.rotation.set(ghePitch, -0.6 + Math.sin(elapsed * 0.25) * 0.08, gheRoll);
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      boatsGroup.clear();
      parentGroup.remove(boatsGroup);
    },
  };
}
