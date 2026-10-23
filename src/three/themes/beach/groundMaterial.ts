import { MathUtils } from 'three';
import { SimplexNoise2D } from '../../core/noise';
import { getDistanceToShore, getTerrainHeight } from './shoreline';

export interface GroundWeights { sand:number; soil:number; rock:number }
/** Shared dry-color, wetness and drainage field. Soil denotes the coastal lawn substrate. */
export function getGroundWeights(x:number,z:number):GroundWeights {
  const dist=getDistanceToShore(x,z),height=getTerrainHeight(x,z),eps=.18;
  const dx=(getTerrainHeight(x+eps,z)-getTerrainHeight(x-eps,z))/(2*eps);
  const dz=(getTerrainHeight(x,z+eps)-getTerrainHeight(x,z-eps))/(2*eps);
  const slope=1-1/Math.sqrt(1+dx*dx+dz*dz);
  const patch=SimplexNoise2D(x*.20+7,z*.20-3)*.85+SimplexNoise2D(x*.34-2,z*.34+5)*.22;
  const lobe=(cx:number,cz:number,rx:number,rz:number)=>Math.exp(-Math.pow((x-cx)/rx,2)-Math.pow((z-cz)/rz,2));
  // Granite belongs to the two headlands and the small central spit, never an X half-plane.
  const outcrop=Math.max(lobe(7.7,-.7,2.9,3.3),lobe(-8.6,-.5,1.7,2.5),lobe(.1,.6,1.05,1.7),MathUtils.smoothstep(lobe(7.4,-6.5,3.0,3.2),.15,.65));
  const rock=MathUtils.smoothstep(dist,.65,2.1)*MathUtils.clamp(outcrop*.96+MathUtils.smoothstep(slope,.14,.48)*.65,0,1);
  const lawn=MathUtils.smoothstep(dist+patch,2.7,5.3)*MathUtils.smoothstep(height,.85,1.65)
    *(1-MathUtils.smoothstep(slope,.10,.38));
  const soil=lawn*(1-rock);
  return {sand:1-rock-soil,soil,rock};
}
