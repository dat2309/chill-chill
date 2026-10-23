import * as THREE from 'three';
import {createBeachTerrain} from '../src/three/themes/beach/terrain';
import {createBeachArchitecture} from '../src/three/themes/beach/architecture';
import {createBeachSurfaceWeather} from '../src/three/themes/beach/surfaceWeather';
import {getTerrainHeight} from '../src/three/themes/beach/shoreline';
import {isInsideBeachFootprint} from '../src/three/themes/beach/footprint';
import {getGroundWeights,createGroundMoisture} from '../src/three/themes/beach/surfaceWeather';
import {computeRawTerrainHeight} from '../src/three/themes/garden/terrain';
import {isInsideGardenFootprint} from '../src/three/themes/garden/footprint';
let failures=0;
function check(ok:boolean,name:string,detail:unknown){console.log(ok?'PASS':'FAIL',name,detail);if(!ok)failures++;}
const h=(x:number,z:number)=>computeRawTerrainHeight(x,z).height;
check(Math.abs(h(.09263,-.42)-h(.09261,-.42))<.001,'Reported Garden branch discontinuity over 0.00002',{left:h(.09261,-.42),right:h(.09263,-.42)});
// Sweep the entire interior, including every former bearing mask and branch seam,
// in both directions. Refine steep cells to distinguish finite slopes from steps.
let worstFine=0,worstSlope=0,worstBend=0,where:unknown;let samples=0;
for(let iz=0;iz<=400;iz++)for(let ix=0;ix<=500;ix++){
 const x=-10+ix*.04,z=-8+iz*.04;if(!isInsideGardenFootprint(x,z,.15))continue;
 const center=h(x,z);
 for(const [dx,dz]of [[.04,0],[0,.04]]){
  const before=h(x-dx,z-dz),after=h(x+dx,z+dz);
  worstSlope=Math.max(worstSlope,Math.abs(after-center)/.04);
  worstBend=Math.max(worstBend,Math.abs(after+before-2*center));samples++;
  if(Math.abs(after-center)>.055){
   for(let j=0;j<40;j++){
    const px=x+dx*j/40,pz=z+dz*j/40;
    const delta=Math.abs(h(px+dx/40,pz+dz/40)-h(px,pz));
    if(delta>worstFine){worstFine=delta;where=[px,pz,dx!==0?'X':'Z'];}
   }
  }
 }
}
check(worstFine<.025,'Whole-domain refined X/Z scan contains no height selection jumps',{worstFine,where,samples});
check(worstSlope<7&&worstBend<.16,'Interior slopes and slope changes stay bounded without flattening designed stream cliffs',{worstSlope,worstBend});
let westHeightJump=0;for(let z=-4;z<3;z+=.04)westHeightJump=Math.max(westHeightJump,Math.abs(getTerrainHeight(-7.00001,z)-getTerrainHeight(-6.99999,z)));
check(westHeightJump<.001,'Western Beach rock modulation has a continuous onset',westHeightJump);
let weightJump=0,wetJump=0;const moisture=createGroundMoisture();moisture.update(10,1);moisture.update(40,0);
for(let z=-6;z<3;z+=.04)for(const x of [-7.18,-7,-6.82,-1.4,-1.38,-1.2,-1.02,1.02,1.2,1.38,1.4,5,5.82,6,6.18]){
 const a=getGroundWeights(x-.00001,z),b=getGroundWeights(x+.00001,z);
 for(const key of ['sand','soil','rock']as const)weightJump=Math.max(weightJump,Math.abs(a[key]-b[key]));
 const wet=(w:typeof a)=>w.sand*moisture.moisture.sand+w.soil*moisture.moisture.soil+w.rock*moisture.moisture.rock;
 wetJump=Math.max(wetJump,Math.abs(wet(a)-wet(b)));
}
check(weightJump<.001&&wetJump<.001,'Displayed material and moisture do not jump across former coordinate thresholds',{weightJump,wetJump});
let weightsValid=true,maxWeightStep=0,materialSamples=0;
for(let z=-7.8;z<7.8;z+=.08)for(let x=-9.8;x<9.8;x+=.08){
 if(!isInsideBeachFootprint(x,z,.2))continue;
 const w=getGroundWeights(x,z);materialSamples++;
 if(Object.values(w).some(v=>!Number.isFinite(v)||v<0||v>1)||Math.abs(w.sand+w.soil+w.rock-1)>1e-12)weightsValid=false;
 for(const [dx,dz]of [[.002,0],[0,.002]]){
  const n=getGroundWeights(x+dx,z+dz);
  for(const key of ['sand','soil','rock']as const)maxWeightStep=Math.max(maxWeightStep,Math.abs(w[key]-n[key]));
 }
}
check(weightsValid&&maxWeightStep<.025,'Full Beach material transition field is normalized, finite and continuous in X/Z',{materialSamples,maxWeightStep});
const root=new THREE.Group(),terrain=createBeachTerrain(root),architecture=createBeachArchitecture(root,terrain.getHeightAt),weather=createBeachSurfaceWeather(root,terrain,architecture.group);
const positions=terrain.surfaceGeometry.getAttribute('position'),weights=terrain.surfaceGeometry.getAttribute('aRainMaterial');
let shaderMatches=true,mixtures=0;
for(let i=0;i<terrain.surfaceVertexCount;i++){
 const w=getGroundWeights(positions.getX(i),positions.getZ(i));
 if(Math.max(Math.abs(weights.getX(i)-w.sand),Math.abs(weights.getY(i)-w.soil),Math.abs(weights.getZ(i)-w.rock))>1e-6)shaderMatches=false;
 if(w.soil>.1&&w.soil<.9)mixtures++;
}
check(shaderMatches&&mixtures>100,'Actual rendered wetness attribute consumes shared soft material weights',{mixtures});
check(weather.basins.length>=3&&weather.basins.every(b=>b.weights.soil<.18&&Number.isFinite(b.drain)),'Standing water remains in exposed material pockets after mask changes',{basins:weather.basins.length});
weather.dispose();architecture.dispose();terrain.dispose();
// Keep relief: this guards against solving continuity by flattening the mountain or stream gorge.
const peak=h(-4.6,-6.2),meadow=h(-4.3,.05),gorgeBank=h(4.8,-6),gorgeBed=h(3,-6);
check(peak-meadow>1.5&&gorgeBank-gorgeBed>.8,'Large mountain relief and deliberate gorge cliffs remain',{peak,meadow,gorgeBank,gorgeBed});
if(failures)process.exit(1);
