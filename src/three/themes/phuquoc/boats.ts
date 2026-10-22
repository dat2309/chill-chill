import * as THREE from 'three';
import { PHUQUOC_COLORS } from './constants';
import { BOAT_SPOTS } from './shoreline';

export interface BoatCavityState {
  thungInvMatrix: THREE.Matrix4;
  gheInvMatrix: THREE.Matrix4;
}

export interface PhuQuocBoatsSystem {
  group: THREE.Group;
  thungGroup: THREE.Group;
  gheGroup: THREE.Group;
  getCavities(): BoatCavityState;
  update(dt: number, elapsed: number, waterLevel: number, windStrength: number, flowSpeed: number): void;
  dispose(): void;
}

/**
 * Standardized Boat Design Specifications (local coordinates):
 * The origin (0, 0, 0) of both boats is located strictly at the Design Waterline (DWL) at y = 0.
 * Everything with y > 0 is freeboard (above water at static equilibrium).
 * Everything with y < 0 is submerged hull / draft.
 */
export const BOAT_SPECS = {
  thung: {
    dwlY: 0.0,
    keelY: -0.14,            // Bottom of basket hull (draft = 0.14m)
    gunwaleY: 0.22,          // Top rim elevation (freeboard = 0.22m)
    seatY: 0.07,             // Cross seat bench elevation (7cm above DWL)
    outerRadius: 0.55,       // Outer gunwale radius
    innerRadius: 0.51,       // Inner gunwale radius
    bottomRadius: 0.32,      // Outer bottom radius
    freeboard: 0.22,         // Physical freeboard
    draft: 0.14,             // Physical draft
  },
  ghe: {
    dwlY: 0.0,
    keelY: -0.18,            // Midship keel elevation (draft = 0.18m)
    midGunwaleY: 0.20,       // Midship gunwale elevation (freeboard = 0.20m)
    bowSheerY: 0.33,         // Bow sheer elevation (rises forward)
    sternSheerY: 0.24,       // Stern sheer elevation (rises aft)
    thwartY: 0.08,           // Seat thwart elevation (8cm above DWL)
    length: 2.40,            // Length overall from z = -1.20 to +1.20
    beam: 0.68,              // Maximum beam at midship
    freeboard: 0.20,         // Physical midship freeboard
    draft: 0.18,             // Physical draft
  },
};

/**
 * Exact analytical water wave elevation and slope matching Phu Quoc water shader:
 * S(x, z, t) = sin(1.8*z - 1.5*t) * 0.035 * w + cos(1.2*x + 0.8*z - 2.0*t) * 0.02 * w
 */
export function getOceanWaveElevation(x: number, z: number, time: number, windStrength: number): number {
  let swell = Math.sin(z * 1.8 - time * 1.5) * 0.035 * windStrength;
  swell += Math.cos(x * 1.2 + z * 0.8 - time * 2.0) * 0.02 * windStrength;
  return swell;
}

export function getOceanWaveSlopes(x: number, z: number, time: number, windStrength: number): { dSdx: number; dSdz: number } {
  const dSdx = -Math.sin(x * 1.2 + z * 0.8 - time * 2.0) * 1.2 * 0.02 * windStrength;
  const dSdz = Math.cos(z * 1.8 - time * 1.5) * 1.8 * 0.035 * windStrength
             - Math.sin(x * 1.2 + z * 0.8 - time * 2.0) * 0.8 * 0.02 * windStrength;
  return { dSdx, dSdz };
}

/**
 * Evaluates whether a local coordinate point (lx, ly, lz) is inside the open inner cavity of Thuyen Thung.
 */
export function isInsideThungCavity(local: THREE.Vector3): boolean {
  if (local.y < -0.11 || local.y > 0.22) return false;
  const rInner = local.y < 0.05
    ? THREE.MathUtils.lerp(0.28, 0.45, (local.y + 0.11) / 0.16)
    : THREE.MathUtils.lerp(0.45, 0.51, (local.y - 0.05) / 0.17);
  const r = Math.hypot(local.x, local.z);
  return r < rInner - 0.015;
}

/**
 * Evaluates whether a local coordinate point (lx, ly, lz) is inside the open cockpit hold of Ghe Nho.
 */
export function isInsideGheCavity(local: THREE.Vector3): boolean {
  if (local.z < -1.18 || local.z > 1.15) return false;
  const lz = local.z;
  const normZ = lz < 0.0 ? (lz / 1.18) : (lz / 1.15); // -1 at stern, 0 at mid, +1 at bow
  const floorY = lz < 0.0 ? THREE.MathUtils.lerp(-0.14, -0.11, -normZ) : THREE.MathUtils.lerp(-0.14, 0.06, normZ);
  const sheerY = lz < 0.0 ? THREE.MathUtils.lerp(0.20, 0.24, -normZ) : THREE.MathUtils.lerp(0.20, 0.32, normZ);

  if (local.y < floorY || local.y > sheerY) return false;

  const sheerHalfW = lz < 0.0
    ? THREE.MathUtils.lerp(0.30, 0.21, -normZ)
    : (normZ < 0.65 ? THREE.MathUtils.lerp(0.30, 0.22, normZ / 0.65) : THREE.MathUtils.lerp(0.22, 0.03, (normZ - 0.65) / 0.35));
  const floorHalfW = lz < 0.0
    ? THREE.MathUtils.lerp(0.20, 0.14, -normZ)
    : THREE.MathUtils.lerp(0.20, 0.02, normZ);

  const yFrac = Math.min(Math.max((local.y - floorY) / Math.max(0.01, sheerY - floorY), 0.0), 1.0);
  const innerW = THREE.MathUtils.lerp(floorHalfW, sheerHalfW, yFrac);

  return Math.abs(local.x) < innerW - 0.015;
}

/**
 * Evaluates whether a world-space point falls inside either boat's open cockpit cavity,
 * taking into account the boat's full 3D position, wave heave, yaw, pitch, and roll.
 */
export function isPointInBoatCavity(worldPos: THREE.Vector3, boats: PhuQuocBoatsSystem): boolean {
  const cavities = boats.getCavities();
  const thungLoc = worldPos.clone().applyMatrix4(cavities.thungInvMatrix);
  if (isInsideThungCavity(thungLoc)) return true;

  const gheLoc = worldPos.clone().applyMatrix4(cavities.gheInvMatrix);
  if (isInsideGheCavity(gheLoc)) return true;

  return false;
}

export function createPhuQuocBoats(parentGroup: THREE.Group): PhuQuocBoatsSystem {
  const boatsGroup = new THREE.Group();
  boatsGroup.name = 'PhuQuocBoats';
  parentGroup.add(boatsGroup);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // =========================================================================
  // 1. THUYỀN THÚNG (Vietnamese Basket Boat / Coracle)
  // Hollow woven bamboo basket with waterproof black tar bottom, blue rim,
  // transverse bamboo seat bench above waterline, and wooden paddle.
  // =========================================================================
  const thungGroup = new THREE.Group();
  thungGroup.name = 'ThuyenThung';

  const tSpecs = BOAT_SPECS.thung;
  const nSlices = 28;

  // Revolved profile points (r, y) forming hollow double-walled basket
  // 0: inner bottom center, 1: inner bottom rim, 2: inner mid, 3: inner top rim,
  // 4: outer top rim, 5: outer mid, 6: outer bottom rim, 7: outer bottom center
  const thungProfile: [number, number][] = [
    [0.0, -0.11],
    [0.28, -0.11],
    [0.45, 0.05],
    [tSpecs.innerRadius, tSpecs.gunwaleY],
    [tSpecs.outerRadius, tSpecs.gunwaleY],
    [0.49, 0.05],
    [tSpecs.bottomRadius, tSpecs.keelY],
    [0.0, tSpecs.keelY],
  ];

  const thungPositions: number[] = [];
  const thungIndices: number[] = [];

  for (let s = 0; s < nSlices; s++) {
    const phi = (s / nSlices) * Math.PI * 2;
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);

    for (let p = 0; p < thungProfile.length; p++) {
      const [r, y] = thungProfile[p];
      thungPositions.push(r * cosP, y, r * sinP);
    }
  }

  const pCount = thungProfile.length;
  for (let s = 0; s < nSlices; s++) {
    const nextS = (s + 1) % nSlices;
    const col0 = s * pCount;
    const col1 = nextS * pCount;

    // Inner bottom fan (center is 0) -> normal points UP (+Y)
    thungIndices.push(col0 + 0, col1 + 1, col0 + 1);

    // Inner wall quads (1 -> 2, 2 -> 3) -> normal points INWARD into cockpit
    for (let p = 1; p < 3; p++) {
      thungIndices.push(col0 + p, col1 + p + 1, col0 + p + 1);
      thungIndices.push(col0 + p, col1 + p, col1 + p + 1);
    }

    // Top rim lip quad (3 -> 4) -> normal points UP (+Y)
    thungIndices.push(col0 + 3, col1 + 3, col0 + 4);
    thungIndices.push(col0 + 4, col1 + 3, col1 + 4);

    // Outer wall quads (4 -> 5, 5 -> 6) -> normal points OUTWARD away from boat
    for (let p = 4; p < 6; p++) {
      thungIndices.push(col0 + p, col1 + p + 1, col0 + p + 1);
      thungIndices.push(col0 + p, col1 + p, col1 + p + 1);
    }

    // Outer bottom fan (center is 7) -> normal points DOWN (-Y)
    thungIndices.push(col0 + 7, col0 + 6, col1 + 6);
  }

  const thungHullGeo = new THREE.BufferGeometry();
  thungHullGeo.setAttribute('position', new THREE.Float32BufferAttribute(thungPositions, 3));
  thungHullGeo.setIndex(thungIndices);
  thungHullGeo.computeVertexNormals();
  geometriesToDispose.push(thungHullGeo);

  const thungMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungPitch,
    side: THREE.FrontSide,
  });
  materialsToDispose.push(thungMat);
  const thungHullMesh = new THREE.Mesh(thungHullGeo, thungMat);
  thungHullMesh.name = 'ThungHull';
  thungHullMesh.castShadow = true;
  thungHullMesh.receiveShadow = true;
  thungGroup.add(thungHullMesh);

  // Woven bamboo outer belt / accent rim ring (blue painted bamboo ring)
  const thungRimGeo = new THREE.TorusGeometry(
    (tSpecs.outerRadius + tSpecs.innerRadius) / 2,
    0.032,
    8,
    32
  );
  thungRimGeo.rotateX(Math.PI / 2);
  thungRimGeo.translate(0, tSpecs.gunwaleY, 0);
  geometriesToDispose.push(thungRimGeo);

  const thungRimMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungRimBlue,
  });
  materialsToDispose.push(thungRimMat);
  const thungRimMesh = new THREE.Mesh(thungRimGeo, thungRimMat);
  thungRimMesh.castShadow = true;
  thungGroup.add(thungRimMesh);

  // Transverse bamboo seat bench across thúng center (elevated at y = +0.07m above DWL)
  const thungSeatGeo = new THREE.BoxGeometry(0.96, 0.035, 0.18);
  thungSeatGeo.translate(0, tSpecs.seatY, 0);
  geometriesToDispose.push(thungSeatGeo);

  const thungSeatMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.thungBamboo,
  });
  materialsToDispose.push(thungSeatMat);
  const thungSeatMesh = new THREE.Mesh(thungSeatGeo, thungSeatMat);
  thungSeatMesh.name = 'ThungSeat';
  thungSeatMesh.castShadow = true;
  thungGroup.add(thungSeatMesh);

  // Wooden paddle resting diagonally inside
  const paddleShaftGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.82, 6);
  paddleShaftGeo.rotateZ(0.55);
  paddleShaftGeo.rotateX(0.22);
  paddleShaftGeo.translate(0.12, 0.10, 0.08);
  geometriesToDispose.push(paddleShaftGeo);

  const paddleMat = new THREE.MeshLambertMaterial({ color: 0x8a603c });
  materialsToDispose.push(paddleMat);
  const paddleShaft = new THREE.Mesh(paddleShaftGeo, paddleMat);
  thungGroup.add(paddleShaft);

  const paddleBladeGeo = new THREE.BoxGeometry(0.012, 0.22, 0.08);
  paddleBladeGeo.rotateZ(0.55);
  paddleBladeGeo.rotateX(0.22);
  paddleBladeGeo.translate(-0.19, -0.07, -0.04);
  geometriesToDispose.push(paddleBladeGeo);
  const paddleBlade = new THREE.Mesh(paddleBladeGeo, paddleMat);
  thungGroup.add(paddleBlade);

  boatsGroup.add(thungGroup);

  // =========================================================================
  // 2. GHE NHỎ (Vietnamese Coastal Wooden Skiff / Fishing Boat)
  // Multi-station faceted wooden hull with open cockpit, sheerline gunwale trim,
  // transverse wooden thwarts above DWL, and painted traditional eyes.
  // =========================================================================
  const gheGroup = new THREE.Group();
  gheGroup.name = 'GheNho';

  const gSpecs = BOAT_SPECS.ghe;

  interface GheStation {
    z: number;
    yKeelOut: number;
    wChineOut: number;
    yChineOut: number;
    wSheerOut: number;
    ySheerOut: number;
    wSheerIn: number;
    ySheerIn: number;
    wChineIn: number;
    yChineIn: number;
    yFloorIn: number;
  }

  const gheStations: GheStation[] = [
    // Station 0: Transom stern
    {
      z: -1.20,
      yKeelOut: -0.14,
      wChineOut: 0.18,
      yChineOut: -0.10,
      wSheerOut: 0.25,
      ySheerOut: gSpecs.sternSheerY,
      wSheerIn: 0.21,
      ySheerIn: gSpecs.sternSheerY,
      wChineIn: 0.14,
      yChineIn: -0.07,
      yFloorIn: -0.11,
    },
    // Station 1: Aft
    {
      z: -0.75,
      yKeelOut: -0.17,
      wChineOut: 0.23,
      yChineOut: -0.07,
      wSheerOut: 0.31,
      ySheerOut: 0.21,
      wSheerIn: 0.27,
      ySheerIn: 0.21,
      wChineIn: 0.19,
      yChineIn: -0.04,
      yFloorIn: -0.13,
    },
    // Station 2: Midship aft
    {
      z: -0.25,
      yKeelOut: gSpecs.keelY,
      wChineOut: 0.25,
      yChineOut: -0.08,
      wSheerOut: 0.34,
      ySheerOut: gSpecs.midGunwaleY,
      wSheerIn: 0.30,
      ySheerIn: gSpecs.midGunwaleY,
      wChineIn: 0.21,
      yChineIn: -0.05,
      yFloorIn: -0.14,
    },
    // Station 3: Midship forward
    {
      z: 0.25,
      yKeelOut: gSpecs.keelY,
      wChineOut: 0.24,
      yChineOut: -0.08,
      wSheerOut: 0.33,
      ySheerOut: 0.21,
      wSheerIn: 0.29,
      ySheerIn: 0.21,
      wChineIn: 0.20,
      yChineIn: -0.05,
      yFloorIn: -0.14,
    },
    // Station 4: Forward
    {
      z: 0.70,
      yKeelOut: -0.13,
      wChineOut: 0.17,
      yChineOut: -0.03,
      wSheerOut: 0.26,
      ySheerOut: 0.25,
      wSheerIn: 0.22,
      ySheerIn: 0.25,
      wChineIn: 0.13,
      yChineIn: 0.00,
      yFloorIn: -0.09,
    },
    // Station 5: Bow shoulder
    {
      z: 1.02,
      yKeelOut: -0.02,
      wChineOut: 0.08,
      yChineOut: 0.08,
      wSheerOut: 0.16,
      ySheerOut: 0.29,
      wSheerIn: 0.12,
      ySheerIn: 0.29,
      wChineIn: 0.05,
      yChineIn: 0.10,
      yFloorIn: 0.00,
    },
    // Station 6: Bow stem tip
    {
      z: 1.20,
      yKeelOut: 0.10,
      wChineOut: 0.02,
      yChineOut: 0.18,
      wSheerOut: 0.04,
      ySheerOut: gSpecs.bowSheerY,
      wSheerIn: 0.02,
      ySheerIn: gSpecs.bowSheerY,
      wChineIn: 0.01,
      yChineIn: 0.19,
      yFloorIn: 0.11,
    },
  ];

  // Construct skiff hull vertices: 10 vertices per station (outer and inner rings)
  // Indices per station:
  // 0: outer keel (0, yKeelOut, z)
  // 1: port outer chine (-wChineOut, yChineOut, z)
  // 2: port outer sheer (-wSheerOut, ySheerOut, z)
  // 3: port inner sheer (-wSheerIn, ySheerIn, z)
  // 4: port inner chine (-wChineIn, yChineIn, z)
  // 5: inner floor (0, yFloorIn, z)
  // 6: stbd inner chine (+wChineIn, yChineIn, z)
  // 7: stbd inner sheer (+wSheerIn, ySheerIn, z)
  // 8: stbd outer sheer (+wSheerOut, ySheerOut, z)
  // 9: stbd outer chine (+wChineOut, yChineOut, z)
  const gPositions: number[] = [];
  const gIndices: number[] = [];

  for (const st of gheStations) {
    gPositions.push(
      0, st.yKeelOut, st.z,                     // 0
      -st.wChineOut, st.yChineOut, st.z,        // 1
      -st.wSheerOut, st.ySheerOut, st.z,        // 2
      -st.wSheerIn, st.ySheerIn, st.z,          // 3
      -st.wChineIn, st.yChineIn, st.z,          // 4
      0, st.yFloorIn, st.z,                     // 5
      st.wChineIn, st.yChineIn, st.z,           // 6
      st.wSheerIn, st.ySheerIn, st.z,           // 7
      st.wSheerOut, st.ySheerOut, st.z,         // 8
      st.wChineOut, st.yChineOut, st.z          // 9
    );
  }

  const vPerSt = 10;
  for (let s = 0; s < gheStations.length - 1; s++) {
    const c0 = s * vPerSt;
    const c1 = (s + 1) * vPerSt;

    // Outer hull faces
    // Port bottom: 0 -> 1 (Normal: port -X and down -Y)
    gIndices.push(c0 + 0, c1 + 1, c0 + 1);
    gIndices.push(c0 + 0, c1 + 0, c1 + 1);

    // Port topsides: 1 -> 2 (Normal: port -X and up +Y)
    gIndices.push(c0 + 1, c1 + 2, c0 + 2);
    gIndices.push(c0 + 1, c1 + 1, c1 + 2);

    // Port gunwale sheer lip: 2 -> 3 (Normal: up +Y)
    gIndices.push(c0 + 2, c1 + 2, c0 + 3);
    gIndices.push(c0 + 3, c1 + 2, c1 + 3);

    // Starboard bottom: 0 -> 9 (Normal: starboard +X and down -Y)
    gIndices.push(c0 + 0, c0 + 9, c1 + 9);
    gIndices.push(c0 + 0, c1 + 9, c1 + 0);

    // Starboard topsides: 9 -> 8 (Normal: starboard +X and up +Y)
    gIndices.push(c0 + 9, c0 + 8, c1 + 8);
    gIndices.push(c0 + 9, c1 + 8, c1 + 9);

    // Starboard gunwale sheer lip: 8 -> 7 (Normal: up +Y)
    gIndices.push(c0 + 8, c0 + 7, c1 + 8);
    gIndices.push(c0 + 7, c1 + 7, c1 + 8);

    // Inner cockpit faces
    // Port inner wall: 3 -> 4 (Normal: starboard +X into cockpit)
    gIndices.push(c0 + 3, c1 + 4, c0 + 4);
    gIndices.push(c0 + 3, c1 + 3, c1 + 4);

    // Port inner floor: 4 -> 5 (Normal: up +Y)
    gIndices.push(c0 + 4, c1 + 4, c0 + 5);
    gIndices.push(c0 + 5, c1 + 4, c1 + 5);

    // Starboard inner floor: 5 -> 6 (Normal: up +Y)
    gIndices.push(c0 + 5, c1 + 5, c0 + 6);
    gIndices.push(c0 + 6, c1 + 5, c1 + 6);

    // Starboard inner wall: 6 -> 7 (Normal: port -X into cockpit)
    gIndices.push(c0 + 6, c1 + 6, c0 + 7);
    gIndices.push(c0 + 7, c1 + 6, c1 + 7);
  }

  // Transom rear face closing station 0 (Normal: stern -Z)
  gIndices.push(0, 1, 2);
  gIndices.push(0, 2, 8);
  gIndices.push(0, 8, 9);

  // Cockpit aft interior bulkhead at station 0 (Normal: forward +Z into cockpit)
  gIndices.push(5, 3, 4);
  gIndices.push(5, 7, 3);
  gIndices.push(5, 6, 7);

  // Bow stem front closure at station 6 (Normal: bow +Z)
  const lastC = (gheStations.length - 1) * vPerSt;
  gIndices.push(lastC + 0, lastC + 2, lastC + 1);
  gIndices.push(lastC + 0, lastC + 8, lastC + 2);
  gIndices.push(lastC + 0, lastC + 9, lastC + 8);

  // Cockpit forward interior bulkhead at station 6 (Normal: aft -Z into cockpit)
  gIndices.push(lastC + 5, lastC + 4, lastC + 3);
  gIndices.push(lastC + 5, lastC + 3, lastC + 7);
  gIndices.push(lastC + 5, lastC + 7, lastC + 6);

  const gheHullGeo = new THREE.BufferGeometry();
  gheHullGeo.setAttribute('position', new THREE.Float32BufferAttribute(gPositions, 3));
  gheHullGeo.setIndex(gIndices);
  gheHullGeo.computeVertexNormals();
  geometriesToDispose.push(gheHullGeo);

  const gheHullMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheHull,
    side: THREE.FrontSide,
  });
  materialsToDispose.push(gheHullMat);
  const gheHullMesh = new THREE.Mesh(gheHullGeo, gheHullMat);
  gheHullMesh.name = 'GheHull';
  gheHullMesh.castShadow = true;
  gheHullMesh.receiveShadow = true;
  gheGroup.add(gheHullMesh);

  // Viền mạn đỏ (Red sheerline gunwale trim)
  // Follows the sheerline perimeter around port sheer, bow, starboard sheer, and transom
  // Completely open cockpit (NO solid box covering the boat opening)
  const trimSegments: THREE.BufferGeometry[] = [];
  const trimWidth = 0.038;
  const trimHeight = 0.030;

  for (let s = 0; s < gheStations.length - 1; s++) {
    const stA = gheStations[s];
    const stB = gheStations[s + 1];

    // Port sheer segment
    const p1 = new THREE.Vector3(-stA.wSheerOut, stA.ySheerOut, stA.z);
    const p2 = new THREE.Vector3(-stB.wSheerOut, stB.ySheerOut, stB.z);
    const lenP = p1.distanceTo(p2);
    const segP = new THREE.BoxGeometry(trimWidth, trimHeight, lenP);
    const midP = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    segP.lookAt(new THREE.Vector3().subVectors(p2, p1));
    segP.translate(midP.x, midP.y + 0.015, midP.z);
    trimSegments.push(segP);

    // Starboard sheer segment
    const s1 = new THREE.Vector3(stA.wSheerOut, stA.ySheerOut, stA.z);
    const s2 = new THREE.Vector3(stB.wSheerOut, stB.ySheerOut, stB.z);
    const lenS = s1.distanceTo(s2);
    const segS = new THREE.BoxGeometry(trimWidth, trimHeight, lenS);
    const midS = new THREE.Vector3().addVectors(s1, s2).multiplyScalar(0.5);
    segS.lookAt(new THREE.Vector3().subVectors(s2, s1));
    segS.translate(midS.x, midS.y + 0.015, midS.z);
    trimSegments.push(segS);
  }

  // Transom top trim beam
  const st0 = gheStations[0];
  const transomTrim = new THREE.BoxGeometry(st0.wSheerOut * 2 + 0.02, trimHeight, trimWidth);
  transomTrim.translate(0, st0.ySheerOut + 0.015, st0.z);
  trimSegments.push(transomTrim);

  // Bow cap trim
  const bowTrim = new THREE.BoxGeometry(0.08, 0.04, 0.08);
  bowTrim.translate(0, gSpecs.bowSheerY + 0.02, 1.20);
  trimSegments.push(bowTrim);

  const trimMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheRedTrim,
  });
  materialsToDispose.push(trimMat);

  trimSegments.forEach((geo) => {
    geometriesToDispose.push(geo);
    const m = new THREE.Mesh(geo, trimMat);
    m.castShadow = true;
    gheGroup.add(m);
  });

  // Transverse wooden thwarts / benches inside the open cockpit
  // Forward thwart at z = +0.35, y = +0.08m above DWL
  const thwartFwdGeo = new THREE.BoxGeometry(0.56, 0.035, 0.16);
  thwartFwdGeo.translate(0, gSpecs.thwartY, 0.35);
  geometriesToDispose.push(thwartFwdGeo);

  // Aft thwart at z = -0.45, y = +0.08m above DWL
  const thwartAftGeo = new THREE.BoxGeometry(0.58, 0.035, 0.16);
  thwartAftGeo.translate(0, gSpecs.thwartY, -0.45);
  geometriesToDispose.push(thwartAftGeo);

  const thwartMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.boats.gheWood,
  });
  materialsToDispose.push(thwartMat);

  const thwartFwd = new THREE.Mesh(thwartFwdGeo, thwartMat);
  thwartFwd.name = 'GheThwartFwd';
  thwartFwd.castShadow = true;
  gheGroup.add(thwartFwd);

  const thwartAft = new THREE.Mesh(thwartAftGeo, thwartMat);
  thwartAft.name = 'GheThwartAft';
  thwartAft.castShadow = true;
  gheGroup.add(thwartAft);

  // Wooden cockpit bottom floorboard
  const floorboardGeo = new THREE.BoxGeometry(0.28, 0.02, 1.45);
  floorboardGeo.translate(0, -0.12, -0.10);
  geometriesToDispose.push(floorboardGeo);
  const floorboard = new THREE.Mesh(floorboardGeo, thwartMat);
  floorboard.receiveShadow = true;
  gheGroup.add(floorboard);

  // Traditional painted boat eyes on port & starboard bow flare
  const eyeMatYellow = new THREE.MeshBasicMaterial({ color: PHUQUOC_COLORS.boats.gheYellowEye });
  const eyeMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeMatBlack = new THREE.MeshBasicMaterial({ color: 0x111111 });
  materialsToDispose.push(eyeMatYellow, eyeMatWhite, eyeMatBlack);

  [-1, 1].forEach((side) => {
    const eyeSclera = new THREE.BoxGeometry(0.015, 0.07, 0.11);
    eyeSclera.rotateY(side * 0.28);
    eyeSclera.translate(side * 0.18, 0.21, 0.96);
    geometriesToDispose.push(eyeSclera);
    gheGroup.add(new THREE.Mesh(eyeSclera, eyeMatWhite));

    const eyeIris = new THREE.BoxGeometry(0.018, 0.05, 0.06);
    eyeIris.rotateY(side * 0.28);
    eyeIris.translate(side * 0.182, 0.21, 0.96);
    geometriesToDispose.push(eyeIris);
    gheGroup.add(new THREE.Mesh(eyeIris, eyeMatYellow));

    const eyePupil = new THREE.BoxGeometry(0.020, 0.028, 0.032);
    eyePupil.rotateY(side * 0.28);
    eyePupil.translate(side * 0.184, 0.21, 0.965);
    geometriesToDispose.push(eyePupil);
    gheGroup.add(new THREE.Mesh(eyePupil, eyeMatBlack));
  });

  boatsGroup.add(gheGroup);

  // Inverse matrices for exact 3D water cavity discard
  const thungInvMatrix = new THREE.Matrix4();
  const gheInvMatrix = new THREE.Matrix4();

  const cavityState: BoatCavityState = {
    thungInvMatrix,
    gheInvMatrix,
  };

  return {
    group: boatsGroup,
    thungGroup,
    gheGroup,
    getCavities() {
      return cavityState;
    },
    update(dt: number, elapsed: number, waterLevel: number, windStrength: number, flowSpeed: number) {
      // 1. Thuyền Thúng: rides exact ocean wave elevation and slope at its world position
      const thungCfg = BOAT_SPOTS.thung;
      const thungWave = getOceanWaveElevation(thungCfg.x, thungCfg.z, elapsed, windStrength);
      const thungSlopes = getOceanWaveSlopes(thungCfg.x, thungCfg.z, elapsed, windStrength);

      // Subtle natural harmonic basket wobble
      const thungBobHarmonic = Math.sin(elapsed * 2.1 * flowSpeed) * 0.008 * windStrength;
      const thungPitch = thungSlopes.dSdz * 0.85 + Math.sin(elapsed * 1.9) * 0.02 * windStrength;
      const thungRoll = -thungSlopes.dSdx * 0.85 + Math.cos(elapsed * 1.7) * 0.02 * windStrength;
      const thungYaw = 0.4 + Math.sin(elapsed * 0.25) * 0.08;

      // Model origin y = 0 is DWL, so world Y is waterLevel + wave elevation
      thungGroup.position.set(thungCfg.x, waterLevel + thungWave + thungBobHarmonic, thungCfg.z);
      thungGroup.rotation.set(thungPitch, thungYaw, thungRoll);
      thungGroup.updateMatrix();
      thungGroup.updateMatrixWorld(true);
      thungInvMatrix.copy(thungGroup.matrixWorld).invert();

      // 2. Ghe Nhỏ: oriented skiff hull riding wave elevation and aligned pitch/roll
      const gheCfg = BOAT_SPOTS.ghe;
      const gheWave = getOceanWaveElevation(gheCfg.x, gheCfg.z, elapsed, windStrength);
      const gheSlopes = getOceanWaveSlopes(gheCfg.x, gheCfg.z, elapsed, windStrength);

      const gheYaw = -0.6 + Math.sin(elapsed * 0.22) * 0.06;
      // Project wave slopes along boat longitudinal axis (pitch) and transverse axis (roll)
      const sinYaw = Math.sin(gheYaw);
      const cosYaw = Math.cos(gheYaw);
      const waveLongitudinalSlope = gheSlopes.dSdx * sinYaw + gheSlopes.dSdz * cosYaw;
      const waveTransverseSlope = gheSlopes.dSdx * cosYaw - gheSlopes.dSdz * sinYaw;

      const gheBobHarmonic = Math.sin(elapsed * 1.8 * flowSpeed + 0.4) * 0.008 * windStrength;
      const ghePitch = -waveLongitudinalSlope * 0.80 + Math.sin(elapsed * 1.5) * 0.015 * windStrength;
      const gheRoll = waveTransverseSlope * 0.85 + Math.cos(elapsed * 1.6) * 0.02 * windStrength;

      gheGroup.position.set(gheCfg.x, waterLevel + gheWave + gheBobHarmonic, gheCfg.z);
      gheGroup.rotation.set(ghePitch, gheYaw, gheRoll);
      gheGroup.updateMatrix();
      gheGroup.updateMatrixWorld(true);
      gheInvMatrix.copy(gheGroup.matrixWorld).invert();
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      boatsGroup.clear();
      parentGroup.remove(boatsGroup);
    },
  };
}
