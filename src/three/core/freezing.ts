import {MathUtils} from 'three';
/** Depth/flow affect order only; complete winter always seals every potential. */
export function iceAmount(potential:number,progress:number){if(!Number.isFinite(progress))return 0;if(progress>=.94)return 1;const start=.04+(1-MathUtils.clamp(Number.isFinite(potential)?potential:0,0,1))*.60;return MathUtils.smoothstep(MathUtils.clamp(progress,0,1),start,start+.30);}
export const ICE_GLSL=`float iceAmount(float potential,float progress){if(progress>=.94)return 1.;float start=.04+(1.-clamp(potential,0.,1.))*.60;return smoothstep(start,start+.30,clamp(progress,0.,1.));}`;
