import * as THREE from 'three';
import { createBranchCrown } from '../../core/branchCrown';
import { createVegetationWeather } from '../../core/vegetationWeather';
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
  update(dt: number, elapsed: number, windStrength: number, snow?: number, seasonWeights?: Record<Season, number>): void;
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
  const pineCrowns=[0,1,2].map(variant=>createBranchCrown(false,variant));
  const pineTrunkGeom=pineCrowns[0].wood,pineNeedlesGeom=pineCrowns[0].foliage;

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
    flatShading: false, vertexColors:true, side:THREE.DoubleSide, // Real folded needle sprays with open gaps.
  });

  const pineCount = 26;
  const maxPineLayers = 5; // Retain the seeded placement sequence from the previous scene.
  const pineTrunkMesh = new THREE.InstancedMesh(pineTrunkGeom, pineTrunkMat, pineCount);
  const pineFoliageMesh = new THREE.InstancedMesh(pineNeedlesGeom, pineFoliageMat, pineCount);
  pineTrunkMesh.castShadow = true;
  pineFoliageMesh.castShadow = true;
  pineFoliageMesh.receiveShadow = true;
  pineTrunkMesh.name='PineTrunks';
  group.add(pineTrunkMesh);
  pineFoliageMesh.name='PineFoliage';
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

  const pineBatches=[{wood:pineTrunkMesh,leaves:pineFoliageMesh,trees:[] as PineInstance[]}];
  for(let variant=1;variant<3;variant++){
    const wood=new THREE.InstancedMesh(pineCrowns[variant].wood,pineTrunkMat,pineCount),leaves=new THREE.InstancedMesh(pineCrowns[variant].foliage,pineFoliageMat,pineCount);
    wood.name=`PineTrunks_${variant}`;leaves.name=`PineFoliage_${variant}`;wood.castShadow=true;leaves.castShadow=true;leaves.receiveShadow=true;group.add(wood,leaves);pineBatches.push({wood,leaves,trees:[]});
  }
  for(let i=0;i<pineInstances.length;i++){
    const p=pineInstances[i],batch=pineBatches[i%3],index=batch.trees.length;
    const tiltX=vRng.range(-.06,.06),yaw=vRng.range(0,Math.PI*2),tiltZ=vRng.range(-.06,.06);
    dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(tiltX,yaw,tiltZ);dummy.scale.set(p.r,p.h,p.r*(.87+.11*(i%3)));dummy.updateMatrix();
    batch.wood.setMatrixAt(index,dummy.matrix);batch.leaves.setMatrixAt(index,dummy.matrix);batch.leaves.setColorAt(index,p.tint);batch.trees.push(p);
    for(let l=0;l<maxPineLayers;l++)if(l<p.layers)vRng.range(0,Math.PI*2);
  }
  for(const batch of pineBatches){batch.wood.count=batch.trees.length;batch.leaves.count=batch.trees.length;batch.wood.instanceMatrix.needsUpdate=true;batch.leaves.instanceMatrix.needsUpdate=true;if(batch.leaves.instanceColor)batch.leaves.instanceColor.needsUpdate=true;}

  // 2. Deciduous shade trees with tapered wood and open leaf-bearing twigs.
  const decTrunkGeom = new THREE.CylinderGeometry(0.025, 0.14, 1.0, 7, 6);
  decTrunkGeom.translate(0, 0.5, 0);

  const decBranchGeom = new THREE.CylinderGeometry(0.035, 0.065, 0.55, 6, 4);
  decBranchGeom.translate(0, 0.27, 0);

  // Individual folded leaf blades on an open, elongated cluster, not a solid cloud sphere.
  const leafRng=new SeededRandom(2411),leafPositions:number[]=[],leafIndices:number[]=[];
  for(let leaf=0;leaf<16;leaf++){
    const center=new THREE.Vector3(leafRng.range(-.65,.65),leafRng.range(-.55,.55),leafRng.range(-.80,.80));
    const yaw=leafRng.range(0,Math.PI*2),pitch=leafRng.range(-.8,.8);
    const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,leafRng.range(-.5,.5)));
    const length=leafRng.range(.26,.45),width=leafRng.range(.10,.18),start=leafPositions.length/3;
    for(const v of [new THREE.Vector3(0,0,-length/2),new THREE.Vector3(-width/2,0,0),new THREE.Vector3(0,.025,0),new THREE.Vector3(width/2,0,0),new THREE.Vector3(0,0,length/2)]){
      v.applyQuaternion(q).add(center);leafPositions.push(v.x,v.y,v.z);
    }
    leafIndices.push(start,start+1,start+2,start,start+2,start+3,start+1,start+4,start+2,start+2,start+4,start+3);
    const leafBase=new THREE.Vector3(0,0,-length/2).applyQuaternion(q).add(center);
    const petiole=new THREE.CylinderGeometry(.006,.007,leafBase.length(),3,1);
    petiole.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),leafBase.clone().normalize()));petiole.translate(leafBase.x/2,leafBase.y/2,leafBase.z/2);
    const pp=petiole.getAttribute('position'),pi=petiole.index!,offset=leafPositions.length/3;
    leafPositions.push(...pp.array);for(let j=0;j<pi.count;j++)leafIndices.push(offset+pi.getX(j));petiole.dispose();
  }
  const decCanopyGeom=new THREE.BufferGeometry();decCanopyGeom.setAttribute('position',new THREE.Float32BufferAttribute(leafPositions,3));decCanopyGeom.setIndex(leafIndices);decCanopyGeom.computeVertexNormals();

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
    side: THREE.DoubleSide, // Each leaf blade is a real thin botanical surface.
  });

  const decTreeCount = 13;
  const blobsPerTree = 11; // Leaf clusters distributed around the woody branch hierarchy.
  const branchesPerTree = 4;
  const decTrunkMesh = new THREE.InstancedMesh(decTrunkGeom, decTrunkMat, decTreeCount);
  const decBranchMesh = new THREE.InstancedMesh(decBranchGeom, decTrunkMat, decTreeCount * branchesPerTree);
  const twigGeom=new THREE.CylinderGeometry(.009,.018,1,5,3);twigGeom.translate(0,.5,0);
  const twigMesh=new THREE.InstancedMesh(twigGeom,decTrunkMat,decTreeCount*blobsPerTree);twigMesh.name='DeciduousTwigs';twigMesh.castShadow=true;group.add(twigMesh);
  const decCanopyMesh = new THREE.InstancedMesh(decCanopyGeom, decCanopyMat, decTreeCount * blobsPerTree);
  decTrunkMesh.castShadow = true;
  decBranchMesh.castShadow = true;
  decCanopyMesh.castShadow = true;
  decCanopyMesh.receiveShadow = true;
  decTrunkMesh.name='DeciduousTrunks';
  group.add(decTrunkMesh);
  decBranchMesh.name='DeciduousBranches';
  group.add(decBranchMesh);
  decCanopyMesh.name='DeciduousLeaves';
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
  const mainEndpoints:THREE.Vector3[][]=[];
  const branchAxis=new THREE.Vector3(0,1,0);
  let branchIdx = 0;
  for (let i = 0; i < decTrees.length; i++) {
    const t = decTrees[i];
    dummy.position.set(t.x, t.y, t.z);
    dummy.rotation.set(vRng.range(-0.04, 0.04), vRng.range(0, Math.PI * 2), vRng.range(-0.04, 0.04));
    dummy.scale.set(1.0, t.h, 1.0);
    dummy.updateMatrix();
    dummy.rotation.x=0;dummy.rotation.z=0;dummy.updateMatrix();
    decTrunkMesh.setMatrixAt(i, dummy.matrix);

    mainEndpoints.push([]);
    // Four supporting limbs, each attached to the trunk.
    const bAngles = [0.35, 1.85, 3.45, 5.05];
    for (let b = 0; b < branchesPerTree; b++) {
      const ang = bAngles[b] + vRng.range(-0.15, 0.15);
      const start=new THREE.Vector3(t.x,t.y+t.h*.60,t.z);
      const end=new THREE.Vector3(t.x+Math.cos(ang)*t.r*.45,t.y+t.h*.92,t.z+Math.sin(ang)*t.r*.45);
      mainEndpoints[i].push(end);
      dummy.position.copy(start);dummy.quaternion.setFromUnitVectors(branchAxis,end.clone().sub(start).normalize());
      dummy.scale.set(1,start.distanceTo(end)/.55,1);dummy.updateMatrix();
      decBranchMesh.setMatrixAt(branchIdx++, dummy.matrix);
    }

    // Eleven open leaf clusters attached to the nearest main limb.
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
      const endpoint=dummy.position.clone();
      const fork=mainEndpoints[i].reduce((a,b)=>a.distanceToSquared(endpoint)<b.distanceToSquared(endpoint)?a:b);
      const twig=new THREE.Object3D();twig.position.copy(fork);twig.quaternion.setFromUnitVectors(branchAxis,endpoint.clone().sub(fork).normalize());twig.scale.set(1,fork.distanceTo(endpoint),1);twig.updateMatrix();twigMesh.setMatrixAt(canopyIdx,twig.matrix);

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
  decTrunkMesh.count=decTrees.length;decBranchMesh.count=decTrees.length*branchesPerTree;decCanopyMesh.count=decTrees.length*blobsPerTree;twigMesh.count=decTrees.length*blobsPerTree;
  decTrunkMesh.instanceMatrix.needsUpdate = true;
  decBranchMesh.instanceMatrix.needsUpdate = true;
  decCanopyMesh.instanceMatrix.needsUpdate = true;
  if (decCanopyMesh.instanceColor) decCanopyMesh.instanceColor.needsUpdate = true;

  // 3. LOW BUSHES (~110 instances along banks, cliff ledges, path edges)
  const bushGeom = decCanopyGeom.clone();
  bushGeom.computeVertexNormals();
  const bushMat = new THREE.MeshStandardMaterial({
    color: SEASON_PALETTES.spring.canopyPrimary,
    side: THREE.DoubleSide,
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
  bushMesh.count=bPlaced;
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
    const hBlade=.12+.025*Math.sin(b*2.1),w=.005;
    const first=gPos.length/3;
    for(let segment=0;segment<=3;segment++){
      const u=segment/3,width=w*(1-u),out=.045*u*u;
      for(const sign of [-1,1]){
        gPos.push(cosA*out-sign*sinA*width,hBlade*u,sinA*out+sign*cosA*width);
        const color=baseCol.clone().lerp(tipCol,u);gCol.push(color.r,color.g,color.b);
      }
      if(segment<3){const v=first+segment*2;gIdx.push(v,v+2,v+1);if(segment<2)gIdx.push(v+1,v+2,v+3);}
    }
  }

  grassBladeGeom.setAttribute('position', new THREE.Float32BufferAttribute(gPos, 3));
  grassBladeGeom.setAttribute('color', new THREE.Float32BufferAttribute(gCol, 3));
  grassBladeGeom.setIndex(gIdx);
  grassBladeGeom.computeVertexNormals();

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
  grassMesh.name='GrassTufts';
  group.add(grassMesh);

  let gPlaced = 0;
  let gAttempts = 0;
  while (gPlaced < grassCount && gAttempts < 15000) {
    gAttempts++;
    const x = vRng.range(-halfW + 0.5, halfW - 0.5);
    const z = vRng.range(-halfD + 0.5, halfD - 0.5);

    if (!isInsideGardenFootprint(x, z, 0.30) || isInStream(x, z) || isInsideBuildingExclusion(x, z, 0.15) || isNearCampActivity(x, z) || isNearWalkingTrail(x, z, 0.20)) continue;
    const h = getHeightAt(x, z);
    if (h < WATER_LEVEL + 0.04) continue;
    const slope = getSlopeAt(x, z);
    if (slope > 0.45) continue;

    const patch=(simplexNoise3D(x*.85,13,z*.85)+1)*.5;
    if(patch<.47 || (patch<.65&&vRng.next()>.45))continue;
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

  const weather = createVegetationWeather();
  const treeRoot = (i: number, parts = 1) => {
    const p = decTrees[Math.floor(i / parts)];
    return new THREE.Vector3(p?.x ?? 0, p?.y ?? 0, p?.z ?? 0);
  };
  for(const batch of pineBatches)for(const mesh of [batch.wood,batch.leaves])weather.attach(mesh,.018,i=>{
    const p=batch.trees[i];return new THREE.Vector3(p.x,p.y,p.z);
  },false,false,{stem:.009,joint:i=>{const p=batch.trees[i];return new THREE.Vector3(p.x,p.y+p.h*.25,p.z)}});
  weather.attach(decTrunkMesh, .012, i => treeRoot(i));
  const treeJoint=(i:number,parts:number)=>{const p=decTrees[Math.floor(i/parts)];return new THREE.Vector3(p.x,p.y+p.h*.60,p.z);};
  weather.attach(decBranchMesh,.019,i=>treeRoot(i,branchesPerTree),false,false,{stem:.012,joint:i=>treeJoint(i,branchesPerTree)});
  weather.attach(twigMesh,.019,i=>treeRoot(i,blobsPerTree),false,false,{stem:.012,joint:i=>treeJoint(i,blobsPerTree)});
  weather.attach(decCanopyMesh,.019,i=>treeRoot(i,blobsPerTree),true,false,{stem:.012,joint:i=>treeJoint(i,blobsPerTree)});
  weather.attach(bushMesh, .16);
  weather.attach(vineMesh, .18);
  const flowerWeather = createVegetationWeather();
  flowerWeather.attach(flowerStemMesh, 2.0, undefined, true);
  flowerWeather.attach(flowerHeadMesh, 2.0, undefined, true);
  weather.attach(grassMesh, 3.0);
  weather.attach(fernMesh, 1.7);

  let targetSeason: Season = 'spring';
  let weights = { spring: 1, summer: 0, autumn: 0, winter: 0 };
  const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
  const color = new THREE.Color();
  function update(dt: number, elapsed: number, windStrength: number, snow = 0, seasonWeights?: Record<Season, number>): void {
    const alpha = 1 - Math.exp(-Math.max(0, dt) * 1.5);
    if (seasonWeights) weights = seasonWeights;
    else for (const season of seasons) weights[season] += ((season === targetSeason ? 1 : 0) - weights[season]) * alpha;
    const palette = (key: 'pineFoliage' | 'canopyPrimary') => {
      color.setRGB(0, 0, 0);
      // Accumulate palette channels without allocating colors or touching instance buffers.
      for (const season of seasons) {
        const c = SEASON_PALETTES[season][key];
        color.r += c.r * weights[season]; color.g += c.g * weights[season]; color.b += c.b * weights[season];
      }
      return color;
    };
    // Instanced tints already contain spring green; use ratios to avoid multiplying green twice.
    const tint = (mat: THREE.Material, key: 'pineFoliage' | 'canopyPrimary') => {
      const c = palette(key); const base = SEASON_PALETTES.spring[key];
      (mat as THREE.MeshStandardMaterial).color.setRGB(c.r / Math.max(.01, base.r), c.g / Math.max(.01, base.g), c.b / Math.max(.01, base.b));
    };
    for(const batch of pineBatches)tint(batch.leaves.material as THREE.Material,'pineFoliage');
    tint(decCanopyMesh.material as THREE.Material, 'canopyPrimary');
    (grassMesh.material as THREE.MeshStandardMaterial).color.setRGB(1, 1 - weights.autumn * .2 - weights.winter * .25, 1 - weights.autumn * .3);
    (fernMesh.material as THREE.MeshStandardMaterial).color.setRGB(.18 + weights.autumn * .06, .4 - weights.winter * .15, .12);
    weather.update(dt, elapsed, windStrength, 0, snow, weights.spring * .85 + weights.summer + weights.autumn * .5 + weights.winter * .025);
    const bloom = weights.spring + weights.summer * .85 + weights.autumn * .35 + weights.winter * .02;
    // Independent uniforms allow perennial flowers to go dormant without shrinking evergreen foliage.
    flowerWeather.update(dt, elapsed, windStrength, 0, snow, bloom);
  }
  function updateSeason(season: Season, _t: number): void { targetSeason = season; }

  return {
    group,
    update,
    updateSeason,
    dispose() {
      weather.dispose();
      flowerWeather.dispose();
      pineCrowns.forEach(c=>{c.wood.dispose();c.foliage.dispose()});
      pineTrunkMat.dispose();
      pineFoliageMat.dispose();
      decTrunkGeom.dispose();
      decTrunkMat.dispose();
      decBranchGeom.dispose();
      twigGeom.dispose();
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
