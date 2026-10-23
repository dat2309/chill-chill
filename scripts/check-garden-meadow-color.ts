import * as THREE from 'three';
import {createTerrain,computeRawTerrainHeight,evaluateSurfaceColor} from '../src/three/themes/garden/terrain';
import {Season} from '../src/three/themes/garden/constants';
let failures=0;
const color=(x:number,z:number,s:Season,slope=0)=>{const out=new THREE.Color();evaluateSurfaceColor(x,computeRawTerrainHeight(x,z).height,z,new THREE.Vector3(Math.sqrt(1-(1-slope)**2),1-slope,0),s,out);return out;};
function difference(a:THREE.Color,b:THREE.Color){return Math.hypot(a.r-b.r,a.g-b.g,a.b-b.b)}
for(const season of ['spring','summer','autumn','winter']as Season[]){
 const edges=[{name:'west',fixed:-9,min:-3.45,max:.8,axis:'x'},{name:'east',fixed:-.6,min:-3.45,max:.8,axis:'x'},{name:'rear',fixed:-3.5,min:-8.95,max:-.65,axis:'z'},{name:'front',fixed:.85,min:-8.95,max:-.65,axis:'z'}];
 for(const e of edges){let worst=0,samples=0;for(let v=e.min;v<=e.max;v+=.1){
  const x=e.axis==='x'?e.fixed:v,z=e.axis==='z'?e.fixed:v,dx=e.axis==='x'?.00001:0,dz=e.axis==='z'?.00001:0;
  worst=Math.max(worst,difference(color(x-dx,z-dz,season),color(x+dx,z+dz,season)));samples++;
 }console.log(worst<.001?'PASS':'FAIL',season,e.name,{worst,samples});if(worst>=.001)failures++;}
 let worstSlope=0;for(const x of [-8,-6,-4,-2])for(const z of [-3,-1,0])worstSlope=Math.max(worstSlope,difference(color(x,z,season,.19999),color(x,z,season,.20001)));
 console.log(worstSlope<.001?'PASS':'FAIL',season,'slope .20',worstSlope);if(worstSlope>=.001)failures++;
}
// Verify the palette cache actually used by the rendered mesh consumes the tested evaluator.
const terrain=createTerrain(new THREE.Scene()),mesh=terrain.group.getObjectByName('DioramaTerrainMesh')as THREE.Mesh;
const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal'),c=mesh.geometry.getAttribute('color');
let maxCacheError=0;
for(const season of ['spring','summer','autumn','winter']as Season[]){terrain.updateSeason(season,1);for(let i=0;i<mesh.geometry.userData.topVertexCount;i+=53){const expected=new THREE.Color();evaluateSurfaceColor(p.getX(i),p.getY(i),p.getZ(i),new THREE.Vector3().fromBufferAttribute(n,i),season,expected);maxCacheError=Math.max(maxCacheError,difference(expected,new THREE.Color(c.getX(i),c.getY(i),c.getZ(i))));}}
console.log(maxCacheError<.00002?'PASS':'FAIL','Actual four-season mesh color cache matches evaluator',maxCacheError);if(maxCacheError>=.00002)failures++;
terrain.dispose();if(failures)process.exit(1);
