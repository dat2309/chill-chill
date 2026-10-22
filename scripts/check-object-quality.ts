import * as THREE from 'three';
import {SEA_LEVEL_LOW,SEA_LEVEL_HIGH} from '../src/three/themes/beach/constants';
import {createBeachArchitecture} from '../src/three/themes/beach/architecture';
import {createArchitecture} from '../src/three/themes/garden/architecture';
import {createBeachBoats,getOceanWaveElevation,isInsideThungCavity,isPointInBoatCavity} from '../src/three/themes/beach/boats';
import {getTerrainHeight,BOAT_SPOTS} from '../src/three/themes/beach/shoreline';
import {createVegetation} from '../src/three/themes/garden/vegetation';
import {GARDEN_STEPPING_STONES} from '../src/three/themes/garden/architecture';
import {createTerrain} from '../src/three/themes/garden/terrain';
import {createBeachVegetation} from '../src/three/themes/beach/vegetation';
import {createBeachTerrain} from '../src/three/themes/beach/terrain';
import {isInsideBeachFootprint} from '../src/three/themes/beach/footprint';
import {getBeachCoverHeight} from '../src/three/themes/beach/rainExposure';
import {computeRawTerrainHeight} from '../src/three/themes/garden/terrain';
const results:{name:string;ok:boolean;details:string}[]=[];
function check(ok:boolean,name:string,details=''){results.push({ok,name,details});console.log(`${ok?'PASS':'FAIL'} ${name} ${details}`);}
const parent=new THREE.Group();const architecture=createBeachArchitecture(parent,getTerrainHeight);parent.updateMatrixWorld(true);
let maxFootGap=0,minFootGap=0,maxSupportGap=0,posts=0;
architecture.group.traverse(obj=>{
 if(!(obj instanceof THREE.Mesh)||obj.geometry.type!=='CylinderGeometry'||(obj.geometry as THREE.CylinderGeometry).parameters.radiusBottom!==.055)return;
 const deck=obj.parent!.children.find(c=>c instanceof THREE.Mesh&&c.geometry.type==='BoxGeometry'&&(c.geometry as THREE.BoxGeometry).parameters.width===2.1) as THREE.Mesh;
 if(!deck)return;posts++;
 const p=obj.geometry.getAttribute('position');const v=new THREE.Vector3();
 for(let i=0;i<p.count;i++)if(p.getY(i)<-.49){v.fromBufferAttribute(p,i);obj.localToWorld(v);const gap=v.y-getTerrainHeight(v.x,v.z);maxFootGap=Math.max(maxFootGap,gap);minFootGap=Math.min(minFootGap,gap);}
 const top=obj.localToWorld(new THREE.Vector3(0,.5,0)),under=deck.localToWorld(new THREE.Vector3(obj.position.x,-.04,obj.position.z));
 maxSupportGap=Math.max(maxSupportGap,Math.abs(top.y-under.y));
});
check(posts===12&&maxFootGap<.012&&minFootGap>-.12&&maxSupportGap<.015,'Bungalow post footprints contact terrain and support the deck underside',JSON.stringify({posts,maxFootGap,minFootGap,maxSupportGap}));
// Regression: veranda access must form a grounded, connected structural graph.
let accessValid=true,accessFeet=0,accessPieces=0;const accessDetails:unknown[]=[];
function worldTriangles(mesh:THREE.Mesh):THREE.Triangle[]{
 const g=mesh.geometry,p=g.getAttribute('position'),idx=g.index,out:THREE.Triangle[]=[];
 for(let i=0;i<(idx?.count??p.count);i+=3)out.push(new THREE.Triangle(...[0,1,2].map(j=>mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(p,idx?idx.getX(i+j):i+j))) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]));return out;
}
function contact(a:THREE.Mesh,b:THREE.Mesh):boolean{
 const aa=worldTriangles(a),bb=worldTriangles(b),near=new THREE.Vector3(),hit=new THREE.Vector3();
 for(const t of aa)for(const u of bb){
  for(const [v,w]of [[t,u],[u,t]])for(const [p,q]of [[v.a,v.b],[v.b,v.c],[v.c,v.a]]){
   if(p.distanceTo(w.closestPointToPoint(p,near))<.008)return true;
   const length=p.distanceTo(q),ray=new THREE.Ray(p,q.clone().sub(p).normalize());
   if(ray.intersectTriangle(w.a,w.b,w.c,false,hit)&&p.distanceTo(hit)<=length+.0001)return true;
  }
 }return false;
}
for(const bungalow of architecture.group.children.filter(o=>o.name.startsWith('Bungalow_'))){
 const deck=bungalow.children.find(o=>o instanceof THREE.Mesh&&o.geometry.type==='BoxGeometry'&&(o.geometry as THREE.BoxGeometry).parameters.width===2.1) as THREE.Mesh;
 const access=bungalow.getObjectByName('VerandaAccess');const pieces:THREE.Mesh[]=[];
 if(access)access.traverse(o=>{if(o instanceof THREE.Mesh)pieces.push(o)});
 else pieces.push(...bungalow.children.filter(o=>o instanceof THREE.Mesh&&o.geometry.type==='BoxGeometry'&&(o.geometry as THREE.BoxGeometry).parameters.width===.8) as THREE.Mesh[]);
 const connected=new Set<THREE.Mesh>([deck]);let changed=true;
 while(changed){changed=false;for(const p of pieces)if(!connected.has(p)&&[...connected].some(q=>contact(p,q))){connected.add(p);changed=true}}
 let feet=0,footGap=0;for(const post of pieces.filter(o=>o.name.startsWith('AccessFoot'))){
  feet++;const p=post.geometry.getAttribute('position'),n=post.geometry.getAttribute('normal');
  for(let i=0;i<p.count;i++)if(n.getY(i)<-.1){const v=post.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));const gap=v.y-getTerrainHeight(v.x,v.z);footGap=Math.max(footGap,gap,-gap-.05);}
 }
 const treads=pieces.filter(o=>o.name.startsWith('AccessTread')||!access).sort((a,b)=>new THREE.Box3().setFromObject(b).max.y-new THREE.Box3().setFromObject(a).max.y);
 let minTreadClearance=Infinity,maxLandingRise=0;const deckTop=new THREE.Box3().setFromObject(deck).max.y;let previous=deckTop,risesValid=treads.length>=3&&treads.length<=7,clear=true;
 for(const tread of treads){const box=new THREE.Box3().setFromObject(tread);const rise=previous-box.max.y;if(rise<.10||rise>.22)risesValid=false;previous=box.max.y;
  for(const tri of worldTriangles(tread))for(const v of [tri.a,tri.b,tri.c,tri.getMidpoint(new THREE.Vector3())]){const gap=v.y-getTerrainHeight(v.x,v.z);minTreadClearance=Math.min(minTreadClearance,gap);if(gap<.015||v.y>deckTop-.02)clear=false;}
 }
 if(treads.length){const low=treads[treads.length-1];const p=low.geometry.getAttribute('position');for(let i=0;i<p.count;i++){const v=low.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));if(Math.abs(v.y-previous)<.001){const gap=v.y-getTerrainHeight(v.x,v.z);maxLandingRise=Math.max(maxLandingRise,gap);if(gap>.30)clear=false;}}}
 deck.geometry.computeBoundingBox();const deckBounds=deck.geometry.boundingBox!;
 for(const part of pieces)for(const tri of worldTriangles(part))for(const p of [tri.a,tri.b,tri.c]){
  const local=deck.worldToLocal(p.clone());
  if(local.x>=deckBounds.min.x&&local.x<=deckBounds.max.x&&local.z>=deckBounds.min.z&&local.z<=deckBounds.max.z&&local.y>deckBounds.min.y+.015)clear=false;
 }
 const ok=pieces.length>3&&connected.size===pieces.length+1&&feet>=2&&footGap<.008&&risesValid&&clear;accessValid&&=ok;accessFeet+=feet;accessPieces+=pieces.length;
 accessDetails.push({bungalow:bungalow.name,ok,parts:pieces.length,connected:connected.size-1,feet,footGap,risesValid,clear,minTreadClearance,maxLandingRise});
}
check(accessValid&&accessFeet>=6,'All bungalow access parts connect to decks, have grounded full support feet and usable clear treads',JSON.stringify({accessPieces,accessFeet,accessDetails}));
const garden=createArchitecture(new THREE.Scene(),(x,z)=>computeRawTerrainHeight(x,z).height);garden.group.updateMatrixWorld(true);
const snow=garden.group.children.find(o=>o instanceof THREE.Mesh&&(o.material as THREE.MeshStandardMaterial).transparent&&(o.material as THREE.MeshStandardMaterial).opacity===0) as THREE.Mesh;
let maxSnowDistance=0,minSigned=Infinity,snowSamples=0;
for(const dome of garden.group.children.filter(o=>o.name.startsWith('domeTent_')) as THREE.Mesh[]){
 const p=dome.geometry.getAttribute('position'),triangles:THREE.Triangle[]=[];
 for(let i=0;i<p.count;i+=3)triangles.push(new THREE.Triangle(...[0,1,2].map(j=>dome.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i+j))) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]));
 const sp=snow.geometry.getAttribute('position'),closest=new THREE.Vector3(),point=new THREE.Vector3(),normal=new THREE.Vector3();
 for(let i=0;i<sp.count;i++){
  point.fromBufferAttribute(sp,i);snow.localToWorld(point);
  if(Math.hypot(point.x-dome.position.x,point.z-dome.position.z)>.74)continue;
  let distance=Infinity,signed=0;
  for(const t of triangles){t.closestPointToPoint(point,closest);const d=point.distanceTo(closest);if(d<distance){distance=d;signed=point.clone().sub(closest).dot(t.getNormal(normal));}}
  maxSnowDistance=Math.max(maxSnowDistance,distance);minSigned=Math.min(minSigned,signed);snowSamples++;
 }
}
check(snowSamples>100&&maxSnowDistance<.035&&minSigned>-.003,'Dome snow follows the actual roof surface without floating or deep penetration',JSON.stringify({snowSamples,maxSnowDistance,minSigned}));
const boats=createBeachBoats(new THREE.Group());let worstAngle=0;
for(const tide of [SEA_LEVEL_LOW,SEA_LEVEL_HIGH])for(const wind of [.1,1.2])for(let t=0;t<20;t+=.17){
 boats.update(.017,t,tide,wind,.5);
 const {x,z}=BOAT_SPOTS.thung,e=.0001;
 // Independent finite differences of the production water surface, not its slope helper.
 const tx=new THREE.Vector3(2*e,getOceanWaveElevation(x+e,z,t,wind)-getOceanWaveElevation(x-e,z,t,wind),0);
 const tz=new THREE.Vector3(0,getOceanWaveElevation(x,z+e,t,wind)-getOceanWaveElevation(x,z-e,t,wind),2*e);
 const normal=tz.cross(tx).normalize(),up=new THREE.Vector3(0,1,0).transformDirection(boats.thungGroup.matrixWorld);
 worstAngle=Math.max(worstAngle,normal.angleTo(up));
}
check(worstAngle<.012,'Basket boat aligns to the real wave normal across yaw, tide, wind and phase',`worstAngle=${worstAngle}`);

// Actual batched timber ranges identify parts; the test reads their rendered vertices, not cached heights.
const timber=garden.group.getObjectByName('GardenTimber') as THREE.Mesh;
const timberPos=timber.geometry.getAttribute('position');
const parts=timber.userData.parts as {role:string;start:number;count:number}[];
const deckTriangles:THREE.Triangle[]=[];
for(const part of parts.filter(p=>p.role==='deck'))for(let i=part.start;i<part.start+part.count;i+=3)deckTriangles.push(new THREE.Triangle(...[0,1,2].map(j=>timber.localToWorld(new THREE.Vector3().fromBufferAttribute(timberPos,i+j))) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]));
let supportFeet=0,supportsValid=true,decksClear=true,worstSupportBottom=0,worstSupportTop=0,lowestDeck=Infinity;
for(const part of parts){
 const vertices=Array.from({length:part.count},(_,j)=>timber.localToWorld(new THREE.Vector3().fromBufferAttribute(timberPos,part.start+j)));
 const low=Math.min(...vertices.map(p=>p.y)),high=Math.max(...vertices.map(p=>p.y));
 if(part.role==='deck')for(const p of vertices.filter(p=>p.y<low+.001)){const gap=p.y-computeRawTerrainHeight(p.x,p.z).height;lowestDeck=Math.min(lowestDeck,gap);if(gap<.001)decksClear=false;}
 if(part.role!=='foundation')continue;supportFeet++;
 for(const [j,p] of vertices.entries()){
  if(timber.geometry.getAttribute('normal').getY(part.start+j)>=-.001)continue;
  const gap=p.y-computeRawTerrainHeight(p.x,p.z).height;worstSupportBottom=Math.max(worstSupportBottom,gap,-gap-.115);if(gap>.015||gap<-.13)supportsValid=false;
 }
 for(const p of vertices.filter(p=>p.y>high-.001)){
  let distance=Infinity;for(const t of deckTriangles)distance=Math.min(distance,p.distanceTo(t.closestPointToPoint(p,new THREE.Vector3())));
  worstSupportTop=Math.max(worstSupportTop,distance);if(distance>.018)supportsValid=false;
 }
}
check(supportFeet===16&&supportsValid&&decksClear,'All Garden foundation footprints contact ground, support actual deck undersides and keep deck corners clear',JSON.stringify({supportFeet,worstSupportBottom,worstSupportTop,lowestDeck}));
// Frame feet are measured on the rendered strut endpoints and actual deck triangles.
let frameFeet=0,frameGap=0;
for(const frame of garden.group.children.filter(o=>o.name.startsWith('DomeFrame_')) as THREE.InstancedMesh[]){
 const origin=frame.getWorldPosition(new THREE.Vector3());
 for(let i=0;i<frame.count;i++){
  const m=new THREE.Matrix4();frame.getMatrixAt(i,m);
  for(const y of [-.5,.5]){
   const p=new THREE.Vector3(0,y,0).applyMatrix4(m).applyMatrix4(frame.matrixWorld);
   if(Math.abs(p.y-origin.y)>.002)continue;
   let gap=Infinity;for(const t of deckTriangles)gap=Math.min(gap,p.distanceTo(t.closestPointToPoint(p,new THREE.Vector3())));
   frameGap=Math.max(frameGap,gap);frameFeet++;
  }
 }
}
check(frameFeet>20&&frameGap<.012,'Dome structural frame feet seat on actual deck tops',`feet=${frameFeet}, gap=${frameGap}`);
// Snow on the two real A-frame roof slopes, measured against the rendered merged prop triangles.
const roof=garden.group.getObjectByName('GardenProps') as THREE.Mesh,roofPos=roof.geometry.getAttribute('position');
const roofFaces:THREE.Triangle[]=[];
for(let i=0;i<roofPos.count;i+=3)roofFaces.push(new THREE.Triangle(...[0,1,2].map(j=>roof.localToWorld(new THREE.Vector3().fromBufferAttribute(roofPos,i+j))) as [THREE.Vector3,THREE.Vector3,THREE.Vector3]));
let cabinSnow=0,cabinSnowGap=0;
const snowPos=snow.geometry.getAttribute('position');
for(let i=0;i<snowPos.count;i++){
 const p=snow.localToWorld(new THREE.Vector3().fromBufferAttribute(snowPos,i));if(p.x< -2||p.x>0||p.z< -3.8||p.z> -1.2)continue;
 cabinSnow++;let distance=Infinity;for(const t of roofFaces)distance=Math.min(distance,p.distanceTo(t.closestPointToPoint(p,new THREE.Vector3())));cabinSnowGap=Math.max(cabinSnowGap,distance);
}
check(cabinSnow>20&&cabinSnowGap<.023,'Cabin snow follows both actual thick roof slopes',`maxGap=${cabinSnowGap}`);
// Whole rim, keel and cavity are sampled over tides/winds/phases; finite differences remain the independent wave reference.
let rimClear=true,hullGroundClear=true,cavitiesMatch=true,heaveExact=true,cavitySamples=0;
const m=new THREE.Matrix4();
for(const level of [SEA_LEVEL_LOW,SEA_LEVEL_HIGH])for(const wind of [.1,1.2])for(let time=0;time<16;time+=.31){
 boats.update(.016,time,level,wind,.5,1);
 for(const [group,name] of [[boats.thungGroup,'ThungHull'],[boats.gheGroup,'GheHull']] as const){
  const hull=group.getObjectByName(name) as THREE.Mesh,p=hull.geometry.getAttribute('position');
  const center=group.getWorldPosition(new THREE.Vector3());
  if(Math.abs(center.y-level-getOceanWaveElevation(center.x,center.z,time,wind))>1e-7)heaveExact=false;
  for(let i=0;i<p.count;i++){
   const local=new THREE.Vector3().fromBufferAttribute(p,i),world=hull.localToWorld(local.clone());
   const surface=level+getOceanWaveElevation(world.x,world.z,time,wind);
   if(local.y>.19&&world.y<surface+.025)rimClear=false;
   if(world.y<getTerrainHeight(world.x,world.z)-.005)hullGroundClear=false;
  }
  const inverse=name==='ThungHull'?boats.getCavities().thungInvMatrix:boats.getCavities().gheInvMatrix;
  m.copy(group.matrixWorld).multiply(inverse);
  if(m.elements.some((v,i)=>Math.abs(v-(i%5===0?1:0))>1e-6))cavitiesMatch=false;
  const up=new THREE.Vector3(0,1,0).transformDirection(group.matrixWorld);
  for(const dx of [-.2,0,.2]){
   const point=group.localToWorld(new THREE.Vector3(dx,0,0));
   if(!isPointInBoatCavity(point,boats))cavitiesMatch=false;
   const ray=new THREE.Raycaster(point,up.clone().negate(),0,1);if(!ray.intersectObject(hull,false).length)cavitiesMatch=false;cavitySamples++;
  }
 }
}
check(heaveExact&&rimClear&&hullGroundClear,'Both complete hulls keep design waterlines, freeboard and bed clearance across tides/winds/phases');
check(cavitiesMatch&&cavitySamples>1000,'Final cavity matrices track real hollow hulls and cut points remain over actual inner floors',`samples=${cavitySamples}`);
// Full grass blades (not just roots) clear every stepping stone.
const terrain=createTerrain(new THREE.Scene());
const vegetation=createVegetation(new THREE.Scene(),terrain.getHeightAt,terrain.getSlopeAt,terrain.isInStream,terrain.isOnPlateau);
const grass=vegetation.group.getObjectByName('GrassTufts') as THREE.InstancedMesh;
let grassClear=true;
for(let i=0;i<grass.count;i++){
 grass.getMatrixAt(i,m);const p=grass.geometry.getAttribute('position');
 for(let j=0;j<p.count;j++){
  const v=new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(m);
  if(GARDEN_STEPPING_STONES.some(st=>Math.hypot(v.x-st.x,v.z-st.z)<(st.r??.22)+.08))grassClear=false;
 }
}
check(grass.count>100&&grassClear,'Clustered grass blade footprints preserve walking-stone clearance including a wind margin');
const beachTerrain=createBeachTerrain(new THREE.Group());let rocksSeated=true,rockCount=0;
const coastalVegetation=createBeachVegetation(new THREE.Group(),getTerrainHeight,()=>0);coastalVegetation.group.updateMatrixWorld(true);
const obstacles:THREE.Mesh[]=[];
for(const root of [coastalVegetation.group,beachTerrain.group,architecture.group])root.traverse(o=>{
 if(!(o instanceof THREE.Mesh))return;
 let inBungalow=false;for(let parent=o.parent;parent;parent=parent.parent)if(parent.name.startsWith('Bungalow_'))inBungalow=true;
 if(o===beachTerrain.group.getObjectByName('BeachBoulders')||root===coastalVegetation.group||(root===architecture.group&&!inBungalow)){
  if(o instanceof THREE.InstancedMesh){for(let i=0;i<o.count;i++){const im=new THREE.Matrix4();o.getMatrixAt(i,im);const copy=new THREE.Mesh(o.geometry,o.material);copy.matrixAutoUpdate=false;copy.matrix.copy(o.matrixWorld).multiply(im);copy.updateMatrixWorld(true);obstacles.push(copy);}}
  else obstacles.push(o);
 }
});
let accessObstacleClear=true,accessRainCovered=true,obstaclePairs=0;
for(const bungalow of architecture.group.children.filter(o=>o.name.startsWith('Bungalow_'))){
 const access=bungalow.getObjectByName('VerandaAccess');if(!access){accessObstacleClear=false;continue;}
 access.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
  const box=new THREE.Box3().setFromObject(o);
  for(const obstacle of obstacles){if(!box.clone().expandByScalar(.06).intersectsBox(new THREE.Box3().setFromObject(obstacle)))continue;obstaclePairs++;if(contact(o,obstacle))accessObstacleClear=false;}
  if(o.name.startsWith('AccessTread')){
   const box=new THREE.Box3().setFromObject(o);
   for(const tri of worldTriangles(o))for(const p of [tri.a,tri.b,tri.c])if(Math.abs(p.y-box.max.y)<.001&&getBeachCoverHeight(p.x,p.z)<p.y-.0001)accessRainCovered=false;
  }
 });
}
check(accessObstacleClear,'Complete access geometry clears actual trees, rocks and existing outdoor props',`nearbyPairs=${obstaclePairs}`);
check(accessRainCovered,'Rain collision covers actual world tread corners at their real elevations');
coastalVegetation.dispose();
for(const [system,name,height] of [[terrain,'GardenBoulders',terrain.getHeightAt],[beachTerrain,'BeachBoulders',beachTerrain.getHeightAt]] as const){
 const rock=system.group.getObjectByName(name) as THREE.InstancedMesh,p=rock.geometry.getAttribute('position');
 for(let i=0;i<rock.count;i++){
  rock.getMatrixAt(i,m);let buried=Infinity,exposed=-Infinity;
  for(let j=0;j<p.count;j++){
   const v=new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(m);const gap=v.y-height(v.x,v.z);buried=Math.min(buried,gap);exposed=Math.max(exposed,gap);
   if(name==='BeachBoulders'&&(!isInsideBeachFootprint(v.x,v.z)||getBeachCoverHeight(v.x,v.z)>-Infinity))rocksSeated=false;
  }
  if(buried>-.01||exposed<.025)rocksSeated=false;rockCount++;
 }
}
check(rocksSeated&&rockCount===50,'All accent rock footprints retain real buried/exposed volume and clear Beach buildings/domain',`rocks=${rockCount}`);
// Probe the actual faceted inner wall with horizontal rays, including angular facet centers.
const actualBasketHull=boats.thungGroup.getObjectByName('ThungHull') as THREE.Mesh;
const localBasket=new THREE.Mesh(actualBasketHull.geometry,actualBasketHull.material);localBasket.updateMatrixWorld(true);
let wetRimSamples=0,wetRimValid=true;
for(const y of [-.075,0,.12])for(let a=0;a<Math.PI*2;a+=.073){
 const direction=new THREE.Vector3(Math.cos(a),0,Math.sin(a)),origin=new THREE.Vector3(0,y,0);
 const hit=new THREE.Raycaster(origin,direction).intersectObject(localBasket)[0];
 if(!hit){wetRimValid=false;continue;}
 const inside=origin.clone().addScaledVector(direction,hit.distance-.002),outside=origin.clone().addScaledVector(direction,hit.distance+.002);
 if(!isInsideThungCavity(inside)||isInsideThungCavity(outside))wetRimValid=false;wetRimSamples++;
}
check(wetRimValid&&wetRimSamples>200,'Basket cavity reaches actual faceted inner walls without a liquid ring or outside cut',`wallSamples=${wetRimSamples}`);
vegetation.dispose();terrain.dispose();beachTerrain.dispose();
architecture.dispose();garden.dispose();boats.dispose();
const failures=results.filter(r=>!r.ok);console.log(`${results.length-failures.length}/${results.length} object quality checks passed`);if(failures.length)process.exit(1);
