import * as THREE from 'three';
import {createBeachTerrain} from '../src/three/themes/beach/terrain';
import {createBeachArchitecture} from '../src/three/themes/beach/architecture';
import {createBeachSurfaceWeather,createGroundMoisture,getGroundMaterial,MAX_PUDDLE_SLOPE} from '../src/three/themes/beach/surfaceWeather';
import {getBeachCoverHeight} from '../src/three/themes/beach/rainExposure';
import {createBeachWeather} from '../src/three/themes/beach/weather';
import {isInsideBeachFootprint} from '../src/three/themes/beach/footprint';
let tests=0;
function check(ok:boolean,message:string){tests++;if(!ok)throw Error(message);}
const root=new THREE.Group();
const terrain=createBeachTerrain(root),architecture=createBeachArchitecture(root,terrain.getHeightAt);
const originalPositions=Array.from(terrain.surfaceGeometry.getAttribute('position').array);
const water=createBeachSurfaceWeather(root,terrain,architecture.group);
check(water.basins.length>=3 && water.basins.length<=8,'Purposeful bounded puddles must exist on the real terrain');
check(originalPositions.every((v,i)=>v===terrain.surfaceGeometry.getAttribute('position').array[i]),'Rain must not alter completed terrain/layout');
const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
const top=terrain.group.children.find(o=>o instanceof THREE.Mesh && o.geometry===terrain.surfaceGeometry)!;
root.updateMatrixWorld(true);
for(const basin of water.basins){
 check(basin.floor>.54&&basin.level-basin.floor<=.065&&basin.area<1.8,'Puddles are shallow, above maximum tide and limited in area');
 check(terrain.getSlopeAt(basin.x,basin.z)<=.015,'Puddles start in relatively flat low spots');
 const pos=basin.mesh.geometry.getAttribute('position'),bed=basin.mesh.geometry.getAttribute('aPondBed');
 let allValid=true,aligned=true,winding=true;
 for(let i=0;i<pos.count;i++){
  const x=pos.getX(i),z=pos.getZ(i);
  if(!isInsideBeachFootprint(x,z,.15)||getBeachCoverHeight(x,z)>-Infinity||getGroundMaterial(x,z)==='soil')allValid=false;
 }
 for(let i=0;i<pos.count;i+=3){
  const x=(pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3,z=(pos.getZ(i)+pos.getZ(i+1)+pos.getZ(i+2))/3;
  const h=(bed.getX(i)+bed.getX(i+1)+bed.getX(i+2))/3;
  ray.set(new THREE.Vector3(x,10,z),down);const hit=ray.intersectObject(top,false)[0];
  if(!hit||Math.abs(hit.point.y-h)>.00003)aligned=false;
  const signed=(pos.getZ(i+1)-pos.getZ(i))*(pos.getX(i+2)-pos.getX(i))-(pos.getX(i+1)-pos.getX(i))*(pos.getZ(i+2)-pos.getZ(i));
  if(signed< -1e-10)winding=false;
 }
 check(allValid,'No pond vertex may be outside terrain, under a building/deck or over grass');
 check(aligned&&winding,'Pond clipping follows actual rendered triangles with upward winding');
}
const amounts=()=>water.basins.map(b=>b.amount);
check(amounts().every(a=>a===0)&&water.basins.every(b=>!b.mesh.visible),'No initial water or uninitialized overlay frame');
water.update(30,30,1,.44);const wet=amounts();
check(wet.every(a=>a>.45&&a<1),'Rain accumulates shallow retained water');
const beforeReversal=amounts(),moisture={...water.moisture};
water.update(0,30,0,.44);
check(amounts().every((a,i)=>a===beforeReversal[i])&&Object.keys(moisture).every(k=>moisture[k as keyof typeof moisture]===water.moisture[k as keyof typeof moisture]),'Reversal preserves stored volume and moisture');
water.update(20,50,0,.44);
check(amounts().every((a,i)=>a>0&&a<wet[i]),'After rain ponds recede gradually');
check(water.moisture.rock>amounts().find((_,i)=>water.basins[i].type==='rock')!,'Ground remains damp after standing water has receded');
check(water.basins.every(b=>b.mesh.material.uniforms.uGroundRain.value===0),'Puddle rain ripples stop when effective rain reaches zero');
water.update(20,70,1,.44);check(amounts().every((a,i)=>a>beforeReversal[i]*.4),'Dry to rainy reversal resumes without clearing water');
const fast=createGroundMoisture(),slow=createGroundMoisture();
for(let i=0;i<1800;i++)fast.update(1/60,i<900?1:0);
for(let i=0;i<900;i++)slow.update(1/30,i<450?1:0);
check(Object.keys(fast.moisture).every(k=>Math.abs(fast.moisture[k as keyof typeof fast.moisture]-slow.moisture[k as keyof typeof slow.moisture])<1e-11),'Moisture accumulation/drying is independent of FPS');
const other=createBeachSurfaceWeather(root,terrain,architecture.group);
water.update(1000,1000,0,.44);
for(let i=0;i<1800;i++)other.update(1/60,i/60,i<900?1:0,.44);
const third=createBeachSurfaceWeather(root,terrain,architecture.group);
for(let i=0;i<900;i++)third.update(1/30,i/30,i<450?1:0,.44);
check(other.basins.every((b,i)=>Math.abs(b.amount-third.basins[i].amount)<1e-11),'Pond accumulation/drainage is independent of FPS');
const sand=other.basins.find(b=>b.type==='sand'),rock=other.basins.find(b=>b.type==='rock');
check(!!sand&&!!rock&&sand.amount<rock.amount,'Sand drains faster than rock pockets');
water.update(NaN,NaN,NaN,NaN);
check(amounts().every(Number.isFinite)&&Object.values(water.moisture).every(Number.isFinite),'Invalid timing/rain inputs do not produce NaN');
water.update(30,1030,1,5);check(water.basins.every(b=>!b.mesh.visible),'Higher connected sea water suppresses pond overlays');
// Roof collision comes from actual pyramid dimensions; compare against rendered roof meshes.
const roofs:THREE.Object3D[]=[];
architecture.group.traverse(o=>{if(o instanceof THREE.Mesh&&o.geometry.type==='ConeGeometry')roofs.push(o);});
let roofAligned=true,roofSamples=0;
for(let z=-4.5;z<.5;z+=.22)for(let x=-7;x<8;x+=.22){
 ray.set(new THREE.Vector3(x,10,z),down);const hit=ray.intersectObjects(roofs,false)[0];if(!hit)continue;
 roofSamples++;if(Math.abs(hit.point.y-getBeachCoverHeight(x,z))>.00001)roofAligned=false;
}
check(roofAligned&&roofSamples>100,'CPU rain collision matches rendered rotated roof surfaces');
const rain=createBeachWeather(root,()=>{},undefined,(x,z)=>Math.max(terrain.getHeightAt(x,z),getBeachCoverHeight(x,z)));
rain.setSeason('rainy');rain.updateProgress(2);
for(let i=0;i<150;i++)rain.updateRaindrops(.02,i*.02,.9,.44);
const streaks=(rain.group.children[0] as THREE.LineSegments).geometry.getAttribute('position');
let noPenetration=true;
for(let i=0;i<streaks.count;i+=2){
 const x=streaks.getX(i+1),y=streaks.getY(i+1),z=streaks.getZ(i+1);
 if(y<Math.max(.44,terrain.getHeightAt(x,z),getBeachCoverHeight(x,z))-.00001)noPenetration=false;
}
check(noPenetration,'Actual raindrop trails stop at roofs, ground and current sea level');
rain.dispose();water.dispose();other.dispose();third.dispose();architecture.dispose();terrain.dispose();
console.log(`PASS ${tests} surface weather checks: rendered terrain/roof alignment, valid basins, accumulation, drying, reversal, FPS, rain collision and finite state.`);
