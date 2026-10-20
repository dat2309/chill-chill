import * as THREE from 'three';
import { COLORS, GLAMPING_CENTER_X, GLAMPING_CENTER_Z, Season } from './constants';
import { rng } from './noise';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export interface ArchitectureSystem {
  group: THREE.Group;
  emissiveMeshes: THREE.Mesh[];
  fireMesh: THREE.Mesh | null;
  update(dt: number, elapsed: number, timeOfDay: number): void;
  updateSeason(season: Season, t: number): void;
  dispose(): void;
}

function prepareGeometry(
  geo: THREE.BufferGeometry,
  color: THREE.Color | number | ((pos: THREE.Vector3, norm: THREE.Vector3, index: number) => THREE.Color)
): THREE.BufferGeometry {
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo.clone();
  delete nonIndexed.attributes.uv;
  if (!nonIndexed.attributes.normal) {
    nonIndexed.computeVertexNormals();
  }

  const count = nonIndexed.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const posAttr = nonIndexed.attributes.position;
  const normAttr = nonIndexed.attributes.normal;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  if (typeof color === 'function') {
    for (let i = 0; i < count; i++) {
      p.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      if (normAttr) n.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      const c = color(p, n, i);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
  } else {
    const c = color instanceof THREE.Color ? color : new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
  }

  nonIndexed.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return nonIndexed;
}

function createGeodesicDomeHemisphere(): { domeGeo: THREE.BufferGeometry; edgesGeo: THREE.BufferGeometry } {
  const baseIco = new THREE.IcosahedronGeometry(1.0, 2);
  const posAttr = baseIco.attributes.position;
  const positions: number[] = [];
  const colors: number[] = [];

  const tentBaseColor = COLORS.architecture.tent;
  const tentAltColor = new THREE.Color(0xeee5d6);
  const doorColor = new THREE.Color(0x35281e);

  const radius = 0.72;
  const height = 0.62;

  for (let i = 0; i < posAttr.count; i += 3) {
    const y0 = posAttr.getY(i);
    const y1 = posAttr.getY(i + 1);
    const y2 = posAttr.getY(i + 2);
    const cy = (y0 + y1 + y2) / 3;

    if (cy >= -0.05) {
      const cx = (posAttr.getX(i) + posAttr.getX(i + 1) + posAttr.getX(i + 2)) / 3;
      const cz = (posAttr.getZ(i) + posAttr.getZ(i + 1) + posAttr.getZ(i + 2)) / 3;

      const isDoor = cz > 0.45 && Math.abs(cx) < 0.28 && cy < 0.40;
      const triColor = isDoor ? doorColor : ((i / 3) % 2 === 0 ? tentBaseColor : tentAltColor);

      for (let v = 0; v < 3; v++) {
        const vx = posAttr.getX(i + v) * radius;
        const vy = Math.max(0, posAttr.getY(i + v)) * height;
        const vz = posAttr.getZ(i + v) * radius;

        positions.push(vx, vy, vz);
        colors.push(triColor.r, triColor.g, triColor.b);
      }
    }
  }

  const domeGeo = new THREE.BufferGeometry();
  domeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  domeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  domeGeo.computeVertexNormals();

  const edgesGeo = new THREE.EdgesGeometry(domeGeo, 1);
  return { domeGeo, edgesGeo };
}

export function createArchitecture(
  scene: THREE.Scene,
  getHeightAt: (x: number, z: number) => number
): ArchitectureSystem {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'architecture';

  const emissiveMeshes: THREE.Mesh[] = [];
  let fireMesh: THREE.Mesh | null = null;

  const woodGeometries: THREE.BufferGeometry[] = [];
  const stoneGeometries: THREE.BufferGeometry[] = [];
  const propGeometries: THREE.BufferGeometry[] = [];
  const snowGeometries: THREE.BufferGeometry[] = [];

  const woodMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.05,
    flatShading: true,
  });

  const stoneMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.05,
    flatShading: true,
  });

  const propMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.62,
    metalness: 0.05,
    flatShading: true,
  });

  const frameLineMaterial = new THREE.LineBasicMaterial({
    color: 0xb29f86, // sand-bronze delicate frame
    transparent: true,
    opacity: 0.55,
  });

  // 1. THREE GEODESIC DOME TENTS ON INDIVIDUAL WOODEN DECKS
  // Separated across the meadow with space and natural vegetation between them
  const domeConfigs = [
    { x: -4.8, z: -2.0, rotY: 0.15 }, // Dome 1 (Back left)
    { x: -1.9, z: -1.2, rotY: -0.20 }, // Dome 2 (Mid right)
    { x: -4.0, z: 0.15, rotY: 0.05 },   // Dome 3 (Front left)
  ];

  domeConfigs.forEach((cfg, idx) => {
    const groundY = getHeightAt(cfg.x, cfg.z);
    // Distinct compact individual platform for each dome
    const platformW = 1.72;
    const platformD = 1.72;
    const platformH = 0.09;
    const platformTopY = groundY + platformH;

    // Separate wooden planks
    const plankCount = 8;
    const plankW = (platformW - 0.03) / plankCount;
    for (let p = 0; p < plankCount; p++) {
      const plankGeo = new THREE.BoxGeometry(plankW - 0.015, platformH, platformD).toNonIndexed();
      const px = -platformW / 2 + 0.015 + (p + 0.5) * plankW;
      plankGeo.translate(cfg.x + px, groundY + platformH / 2, cfg.z);

      const baseCol = p % 2 === 0 ? COLORS.wood.plank.clone() : COLORS.wood.light.clone();
      woodGeometries.push(prepareGeometry(plankGeo, (_p, norm) => {
        return Math.abs(norm.x) > 0.8 ? COLORS.wood.dark : baseCol;
      }));
    }

    // Individual step at front (+Z direction)
    const stepGeo = new THREE.BoxGeometry(0.70, 0.05, 0.22).toNonIndexed();
    stepGeo.translate(cfg.x, groundY + 0.025, cfg.z + platformD / 2 + 0.11);
    woodGeometries.push(prepareGeometry(stepGeo, COLORS.wood.light));

    // Sturdy corner foundation posts firmly in ground
    const cornerOffsets = [
      [-0.76, -0.76],
      [0.76, -0.76],
      [-0.76, 0.76],
      [0.76, 0.76],
    ];
    cornerOffsets.forEach(([cx, cz]) => {
      const cornerGround = getHeightAt(cfg.x + cx, cfg.z + cz);
      const postH = Math.max(0.12, platformTopY - cornerGround + 0.12);
      const post = new THREE.BoxGeometry(0.09, postH, 0.09).toNonIndexed();
      post.translate(cfg.x + cx, platformTopY - postH / 2, cfg.z + cz);
      woodGeometries.push(prepareGeometry(post, COLORS.wood.dark));
    });

    // Geodesic Dome Mesh
    const { domeGeo, edgesGeo } = createGeodesicDomeHemisphere();

    const domeFabricMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color(0xff9a2e),
      emissiveIntensity: 0.0,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    const domeMesh = new THREE.Mesh(domeGeo, domeFabricMat);
    domeMesh.name = `domeTent_${idx}`;
    domeMesh.position.set(cfg.x, platformTopY, cfg.z);
    domeMesh.rotation.y = cfg.rotY;
    rootGroup.add(domeMesh);
    emissiveMeshes.push(domeMesh);

    const frameLines = new THREE.LineSegments(edgesGeo, frameLineMaterial);
    frameLines.position.set(cfg.x, platformTopY, cfg.z);
    frameLines.rotation.y = cfg.rotY;
    frameLines.scale.set(1.001, 1.001, 1.001);
    rootGroup.add(frameLines);

    // Winter snow cap on dome top
    const snowCapGeo = new THREE.IcosahedronGeometry(0.48, 1).toNonIndexed();
    const snowCapPos = snowCapGeo.attributes.position;
    for (let s = 0; s < snowCapPos.count; s++) {
      const sy = Math.max(0, snowCapPos.getY(s)) * 0.16;
      snowCapPos.setY(s, sy);
    }
    snowCapGeo.computeVertexNormals();
    snowCapGeo.translate(cfg.x, platformTopY + 0.60, cfg.z);
    snowGeometries.push(prepareGeometry(snowCapGeo, COLORS.terrain.snow));
  });

  // 2. A-FRAME CABIN WITH TEAL ROOF
  // Solidly placed in the back meadow at X = -1.0, Z = -2.5
  const cabinX = -1.0;
  const cabinZ = -2.5;
  const cabinGroundY = getHeightAt(cabinX, cabinZ);
  const cabinFloorH = 0.10;
  const cabinFloorY = cabinGroundY + cabinFloorH;

  const cabinW = 1.6;
  const cabinD = 2.0;
  const ridgeH = 1.35;
  const porchD = 0.7;
  const totalDeckD = cabinD + porchD;

  // Deck platform
  const cabinDeckGeo = new THREE.BoxGeometry(cabinW + 0.25, cabinFloorH, totalDeckD).toNonIndexed();
  cabinDeckGeo.translate(cabinX, cabinGroundY + cabinFloorH / 2, cabinZ + porchD / 2);
  woodGeometries.push(prepareGeometry(cabinDeckGeo, (_p, norm) => {
    return Math.abs(norm.y) > 0.8 ? COLORS.wood.plank : COLORS.wood.dark;
  }));

  // Deck posts into ground
  const cabinPostOffsets = [
    [-(cabinW + 0.1) / 2, -cabinD / 2],
    [(cabinW + 0.1) / 2, -cabinD / 2],
    [-(cabinW + 0.1) / 2, cabinD / 2 + porchD],
    [(cabinW + 0.1) / 2, cabinD / 2 + porchD],
  ];
  cabinPostOffsets.forEach(([cx, cz]) => {
    const cgY = getHeightAt(cabinX + cx, cabinZ + cz);
    const stiltH = Math.max(0.12, cabinFloorY - cgY + 0.12);
    const post = new THREE.BoxGeometry(0.12, stiltH, 0.12).toNonIndexed();
    post.translate(cabinX + cx, cabinFloorY - stiltH / 2, cabinZ + cz);
    woodGeometries.push(prepareGeometry(post, COLORS.wood.dark));
  });

  // Porch step
  const cabinStep = new THREE.BoxGeometry(0.9, 0.05, 0.28).toNonIndexed();
  cabinStep.translate(cabinX, cabinGroundY + 0.025, cabinZ + cabinD / 2 + porchD + 0.14);
  woodGeometries.push(prepareGeometry(cabinStep, COLORS.wood.light));

  // Solid skirting under deck so no light gaps under cabin
  const cabinSkirt = new THREE.BoxGeometry(cabinW + 0.16, 0.22, totalDeckD - 0.08).toNonIndexed();
  cabinSkirt.translate(cabinX, cabinGroundY, cabinZ + porchD / 2);
  woodGeometries.push(prepareGeometry(cabinSkirt, COLORS.wood.dark));

  // Front porch railing posts
  const porchPostL = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6).toNonIndexed();
  porchPostL.translate(cabinX - cabinW / 2 + 0.06, cabinFloorY + 0.4, cabinZ + cabinD / 2 + porchD - 0.06);
  woodGeometries.push(prepareGeometry(porchPostL, COLORS.wood.dark));

  const porchPostR = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6).toNonIndexed();
  porchPostR.translate(cabinX + cabinW / 2 - 0.06, cabinFloorY + 0.4, cabinZ + cabinD / 2 + porchD - 0.06);
  woodGeometries.push(prepareGeometry(porchPostR, COLORS.wood.dark));

  // Triangular End Walls (front & back) - Warm Cedar Wood
  const wallPositions: number[] = [];
  const wallColors: number[] = [];
  const cedarWood = new THREE.Color(0x78532f);

  function addTriWall(zVal: number, facingSign: number): void {
    const halfW = cabinW / 2;
    const pL = new THREE.Vector3(cabinX - halfW, cabinFloorY, cabinZ + zVal);
    const pR = new THREE.Vector3(cabinX + halfW, cabinFloorY, cabinZ + zVal);
    const pTop = new THREE.Vector3(cabinX, cabinFloorY + ridgeH, cabinZ + zVal);

    const verts = facingSign > 0 ? [pL, pR, pTop] : [pL, pTop, pR];
    verts.forEach((v) => {
      wallPositions.push(v.x, v.y, v.z);
      wallColors.push(cedarWood.r, cedarWood.g, cedarWood.b);
    });
  }

  addTriWall(-cabinD / 2, -1);
  addTriWall(cabinD / 2, 1);

  const triWallGeo = new THREE.BufferGeometry();
  triWallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
  triWallGeo.setAttribute('color', new THREE.Float32BufferAttribute(wallColors, 3));
  triWallGeo.computeVertexNormals();
  woodGeometries.push(triWallGeo);

  // Front Door
  const doorGeo = new THREE.BoxGeometry(0.48, 0.78, 0.04).toNonIndexed();
  doorGeo.translate(cabinX, cabinFloorY + 0.39, cabinZ + cabinD / 2 + 0.02);
  woodGeometries.push(prepareGeometry(doorGeo, new THREE.Color(0x3e2c1e)));

  // Upper Triangular Glass Window with warm glow
  const windowGeo = new THREE.PlaneGeometry(0.38, 0.38).toNonIndexed();
  windowGeo.translate(cabinX, cabinFloorY + 0.95, cabinZ + cabinD / 2 + 0.025);
  const windowMat = new THREE.MeshStandardMaterial({
    color: COLORS.architecture.windowGlow,
    emissive: COLORS.architecture.windowGlow,
    emissiveIntensity: 0.15,
    roughness: 0.3,
  });
  const windowMesh = new THREE.Mesh(windowGeo, windowMat);
  rootGroup.add(windowMesh);
  emissiveMeshes.push(windowMesh);

  // Sloped A-Frame Vivid Teal Roof
  const cabinTeal = new THREE.Color(0x1e8c7c);
  const roofThickness = 0.06;
  const slopeLen = Math.hypot(cabinW / 2, ridgeH) + 0.22;
  const roofAngle = Math.atan2(ridgeH, cabinW / 2);
  const roofD = cabinD + 0.35;

  // Left roof slope
  const roofL = new THREE.BoxGeometry(slopeLen, roofThickness, roofD).toNonIndexed();
  roofL.rotateZ(roofAngle);
  roofL.translate(cabinX - cabinW / 4, cabinFloorY + ridgeH / 2, cabinZ);
  propGeometries.push(prepareGeometry(roofL, cabinTeal));

  // Right roof slope
  const roofR = new THREE.BoxGeometry(slopeLen, roofThickness, roofD).toNonIndexed();
  roofR.rotateZ(-roofAngle);
  roofR.translate(cabinX + cabinW / 4, cabinFloorY + ridgeH / 2, cabinZ);
  propGeometries.push(prepareGeometry(roofR, cabinTeal));

  // Roof ridge beam
  const ridgeBeam = new THREE.BoxGeometry(0.08, 0.08, roofD + 0.06).toNonIndexed();
  ridgeBeam.translate(cabinX, cabinFloorY + ridgeH + 0.04, cabinZ);
  woodGeometries.push(prepareGeometry(ridgeBeam, COLORS.wood.dark));

  // Winter snow on roof slopes
  const snowRoofL = new THREE.BoxGeometry(slopeLen - 0.06, 0.03, roofD - 0.06).toNonIndexed();
  snowRoofL.rotateZ(roofAngle);
  snowRoofL.translate(cabinX - cabinW / 4, cabinFloorY + ridgeH / 2 + 0.035, cabinZ);
  snowGeometries.push(prepareGeometry(snowRoofL, COLORS.terrain.snow));

  const snowRoofR = new THREE.BoxGeometry(slopeLen - 0.06, 0.03, roofD - 0.06).toNonIndexed();
  snowRoofR.rotateZ(-roofAngle);
  snowRoofR.translate(cabinX + cabinW / 4, cabinFloorY + ridgeH / 2 + 0.035, cabinZ);
  snowGeometries.push(prepareGeometry(snowRoofR, COLORS.terrain.snow));

  // 3. CAMPFIRE CIRCLE IN CENTRAL MEADOW
  const fireX = -3.2;
  const fireZ = -0.8;
  const fireGroundY = getHeightAt(fireX, fireZ);

  // Stone ring
  const numFireStones = 8;
  const ringRadius = 0.40;
  for (let s = 0; s < numFireStones; s++) {
    const angle = (s / numFireStones) * Math.PI * 2;
    const stoneGeo = new THREE.DodecahedronGeometry(0.09, 1).toNonIndexed();
    stoneGeo.scale(1.0, 0.65, 1.0);
    stoneGeo.translate(fireX + Math.cos(angle) * ringRadius, fireGroundY + 0.05, fireZ + Math.sin(angle) * ringRadius);
    stoneGeometries.push(prepareGeometry(stoneGeo, COLORS.terrain.rockDark));
  }

  // Charred logs
  for (let l = 0; l < 4; l++) {
    const logGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.38, 6).toNonIndexed();
    logGeo.rotateZ(0.35);
    logGeo.rotateY((l / 4) * Math.PI * 2);
    logGeo.translate(fireX, fireGroundY + 0.06, fireZ);
    woodGeometries.push(prepareGeometry(logGeo, new THREE.Color(0x281e14)));
  }

  // Animated flame cones
  const flameGeo1 = new THREE.ConeGeometry(0.12, 0.35, 6);
  flameGeo1.translate(0, 0.175, 0);
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff4400,
    emissiveIntensity: 1.0,
    roughness: 0.2,
  });
  fireMesh = new THREE.Mesh(flameGeo1, flameMat);
  fireMesh.position.set(fireX, fireGroundY + 0.05, fireZ);
  rootGroup.add(fireMesh);

  // 4. ARCHERY TARGET ON TRIPOD
  const targetX = -6.0;
  const targetZ = -2.5;
  const targetGroundY = getHeightAt(targetX, targetZ);
  const targetCenterY = targetGroundY + 0.75;
  const targetParts: THREE.BufferGeometry[] = [];

  const targetBody = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20).toNonIndexed();
  targetBody.rotateX(Math.PI / 2);
  targetBody.translate(0, 0, -0.04);
  targetParts.push(prepareGeometry(targetBody, new THREE.Color(0xb89255)));

  const ringDefs = [
    { rIn: 0.0, rOut: 0.08, color: 0xffd54f }, // Yellow
    { rIn: 0.08, rOut: 0.16, color: 0xd32f2f }, // Red
    { rIn: 0.16, rOut: 0.24, color: 0x1976d2 }, // Blue
    { rIn: 0.24, rOut: 0.32, color: 0x222222 }, // Black
    { rIn: 0.32, rOut: 0.40, color: 0xf2f2f2 }, // White
  ];

  ringDefs.forEach(({ rIn, rOut, color }) => {
    const rGeo = rIn === 0.0
      ? new THREE.CircleGeometry(rOut, 20).toNonIndexed()
      : new THREE.RingGeometry(rIn, rOut, 20).toNonIndexed();
    rGeo.translate(0, 0, 0.002);
    targetParts.push(prepareGeometry(rGeo, color));
  });

  // Arrow
  const arrowShaft = new THREE.CylinderGeometry(0.008, 0.008, 0.42, 6).toNonIndexed();
  arrowShaft.rotateX(Math.PI / 2 + 0.08);
  arrowShaft.translate(0.04, 0.03, 0.18);
  targetParts.push(prepareGeometry(arrowShaft, COLORS.wood.light));

  // Stand legs
  const leg1 = new THREE.CylinderGeometry(0.025, 0.025, 1.25, 6).toNonIndexed();
  leg1.rotateZ(0.24);
  leg1.translate(-0.25, -0.22, -0.15);
  targetParts.push(prepareGeometry(leg1, COLORS.wood.dark));

  const leg2 = new THREE.CylinderGeometry(0.025, 0.025, 1.25, 6).toNonIndexed();
  leg2.rotateZ(-0.24);
  leg2.translate(0.25, -0.22, -0.15);
  targetParts.push(prepareGeometry(leg2, COLORS.wood.dark));

  const legBack = new THREE.CylinderGeometry(0.025, 0.025, 1.25, 6).toNonIndexed();
  legBack.rotateX(-0.4);
  legBack.translate(0, -0.22, -0.38);
  targetParts.push(prepareGeometry(legBack, COLORS.wood.dark));

  const mergedTarget = BufferGeometryUtils.mergeGeometries(targetParts, false);
  if (mergedTarget) {
    mergedTarget.rotateY(0.45);
    mergedTarget.translate(targetX, targetCenterY, targetZ);
    propGeometries.push(mergedTarget);
  }

  // 5. PICNIC TABLE WITH BENCHES
  const tableX = -6.2;
  const tableZ = -0.5;
  const tableGroundY = getHeightAt(tableX, tableZ);
  const tableTopH = 0.62;
  const tableW = 1.25;
  const tableD = 0.60;

  // Tabletop slats
  for (let tp = 0; tp < 3; tp++) {
    const tz = -tableD / 2 + 0.10 + tp * 0.20;
    const tPlank = new THREE.BoxGeometry(tableW, 0.045, 0.18).toNonIndexed();
    tPlank.translate(tableX, tableGroundY + tableTopH, tableZ + tz);
    woodGeometries.push(prepareGeometry(tPlank, COLORS.wood.plank));
  }

  // Benches
  [-0.45, 0.45].forEach((bz) => {
    const bench = new THREE.BoxGeometry(tableW, 0.045, 0.22).toNonIndexed();
    bench.translate(tableX, tableGroundY + 0.36, tableZ + bz);
    woodGeometries.push(prepareGeometry(bench, COLORS.wood.plank));
  });

  // Table legs
  const legA = new THREE.BoxGeometry(0.05, 0.62, 0.05).toNonIndexed();
  legA.translate(tableX - 0.45, tableGroundY + 0.31, tableZ);
  woodGeometries.push(prepareGeometry(legA, COLORS.wood.dark));

  const legB = new THREE.BoxGeometry(0.05, 0.62, 0.05).toNonIndexed();
  legB.translate(tableX + 0.45, tableGroundY + 0.31, tableZ);
  woodGeometries.push(prepareGeometry(legB, COLORS.wood.dark));

  // 6. CLIFFSIDE STONE STAIRCASES WITH LANDING (CHIẾU NGHỈ)
  // Hugs the bedrock cliff naturally without floating gaps or steep ramps
  interface StairFlightDef {
    startX: number;
    startZ: number;
    endX: number;
    endZ: number;
    steps: number;
    width: number;
  }

  const stairFlights: StairFlightDef[] = [
    // Flight 1: Upper cliff descent from campsite meadow down to intermediate landing
    { startX: -3.5, startZ: 0.85, endX: -3.0, endZ: 1.55, steps: 8, width: 0.90 },
    // Flight 2: Lower cliff descent from intermediate landing down to pebble bank (lands on dry pebble shore)
    { startX: -2.85, startZ: 1.70, endX: -2.35, endZ: 2.45, steps: 8, width: 0.90 },
    // Right Bank Gentle Trail: descends along dry gravel slope to a stone overlook landing above water
    { startX: 3.4, startZ: 0.30, endX: 3.9, endZ: 1.55, steps: 7, width: 0.80 },
  ];

  stairFlights.forEach((flight) => {
    for (let i = 0; i < flight.steps; i++) {
      const t = i / Math.max(1, flight.steps - 1);
      const sx = THREE.MathUtils.lerp(flight.startX, flight.endX, t);
      const sz = THREE.MathUtils.lerp(flight.startZ, flight.endZ, t);

      // Bedrock ground at this exact point
      const bedY = getHeightAt(sx, sz);
      const stepH = 0.12;
      const stepD = 0.32;
      const stepTreadY = bedY + 0.05;
      const foundationH = 0.22;

      // Solid stone step firmly embedded in terrain
      const stepGeo = new THREE.BoxGeometry(flight.width, foundationH, stepD).toNonIndexed();
      stepGeo.translate(sx, stepTreadY - foundationH / 2 + stepH / 2, sz);
      stoneGeometries.push(prepareGeometry(stepGeo, COLORS.terrain.rock));

      // Flanking stone curb blocks
      [-flight.width / 2 - 0.05, flight.width / 2 + 0.05].forEach((cx) => {
        const curb = new THREE.BoxGeometry(0.12, foundationH + 0.10, stepD).toNonIndexed();
        curb.translate(sx + cx, stepTreadY - foundationH / 2 + stepH / 2 + 0.05, sz);
        stoneGeometries.push(prepareGeometry(curb, COLORS.terrain.rockDark));
      });

      // Winter snow cap on step tread
      const stepSnow = new THREE.BoxGeometry(flight.width - 0.04, 0.02, stepD - 0.04).toNonIndexed();
      stepSnow.translate(sx, stepTreadY + stepH / 2 + 0.01, sz);
      snowGeometries.push(prepareGeometry(stepSnow, COLORS.terrain.snow));
    }
  });

  // Intermediate Landing Terrace (Chiếu nghỉ) between Flight 1 and Flight 2
  const landingX = -2.92;
  const landingZ = 1.62;
  const landingBedY = getHeightAt(landingX, landingZ);
  const landingTerraceH = 0.24;
  const landingGeo = new THREE.BoxGeometry(1.15, landingTerraceH, 1.05).toNonIndexed();
  landingGeo.translate(landingX, landingBedY + 0.05 - landingTerraceH / 2 + 0.06, landingZ);
  stoneGeometries.push(prepareGeometry(landingGeo, COLORS.terrain.rock));

  // Stone curbs around intermediate landing edge
  const landingCurbs = [
    { x: landingX - 0.58, z: landingZ, w: 0.12, d: 1.05 },
    { x: landingX, z: landingZ + 0.53, w: 1.15, d: 0.12 },
  ];
  landingCurbs.forEach((c) => {
    const cGeo = new THREE.BoxGeometry(c.w, landingTerraceH + 0.10, c.d).toNonIndexed();
    cGeo.translate(c.x, landingBedY + 0.05 - landingTerraceH / 2 + 0.11, c.z);
    stoneGeometries.push(prepareGeometry(cGeo, COLORS.terrain.rockDark));
  });

  // Right Bank Overlook Terrace (dry stone landing platform safely above water)
  const rLandingX = 4.0;
  const rLandingZ = 1.70;
  const rLandingBedY = getHeightAt(rLandingX, rLandingZ);
  const rLandingGeo = new THREE.BoxGeometry(1.10, 0.20, 0.95).toNonIndexed();
  rLandingGeo.translate(rLandingX, rLandingBedY + 0.04, rLandingZ);
  stoneGeometries.push(prepareGeometry(rLandingGeo, COLORS.terrain.rock));

  // Natural Flagstone Stepping Stones connecting campsite to stairs and stairs to water
  const flagstoneSpots = [
    // Connecting Dome 1 to Campfire
    { x: -4.4, z: -1.6 },
    { x: -4.0, z: -1.3 },
    { x: -3.6, z: -1.1 },
    // Connecting Dome 2 to Campfire
    { x: -2.4, z: -1.0 },
    { x: -2.8, z: -0.9 },
    // Connecting Dome 3 to Campfire
    { x: -3.9, z: -0.3 },
    { x: -3.6, z: -0.6 },
    // Connecting Cabin porch to Campfire
    { x: -1.5, z: -2.1 },
    { x: -2.0, z: -1.7 },
    { x: -2.6, z: -1.3 },
    // Path from Campfire towards Cliff Stairs
    { x: -3.3, z: -0.5 },
    { x: -3.4, z: -0.1 },
    { x: -3.5, z: 0.35 },
    { x: -3.5, z: 0.70 },
    // Path from Dome 1 towards Picnic Table
    { x: -5.2, z: -1.5 },
    { x: -5.6, z: -1.1 },
    { x: -5.9, z: -0.8 },
    // Pebble bank path from lower stairs to water edge
    { x: -2.0, z: 2.7 },
    { x: -1.7, z: 3.1 },
    { x: -1.3, z: 3.6 },
    { x: -0.9, z: 4.0 },
    // Right bank path connecting overlook terrace to beach
    { x: 4.2, z: 2.2 },
    { x: 4.5, z: 2.7 },
    { x: 4.8, z: 3.3 },
  ];
  flagstoneSpots.forEach((fp) => {
    const fY = getHeightAt(fp.x, fp.z);
    const fGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.05, 7).toNonIndexed();
    fGeo.translate(fp.x, fY + 0.025, fp.z);
    stoneGeometries.push(prepareGeometry(fGeo, COLORS.terrain.rockDark));
  });

  // 7. SUP BOARD AND ACCESSORIES ON PEBBLE BANK
  // Beached naturally on dry gravel shore at water margin (X = 5.0, Z = 4.2)
  const supX = 5.05;
  const supZ = 4.15;
  const supGroundY = getHeightAt(supX, supZ);

  // SUP Hull with tapered bow & stern
  const supLen = 1.95;
  const supWidth = 0.52;
  const supBoard = new THREE.BoxGeometry(supWidth, 0.075, supLen).toNonIndexed();
  const bPos = supBoard.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const zL = bPos.getZ(i);
    const taper = 1.0 - Math.pow(Math.abs(zL) / (supLen * 0.5), 3.0) * 0.32;
    bPos.setX(i, bPos.getX(i) * taper);
  }
  supBoard.computeVertexNormals();
  supBoard.rotateY(-0.42);
  supBoard.rotateZ(0.08); // Gently tilted resting along pebble slope
  supBoard.translate(supX, supGroundY + 0.05, supZ);
  propGeometries.push(prepareGeometry(supBoard, new THREE.Color(0xf9c74f))); // Bright sunny yellow SUP

  // Grip Pad on SUP
  const gripPad = new THREE.BoxGeometry(supWidth * 0.70, 0.01, supLen * 0.62).toNonIndexed();
  gripPad.rotateY(-0.42);
  gripPad.rotateZ(0.08);
  gripPad.translate(supX, supGroundY + 0.088, supZ);
  propGeometries.push(prepareGeometry(gripPad, new THREE.Color(0x18484e))); // Alpine dark teal grip

  // Bungee deck cords across the yellow nose
  [-0.60, -0.48, -0.36].forEach((bz) => {
    const cord = new THREE.BoxGeometry(supWidth * 0.45, 0.012, 0.02).toNonIndexed();
    cord.rotateY(-0.42);
    cord.rotateZ(0.08);
    cord.translate(supX + Math.sin(0.42) * bz, supGroundY + 0.088, supZ + Math.cos(0.42) * bz);
    propGeometries.push(prepareGeometry(cord, new THREE.Color(0x222222)));
  });

  // Paddle with T-grip handle
  const padGroundY = getHeightAt(supX + 0.42, supZ - 0.28);
  const paddleShaft = new THREE.CylinderGeometry(0.012, 0.012, 1.45, 6).toNonIndexed();
  paddleShaft.rotateZ(Math.PI / 2 - 0.12);
  paddleShaft.translate(supX + 0.42, padGroundY + 0.03, supZ - 0.28);
  propGeometries.push(prepareGeometry(paddleShaft, COLORS.wood.dark));

  const paddleBlade = new THREE.BoxGeometry(0.15, 0.01, 0.34).toNonIndexed();
  paddleBlade.rotateY(-0.12);
  paddleBlade.translate(supX + 1.10, padGroundY + 0.025, supZ - 0.18);
  propGeometries.push(prepareGeometry(paddleBlade, new THREE.Color(0xf9c74f)));

  // Ergonomic Life Vest (Áo phao) with twin chest foam pads and buckle straps
  const vestGroundY = getHeightAt(supX + 0.45, supZ + 0.45);
  // Left chest pad
  const vestLeft = new THREE.BoxGeometry(0.13, 0.09, 0.32).toNonIndexed();
  vestLeft.rotateY(0.35);
  vestLeft.translate(supX + 0.38, vestGroundY + 0.05, supZ + 0.42);
  propGeometries.push(prepareGeometry(vestLeft, new THREE.Color(0xf4511e)));

  // Right chest pad
  const vestRight = new THREE.BoxGeometry(0.13, 0.09, 0.32).toNonIndexed();
  vestRight.rotateY(0.35);
  vestRight.translate(supX + 0.52, vestGroundY + 0.05, supZ + 0.48);
  propGeometries.push(prepareGeometry(vestRight, new THREE.Color(0xf4511e)));

  // Webbing buckle straps across vest
  [-0.08, 0.08].forEach((sz) => {
    const strap = new THREE.BoxGeometry(0.26, 0.018, 0.035).toNonIndexed();
    strap.rotateY(0.35);
    strap.translate(supX + 0.45, vestGroundY + 0.095, supZ + 0.45 + sz);
    propGeometries.push(prepareGeometry(strap, new THREE.Color(0x222222)));
  });

  // Wicker Picnic Basket with lid and handle
  const basketGroundY = getHeightAt(supX + 0.50, supZ + 0.90);
  const basket = new THREE.BoxGeometry(0.28, 0.18, 0.22).toNonIndexed();
  basket.rotateY(-0.20);
  basket.translate(supX + 0.50, basketGroundY + 0.09, supZ + 0.90);
  propGeometries.push(prepareGeometry(basket, new THREE.Color(0xb2834e)));

  const basketHandle = new THREE.CylinderGeometry(0.012, 0.012, 0.26, 6).toNonIndexed();
  basketHandle.rotateX(Math.PI / 2);
  basketHandle.translate(supX + 0.50, basketGroundY + 0.20, supZ + 0.90);
  propGeometries.push(prepareGeometry(basketHandle, new THREE.Color(0x8d6232)));

  // Canvas Dry Bag / Tote
  const toteGroundY = getHeightAt(supX + 0.25, supZ + 0.85);
  const dryBag = new THREE.CylinderGeometry(0.09, 0.09, 0.24, 8).toNonIndexed();
  dryBag.rotateZ(0.15);
  dryBag.translate(supX + 0.25, toteGroundY + 0.12, supZ + 0.85);
  propGeometries.push(prepareGeometry(dryBag, new THREE.Color(0xdcd4c4)));

  // Merge static geometries
  const mergedWood = BufferGeometryUtils.mergeGeometries(woodGeometries, false);
  if (mergedWood) rootGroup.add(new THREE.Mesh(mergedWood, woodMaterial));

  const mergedStone = BufferGeometryUtils.mergeGeometries(stoneGeometries, false);
  if (mergedStone) rootGroup.add(new THREE.Mesh(mergedStone, stoneMaterial));

  const mergedProp = BufferGeometryUtils.mergeGeometries(propGeometries, false);
  if (mergedProp) rootGroup.add(new THREE.Mesh(mergedProp, propMaterial));

  const mergedSnow = BufferGeometryUtils.mergeGeometries(snowGeometries, false);
  let snowMesh: THREE.Mesh | null = null;
  if (mergedSnow) {
    const snowMat = new THREE.MeshStandardMaterial({
      color: COLORS.terrain.snow,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.0,
    });
    snowMesh = new THREE.Mesh(mergedSnow, snowMat);
    rootGroup.add(snowMesh);
  }

  scene.add(rootGroup);

  function update(dt: number, elapsed: number, timeOfDay: number): void {
    if (fireMesh) {
      const flicker = 1.0 + Math.sin(elapsed * 12.0) * 0.08 + Math.cos(elapsed * 18.0) * 0.05;
      fireMesh.scale.set(flicker, flicker * 1.1, flicker);
      fireMesh.rotation.y = elapsed * 2.0;
    }
  }

  function updateSeason(season: Season, t: number): void {
    if (snowMesh) {
      const targetOpacity = season === 'winter' ? 0.95 : 0.0;
      const mat = snowMesh.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, t);
      snowMesh.visible = mat.opacity > 0.01;
    }
  }

  return {
    group: rootGroup,
    emissiveMeshes,
    fireMesh,
    update,
    updateSeason,
    dispose() {
      woodMaterial.dispose();
      stoneMaterial.dispose();
      propMaterial.dispose();
      frameLineMaterial.dispose();
      rootGroup.removeFromParent();
    },
  };
}
