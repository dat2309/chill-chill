import * as THREE from 'three';
import { createVegetationWeather } from '../../core/vegetationWeather';
import { BEACH_COLORS, PHUQUOC_COLORS, BeachSeason, PhuQuocSeason, SEED } from './constants';
import { getDistanceToShore, isInWater, BUNGALOW_SPOTS } from './shoreline';
import { isInsideBeachFootprint, isInsidePhuQuocFootprint } from './footprint';
import { SeededRandom } from '../../core/noise';

export interface BeachVegetationSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number, rainIntensity?: number): void;
  updateSeason(season: BeachSeason | number, t?: number): void;
  dispose(): void;
}
export type PhuQuocVegetationSystem = BeachVegetationSystem;


// Exact world bounding boxes of thatched bungalow roofs (from 3D cone meshes)
export const BUNGALOW_ROOF_BOUNDS = [
  { minX: -6.57, maxX: -3.49, minZ: -3.19, maxZ: -0.30 }, // West Cove Thatched Roof
  { minX: 0.66,  maxX: 3.81,  minZ: -3.43, maxZ: -0.46 }, // East Cove Thatched Roof
  { minX: 3.86,  maxX: 7.26,  minZ: -4.57, maxZ: -1.30 }, // East Garden Thatched Roof
];

export function createBeachVegetation(
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number,
  getSlopeAt: (x: number, z: number) => number
): BeachVegetationSystem {
  const vegGroup = new THREE.Group();
  vegGroup.name = 'BeachVegetation';
  parentGroup.add(vegGroup);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  const rng = new SeededRandom(SEED + 999);

  // Materials
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: PHUQUOC_COLORS.vegetation.palmTrunk });
  const palmFrondMat = new THREE.MeshStandardMaterial({
    color: PHUQUOC_COLORS.vegetation.palmFrond,
    side: THREE.DoubleSide,
  });
  const casuarinaMat = new THREE.MeshStandardMaterial({ color: PHUQUOC_COLORS.vegetation.casuarina });
  materialsToDispose.push(palmTrunkMat, palmFrondMat, casuarinaMat);

  // --- Box3-based Bungalow Roof Exclusion ---
  // Evaluates the actual 3D bounding box (Box3) of the palm crown against each bungalow roof footprint.
  // Strictly prevents any coconut palm fronds from draping over or penetrating bungalow roofs.
  function doesCrownIntersectRoof(crownObj: THREE.Object3D): boolean {
    crownObj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(crownObj);
    box.min.x -= .05; box.max.x += .5; box.min.z -= .12; box.max.z += .12;
    for (const r of BUNGALOW_ROOF_BOUNDS) {
      const xOverlap = box.min.x <= r.maxX && box.max.x >= r.minX;
      const zOverlap = box.min.z <= r.maxZ && box.max.z >= r.minZ;
      if (xOverlap && zOverlap) {
        return true;
      }
    }
    return false;
  }

  // --- 1. Coconut Palms (Cây Dừa) ---
  // Strategically placed along beach foreshore and rocky headlands, leaning towards water and completely clear of bungalow roofs
  const palmCandidates = [
    // West cove sandy foreshore (leaning west/northwest towards water)
    { x: -7.5, z: 2.0, leanAngle: 0.32, leanDir: 0.8 },
    { x: -6.8, z: 2.4, leanAngle: 0.34, leanDir: 0.6 },
    { x: -4.5, z: 2.5, leanAngle: 0.30, leanDir: 0.3 },
    // Jetty approach & central beach (leaning towards sunset bay)
    { x: -1.2, z: 1.2, leanAngle: 0.28, leanDir: 0.6 },
    { x: 0.2,  z: 1.8, leanAngle: 0.32, leanDir: 0.0 },
    // East beach & coastal terrace
    { x: 3.2,  z: 1.8, leanAngle: 0.32, leanDir: 0.0 },
    { x: 5.2,  z: 1.6, leanAngle: 0.35, leanDir: -0.4 },
    { x: 7.0,  z: 1.5, leanAngle: 0.36, leanDir: -0.7 },
    // Inland hills / headlands (well away from roofs)
    { x: -7.6, z: -5.0, leanAngle: 0.18, leanDir: 0.8 },
    { x: -1.0, z: -5.0, leanAngle: 0.16, leanDir: 0.2 },
    { x: 1.2,  z: -5.2, leanAngle: 0.16, leanDir: -0.2 },
    { x: 7.7,  z: 1.4,  leanAngle: 0.22, leanDir: -0.5 },
    { x: 6.8,  z: 2.8,  leanAngle: 0.35, leanDir: -0.6 },
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

    const trunkPoints=[currPos.clone()];
    for(let s=0;s<segments;s++){
      const t=s/(segments-1),lean=leanAngle*Math.pow(t,1.4);
      currPos.add(new THREE.Vector3(segHeight*Math.sin(lean)*cosD,segHeight*Math.cos(lean),-segHeight*Math.sin(lean)*sinD));
      trunkPoints.push(currPos.clone());
    }
    const path=new THREE.CatmullRomCurve3(trunkPoints);
    const tube=new THREE.TubeGeometry(path,28,.14,8,false);
    const tp=tube.getAttribute('position');
    for(let ring=0;ring<=28;ring++){
      const center=path.getPointAt(ring/28),taper=1-.45*ring/28;
      for(let side=0;side<=8;side++){
        const i=ring*9+side,p=new THREE.Vector3().fromBufferAttribute(tp,i).sub(center).multiplyScalar(taper).add(center);tp.setXYZ(i,p.x,p.y,p.z);
      }
    }
    for(let side=0;side<=8;side++)tp.setY(side,getHeightAt(x+tp.getX(side),z+tp.getZ(side))-groundH-.008);
    const positions=Array.from(tp.array),indices=Array.from(tube.index!.array);
    for(const end of [0,28]){
      const center=path.getPointAt(end/28),index=positions.length/3;positions.push(center.x,center.y,center.z);
      for(let side=0;side<8;side++){
        const a=end*9+side,b=a+1;
        if(end===0)indices.push(index,a,b);else indices.push(index,b,a);
      }
    }
    const trunkGeo=new THREE.BufferGeometry();trunkGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));trunkGeo.setIndex(indices);trunkGeo.computeVertexNormals();tube.dispose();geometriesToDispose.push(trunkGeo);
    const trunkMesh=new THREE.Mesh(trunkGeo,palmTrunkMat);trunkMesh.name='PalmTrunk';trunkMesh.castShadow=true;trunkCurve.add(trunkMesh);
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

    // Update world transform to compute true Box3 bounding footprint of frond meshes
    palmObj.updateMatrixWorld(true);

    // Discard any palm whose crown fronds Box3 intersects any bungalow roof footprint
    if (doesCrownIntersectRoof(crown)) {
      return;
    }

    vegGroup.add(palmObj);
  }

  // Instantiate coconut palms with verified Box3 clearance
  palmCandidates.forEach((p) => {
    createPalmTree(p.x, p.z, p.leanAngle, p.leanDir);
  });

  // --- 2. Coastal Pines (Phi Lao Ven Biển) ---
  const pineTrunkGeo = new THREE.CylinderGeometry(0.06, 0.10, 1.4, 6, 6);
  pineTrunkGeo.translate(0, 0.7, 0);
  geometriesToDispose.push(pineTrunkGeo);

  const pineCanopyGeo = new THREE.ConeGeometry(0.7, 2.2, 9, 5);
  pineCanopyGeo.translate(0,1.1,0);
  const needles=pineCanopyGeo.getAttribute('position');
  for(let i=0;i<needles.count;i++){
    const y=needles.getY(i),factor=.94+.075*Math.sin(y*7+.4);
    needles.setX(i,needles.getX(i)*factor);needles.setZ(i,needles.getZ(i)*factor*(.94+.04*Math.sin(y*3)));
  }
  pineCanopyGeo.computeVertexNormals();
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

    if (isInsideBeachFootprint(px, pz, 0.45) && getDistanceToShore(px, pz) > 1.8 && !isInWater(px, pz)) {
      const py = getHeightAt(px, pz);
      const scale = rng.range(0.75, 1.25);

      dummy.position.set(px, py, pz);
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.updateMatrix();
      pineTrunkMesh.setMatrixAt(placedPines, dummy.matrix);

      dummy.position.set(px, py + .75 * scale, pz);
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

  const weather = createVegetationWeather();
  vegGroup.updateMatrixWorld(true);
  vegGroup.traverse(obj => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj === pineTrunkMesh || obj === pineCanopyMesh) {
      weather.attach(obj, obj === pineTrunkMesh ? .009 : .018, i => {
        const m = new THREE.Matrix4(); pineTrunkMesh.getMatrixAt(i, m);
        return new THREE.Vector3().setFromMatrixPosition(m);
      },false,false,obj===pineCanopyMesh?{stem:.009,joint:i=>{
        const m=new THREE.Matrix4();pineCanopyMesh.getMatrixAt(i,m);return new THREE.Vector3().setFromMatrixPosition(m);
      }}:undefined);
    } else {
      const frond = obj.material === palmFrondMat;
      // Each frond bends from its attachment; trunk segments share the palm's ground anchor.
      let root = new THREE.Vector3();
      {
        const palm = obj.parent!.parent!;
        palm.getWorldPosition(root); obj.worldToLocal(root);
      }
      weather.attach(obj, frond ? .09 : .009, () => root, false, frond);
    }
  });
  return {
    group: vegGroup,
    update(dt: number, elapsed: number, windStrength: number, rainIntensity = 0) {
      weather.update(dt, elapsed, windStrength, rainIntensity);
    },
    updateSeason(_seasonOrFactor: BeachSeason | number, _t?: number) {
      // Rain is supplied continuously by the theme; retained wetness dries over time.
    },
    dispose() {
      weather.dispose();
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      vegGroup.clear();
      parentGroup.remove(vegGroup);
    },
  };
}

export const createPhuQuocVegetation = createBeachVegetation;
