import * as THREE from 'three';
import {GARDEN_BOUNDARY_POINTS} from '../src/three/themes/garden/footprint';
import {createTerrain,computeRawTerrainHeight} from '../src/three/themes/garden/terrain';
import {createVegetation} from '../src/three/themes/garden/vegetation';
import {createArchitecture} from '../src/three/themes/garden/architecture';
import {createBeachArchitecture} from '../src/three/themes/beach/architecture';
import {createBeachVegetation} from '../src/three/themes/beach/vegetation';
import {getTerrainHeight} from '../src/three/themes/beach/shoreline';
const checks:{name:string;ok:boolean;detail:unknown}[]=[];
function check(ok:boolean,name:string,detail:unknown=''){checks.push({ok,name,detail});console.log(ok?'PASS':'FAIL',name,JSON.stringify(detail))}
const terrain=createTerrain(new THREE.Scene()),garden=createVegetation(new THREE.Scene(),terrain.getHeightAt,terrain.getSlopeAt,terrain.isInStream,terrain.isOnPlateau),beach=createBeachVegetation(new THREE.Group(),getTerrainHeight,()=>0);
for(const [theme,system,prefix]of [['Garden',garden,'PineFoliage'],['Beach',beach,'CasuarinaNeedles']]as const){
 const crowns:THREE.InstancedMesh[]=[];system.group.traverse(o=>{if(o instanceof THREE.InstancedMesh&&(o.name.startsWith(prefix)||o.geometry.type==='ConeGeometry'))crowns.push(o)});
 let maxCoverage=0,minCoverage=1,allUp=true;const snowMeans:number[]=[];let snowRetainsNeedles=true;
 for(const crown of crowns){
  const mesh=new THREE.Mesh(crown.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.updateMatrixWorld(true);mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox!,size=box.getSize(new THREE.Vector3());let hits=0;
  for(let iz=0;iz<30;iz++)for(let ix=0;ix<30;ix++){
   const origin=new THREE.Vector3(box.min.x+(ix+.5)/30*size.x,box.max.y+1,box.min.z+(iz+.5)/30*size.z);
   if(new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(mesh).length)hits++;
  }
  const fraction=hits/900;maxCoverage=Math.max(maxCoverage,fraction);minCoverage=Math.min(minCoverage,fraction);
  const n=mesh.geometry.getAttribute('normal');let upward=0;for(let i=0;i<n.count;i++)if(n.getY(i)>(theme==='Garden'?.85:.35))upward++;
  if(upward/n.count<.6)allUp=false;
  const cover=mesh.geometry.getAttribute('vegSnowCover');
  if(cover){let total=0,min=1,max=0;for(let i=0;i<cover.count;i++){const v=cover.getX(i);total+=v;min=Math.min(min,v);max=Math.max(max,v);}snowMeans.push(total/cover.count);if(min<0||min>.4||max>.95||max<.6)snowRetainsNeedles=false;}
  else snowRetainsNeedles=false;
  (mesh.material as THREE.Material).dispose();
 }
 check(crowns.length===3&&crowns.every(c=>c.geometry.type!=='ConeGeometry')&&maxCoverage<.65&&minCoverage>.06,`${theme}: three open branch crown variants with measurable gaps`,{variants:crowns.length,minCoverage,maxCoverage});
 check(snowRetainsNeedles&&snowMeans.length===3&&Math.max(...snowMeans)-Math.min(...snowMeans)<.05,`${theme}: consistent surface snow exposure preserves visible evergreen needles`,snowMeans);
 check(allUp,`${theme}: botanical spray normals follow their actual upward/drooping surfaces`);
}
const beachArchitecture=createBeachArchitecture(new THREE.Group(),getTerrainHeight);beachArchitecture.group.updateMatrixWorld(true);
const roofs:THREE.Box3[]=[];beachArchitecture.group.traverse(o=>{if(o instanceof THREE.Mesh&&o.geometry instanceof THREE.ConeGeometry&&o.geometry.parameters.height===1.2)roofs.push(new THREE.Box3().setFromObject(o).expandByScalar(.06))});
let forestClear=true,forestTrees=0;
beach.group.updateMatrixWorld(true);beach.group.traverse(o=>{if(!(o instanceof THREE.InstancedMesh)||!o.name.startsWith('Casuarina'))return;
 if(o.name.startsWith('CasuarinaWood'))forestTrees+=o.count;
 for(let i=0;i<o.count;i++){const m=new THREE.Matrix4();o.getMatrixAt(i,m);m.premultiply(o.matrixWorld);const box=o.geometry.boundingBox!.clone().applyMatrix4(m);if(roofs.some(r=>r.intersectsBox(box)))forestClear=false;}
});
check(forestClear&&forestTrees>=12,'Whole coastal tree envelopes clear actual bungalow roofs with a wind margin',{forestTrees,roofCount:roofs.length});beachArchitecture.dispose();
let worstJump=0,location=0;
for(const z of [-4.2,-3.6])for(let x=-2;x<1.8;x+=.002){const delta=Math.abs(computeRawTerrainHeight(x+.002,z).height-computeRawTerrainHeight(x,z).height);if(delta>worstJump){worstJump=delta;location=x}}
check(worstJump<.025,'Heightfield has no branch-selection step discontinuity on rear slopes',{worstJump,location});
const terrainMesh=terrain.group.getObjectByName('DioramaTerrainMesh') as THREE.Mesh;
const terrainPosition=terrainMesh.geometry.getAttribute('position'),terrainNormals=terrainMesh.geometry.getAttribute('normal'),terrainColors=terrainMesh.geometry.getAttribute('color');
const topCount=terrainMesh.geometry.userData.topVertexCount??(1+140*256);
let normalMatch=true,sideLuminance=0,sideSamples=0;
for(let i=0;i<topCount;i+=37){
 const x=terrainPosition.getX(i),z=terrainPosition.getZ(i),normal=new THREE.Vector3().fromBufferAttribute(terrainNormals,i);
 if(normal.dot(terrain.getNormalAt(x,z))<.999)normalMatch=false;
}
for(let i=topCount;i<terrainPosition.count;i++)if(terrainPosition.getY(i)>-.51&&Math.abs(terrainNormals.getY(i))<.03){sideLuminance+=terrainColors.getX(i)*.2126+terrainColors.getY(i)*.7152+terrainColors.getZ(i)*.0722;sideSamples++}
let longestTopEdge=0,coveredArea=0;
const meshIndex=terrainMesh.geometry.index!;
for(let i=0;i<meshIndex.count;i+=3){const ids=[meshIndex.getX(i),meshIndex.getX(i+1),meshIndex.getX(i+2)];if(ids.some(id=>id>=topCount))continue;
 const [a,b,c]=ids.map(id=>new THREE.Vector2(terrainPosition.getX(id),terrainPosition.getZ(id)));coveredArea+=Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))*.5;
 for(let j=0;j<3;j++){const a=ids[j],b=ids[(j+1)%3];longestTopEdge=Math.max(longestTopEdge,Math.hypot(terrainPosition.getX(a)-terrainPosition.getX(b),terrainPosition.getZ(a)-terrainPosition.getZ(b)));}
}
const contourArea=Math.abs(GARDEN_BOUNDARY_POINTS.reduce((sum,a,i)=>{const b=GARDEN_BOUNDARY_POINTS[(i+1)%GARDEN_BOUNDARY_POINTS.length];return sum+a.x*b.y-b.x*a.y},0))*.5;
const topPositions=new Set<string>(),renderedTop=new Set<number>();for(let i=0;i<meshIndex.count;i++)if(meshIndex.getX(i)<topCount)renderedTop.add(meshIndex.getX(i));
for(const i of renderedTop)topPositions.add([terrainPosition.getX(i),terrainPosition.getY(i),terrainPosition.getZ(i)].join(','));
let joined=true;for(let i=topCount;i<topCount+(terrainMesh.geometry.userData.boundaryCount??0);i++)if(!topPositions.has([terrainPosition.getX(i),terrainPosition.getY(i),terrainPosition.getZ(i)].join(',')))joined=false;
check(Math.abs(coveredArea-contourArea)<.0001,'Clipped top covers the complete display polygon without gaps or excess area',{coveredArea,contourArea});
check(joined&&terrainMesh.geometry.userData.boundaryCount>256,'Every wall rim vertex exactly reuses a rendered top position');
check(longestTopEdge<.16,'Actual top triangles avoid long radial diagonals across cliff normals',longestTopEdge);
check(normalMatch,'Rendered terrain consumes the sampled field normals rather than radial triangle averages');
check(sideSamples>100&&sideLuminance/sideSamples>.25,'Actual cutaway colors retain light mineral layers',sideLuminance/sideSamples);
const architecture=createArchitecture(new THREE.Scene(),terrain.getHeightAt);
for(const [i,y]of [1.7310000312051108,1.691000002816666,1.4729426160527546].entries()){
 const dome=architecture.group.getObjectByName(`domeTent_${i}`)!;check(Math.abs(dome.position.y-y)<1e-6,`Dome ${i} deck elevation preserved from baseline`,{actual:dome.position.y,baseline:y});
}
const timberBounds=new THREE.Box3().setFromObject(architecture.group.getObjectByName('GardenTimber')!);
check(Math.abs(timberBounds.min.y-.9209182858467102)<1e-6&&Math.abs(timberBounds.max.y-3.2149999141693115)<1e-6,'Cabin and timber support elevation bounds preserved from baseline',timberBounds.max.y);
architecture.dispose();terrain.dispose();garden.dispose();beach.dispose();
console.log(`${checks.filter(c=>c.ok).length}/${checks.length} landscape shape checks passed`);if(checks.some(c=>!c.ok))process.exit(1);
