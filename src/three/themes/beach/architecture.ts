import * as THREE from 'three';
import { getBeachCoverHeight, getBungalowFloorHeight, getBungalowAccess } from './rainExposure';
import { BEACH_COLORS, BeachSeason } from './constants';
import { BUNGALOW_SPOTS, PIER_CONFIG } from './shoreline';

export interface BeachArchitectureSystem {
  group: THREE.Group;
  emissiveMeshes: THREE.Mesh[];
  lanternLights: THREE.PointLight[];
  update(dt: number, elapsed: number, timeOfDay: number): void;
  updateSeason(season: BeachSeason | number, t?: number): void;
  isUnderRoof(x: number, z: number): boolean;
  dispose(): void;
}

export function createBeachArchitecture(
  parentGroup: THREE.Group,
  getHeightAt: (x: number, z: number) => number
): BeachArchitectureSystem {
  const archGroup = new THREE.Group();
  archGroup.name = 'BeachArchitecture';
  parentGroup.add(archGroup);

  const emissiveMeshes: THREE.Mesh[] = [];
  const lanternLights: THREE.PointLight[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // Materials
  const deckMat = new THREE.MeshStandardMaterial({ color: BEACH_COLORS.wood.deck });
  const postMat = new THREE.MeshStandardMaterial({ color: BEACH_COLORS.wood.weathered });
  const wallMat = new THREE.MeshStandardMaterial({ color: BEACH_COLORS.wood.bamboo });
  const thatchMatDry = new THREE.MeshStandardMaterial({ color: BEACH_COLORS.wood.thatch });
  materialsToDispose.push(deckMat, postMat, wallMat, thatchMatDry);

  const lanternMat = new THREE.MeshStandardMaterial({
    color: BEACH_COLORS.architecture.lanternWarm,
    emissive: BEACH_COLORS.architecture.lanternGlow,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });
  materialsToDispose.push(lanternMat);

  // --- 1. Thatched Stilt Bungalows (Mái Lá) ---
  const thatchMeshes: THREE.Mesh[] = [];

  BUNGALOW_SPOTS.forEach((spot, idx) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(spot.x, 0, spot.z);
    bGroup.rotation.y = spot.rotationY;
    bGroup.name = `Bungalow_${idx}`;
    archGroup.add(bGroup);
    bGroup.updateWorldMatrix(true,false);

    const floorH = getBungalowFloorHeight(spot,getHeightAt); // Stilt elevation

    // A. Wooden Stilts (4 corner posts)
    const postRadius = 0.055;

    const cornerOffsets = [
      [-0.9, -0.9],
      [0.9, -0.9],
      [-0.9, 0.9],
      [0.9, 0.9],
    ];

    cornerOffsets.forEach(([ox, oz]) => {
      const postGeo = new THREE.CylinderGeometry(postRadius,postRadius,1,8);
      geometriesToDispose.push(postGeo);
      const sample = (px:number,pz:number) => {
        const point=bGroup.localToWorld(new THREE.Vector3(px,0,pz));
        point.y=getHeightAt(point.x,point.z)-.012;
        return bGroup.worldToLocal(point).y;
      };
      let base=-Infinity;
      const positions=postGeo.getAttribute('position');
      for(let i=0;i<positions.count;i++)if(positions.getY(i)<0)base=Math.max(base,sample(ox+positions.getX(i),oz+positions.getZ(i)));
      const top=floorH-.034,stiltLen=top-base;
      const stiltMesh=new THREE.Mesh(postGeo,postMat);
      stiltMesh.name=`BungalowPost_${idx}_${ox}_${oz}`;
      stiltMesh.scale.set(1,stiltLen,1);
      stiltMesh.position.set(ox,base+stiltLen/2,oz);
      for(let i=0;i<positions.count;i++)if(positions.getY(i)<0)positions.setY(i,(sample(ox+positions.getX(i),oz+positions.getZ(i))-stiltMesh.position.y)/stiltLen);
      postGeo.computeVertexNormals();
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

    // Short structural access: treads seat on notched side beams, anchored beneath the deck.
    const access=new THREE.Group();access.name='VerandaAccess';bGroup.add(access);
    const plan=getBungalowAccess(spot,getHeightAt);access.position.x=plan.centerX;
    const addAccess=(geometry:THREE.BufferGeometry,name:string,material=deckMat)=>{
      geometriesToDispose.push(geometry);const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;access.add(mesh);return mesh;
    };
    for(const [i,tread]of plan.treads.entries()){
      const geometry=new THREE.BoxGeometry(.8,.06,plan.run);
      geometry.translate(0,tread.top-.03,tread.z);addAccess(geometry,`AccessTread_${i}`);
    }
    const last=plan.treads[plan.count-1],front=1.05+plan.count*plan.run;
    const outline=new THREE.Shape();outline.moveTo(.91,plan.floorTop-.074);outline.lineTo(1.05,plan.floorTop-.074);
    for(const tread of plan.treads){outline.lineTo(tread.z-plan.run/2,tread.top-.054);outline.lineTo(tread.z+plan.run/2,tread.top-.054);}
    outline.lineTo(front,last.top-.174);outline.lineTo(.91,plan.floorTop-.23);outline.closePath();
    for(const side of [-1,1]){
      const beam=new THREE.ExtrudeGeometry(outline,{depth:.07,bevelEnabled:false});beam.rotateY(-Math.PI/2);beam.translate(side*.31+.035,0,0);
      addAccess(beam,`AccessStringer_${side}`,postMat);
      const top=last.top-.07,z=front-.065,x=side*.31;
      const corners=[[-.045,-.045],[.045,-.045],[.045,.045],[-.045,.045]];
      const ground=(px:number,pz:number)=>{const p=bGroup.localToWorld(new THREE.Vector3(px+plan.centerX,0,pz));p.y=getHeightAt(p.x,p.z)-.015;return bGroup.worldToLocal(p).y;};
      const base=Math.min(...corners.map(([dx,dz])=>ground(x+dx,z+dz)));
      const geometry=new THREE.BoxGeometry(.09,top-base,.09);geometry.translate(x,(top+base)/2,z);
      const positions=geometry.getAttribute('position');for(let i=0;i<positions.count;i++)if(positions.getY(i)<base+.001)positions.setY(i,ground(positions.getX(i),positions.getZ(i)));
      geometry.computeVertexNormals();addAccess(geometry,`AccessFoot_${side}`,postMat);
    }

    // C. Woven Bamboo Walls
    const wallParts = [
      {w:.065,h:1.10,d:1.50,x:-.8175,y:.58,z:-.15},
      {w:.065,h:1.10,d:1.50,x:.8175,y:.58,z:-.15},
      {w:1.70,h:1.10,d:.065,x:0,y:.58,z:-.8675},
      {w:.60,h:1.10,d:.065,x:-.55,y:.58,z:.5675},
      {w:.60,h:1.10,d:.065,x:.55,y:.58,z:.5675},
      {w:.50,h:.25,d:.065,x:0,y:1.005,z:.5675},
    ];
    wallParts.forEach(part=>{
      const geometry=new THREE.BoxGeometry(part.w,part.h,part.d);geometriesToDispose.push(geometry);
      const mesh=new THREE.Mesh(geometry,wallMat);mesh.position.set(part.x,floorH+part.y,part.z);mesh.castShadow=true;mesh.receiveShadow=true;bGroup.add(mesh);
    });
    const doorMat=new THREE.MeshStandardMaterial({color:0x61492f,roughness:.8});materialsToDispose.push(doorMat);
    const doorGeo=new THREE.BoxGeometry(.49,.84,.035);geometriesToDispose.push(doorGeo);
    const doorMesh=new THREE.Mesh(doorGeo,doorMat);doorMesh.name='BungalowDoor';doorMesh.position.set(0,floorH+.45,.60);bGroup.add(doorMesh);

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
    lanternMesh.updateWorldMatrix(true,false);
    pLight.position.copy(archGroup.worldToLocal(lanternMesh.getWorldPosition(new THREE.Vector3())));
    archGroup.add(pLight);
    lanternLights.push(pLight);

  });

  // --- 2. Wooden Jetty / Pier (Cầu Tàu Gỗ) ---
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
  const loungerMat = new THREE.MeshStandardMaterial({ color: 0xe0d2b4 });
  materialsToDispose.push(loungerMat);
  const loungerGeo = new THREE.BoxGeometry(0.45, 0.06, 1.0);
  geometriesToDispose.push(loungerGeo);

  const lounger1Pos = new THREE.Vector3(-3.6, getHeightAt(-3.6, 0.4) + 0.08, 0.4);
  const lounger1 = new THREE.Mesh(loungerGeo, loungerMat);
  lounger1.position.copy(lounger1Pos);
  lounger1.rotation.set(-0.25, 0.3, 0);
  lounger1.castShadow = true;
  archGroup.add(lounger1);

  const lounger2Pos = new THREE.Vector3(-3.0, getHeightAt(-3.0, 0.6) + 0.08, 0.6);
  const lounger2 = new THREE.Mesh(loungerGeo, loungerMat);
  lounger2.position.copy(lounger2Pos);
  lounger2.rotation.set(-0.25, 0.25, 0);
  lounger2.castShadow = true;
  archGroup.add(lounger2);

  // B. Beach Umbrella (Dù che bãi biển)
  const umbrellaPoleMat = new THREE.MeshStandardMaterial({ color: 0x4a4036 });
  materialsToDispose.push(umbrellaPoleMat);
  const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8);
  geometriesToDispose.push(poleGeo);
  const pole = new THREE.Mesh(poleGeo, umbrellaPoleMat);
  const umbX = -3.3;
  const umbZ = 0.3;
  const umbY = getHeightAt(umbX, umbZ) + 0.65;
  pole.position.set(umbX, umbY, umbZ);
  pole.rotation.z = -0.08;
  pole.castShadow = true;
  archGroup.add(pole);

  const canopyGeo = new THREE.ConeGeometry(0.85, 0.4, 8);
  geometriesToDispose.push(canopyGeo);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: BEACH_COLORS.architecture.umbrellaStripe1,
  });
  materialsToDispose.push(canopyMat);
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(umbX - 0.05, umbY + 0.62, umbZ);
  canopy.castShadow = true;
  archGroup.add(canopy);

  // C. Beached SUP Board (Ván SUP trên mép cát vịnh phía Đông)
  const supGeo = new THREE.CylinderGeometry(0.22, 0.26, 1.6, 12);
  geometriesToDispose.push(supGeo);
  supGeo.scale(0.8, 1.0, 0.12);
  supGeo.rotateX(Math.PI / 2);

  const supMat = new THREE.MeshStandardMaterial({
    color: BEACH_COLORS.architecture.supBoard,
  });
  materialsToDispose.push(supMat);

  const supMesh = new THREE.Mesh(supGeo, supMat);
  const supX = 2.8;
  const supZ = 1.4;
  const supY = getHeightAt(supX, supZ) + 0.05;
  supMesh.position.set(supX, supY, supZ);
  supMesh.rotation.set(0.12, 0.6, -0.08);
  supMesh.castShadow = true;
  archGroup.add(supMesh);

  // D. Beach Hammock (Võng mắc giữa 2 cọc tre bên rìa rặng dừa)
  const hamX1 = -4.5;
  const hamZ1 = -0.6;
  const hamX2 = -3.5;
  const hamZ2 = -0.8;
  const hamY1 = getHeightAt(hamX1, hamZ1);
  const hamY2 = getHeightAt(hamX2, hamZ2);

  const hamPostGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
  geometriesToDispose.push(hamPostGeo);
  const post1 = new THREE.Mesh(hamPostGeo, postMat);
  post1.position.set(hamX1, hamY1 + 0.6, hamZ1);
  post1.rotation.z = 0.1;
  archGroup.add(post1);

  const post2 = new THREE.Mesh(hamPostGeo, postMat);
  post2.position.set(hamX2, hamY2 + 0.6, hamZ2);
  post2.rotation.z = -0.1;
  archGroup.add(post2);

  // Curved hammock fabric
  const hamCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(hamX1, hamY1 + 0.85, hamZ1),
    new THREE.Vector3((hamX1 + hamX2) / 2, (hamY1 + hamY2) / 2 + 0.35, (hamZ1 + hamZ2) / 2),
    new THREE.Vector3(hamX2, hamY2 + 0.85, hamZ2)
  );
  const hamGeo = new THREE.TubeGeometry(hamCurve, 12, 0.14, 6, false);
  geometriesToDispose.push(hamGeo);
  const hamMat = new THREE.MeshStandardMaterial({ color: 0xdfd3be });
  materialsToDispose.push(hamMat);
  const hamMesh = new THREE.Mesh(hamGeo, hamMat);
  hamMesh.castShadow = true;
  archGroup.add(hamMesh);

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
    updateSeason(seasonOrFactor: BeachSeason | number, t?: number) {
      // In rainy season, thatch roof absorbs moisture and darkens slightly
      let rainFactor: number;
      if (typeof seasonOrFactor === 'number') {
        rainFactor = THREE.MathUtils.clamp(seasonOrFactor, 0.0, 1.0);
      } else if (t !== undefined) {
        rainFactor = seasonOrFactor === 'rainy' ? t : (1.0 - t);
      } else {
        rainFactor = seasonOrFactor === 'rainy' ? 1.0 : 0.0;
      }
      thatchMatDry.color.copy(BEACH_COLORS.wood.thatch).lerp(BEACH_COLORS.wood.thatchWet, rainFactor);
    },
    isUnderRoof(x: number, z: number): boolean {
      return getBeachCoverHeight(x,z) > -Infinity;
    },
    dispose() {
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      archGroup.clear();
      parentGroup.remove(archGroup);
    },
  };
}
