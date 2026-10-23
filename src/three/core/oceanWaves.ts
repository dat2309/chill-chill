/** Shared analytical swell from the coastal water model; sheltered rivers use a lower effective wind. */
export function getOceanWaveElevation(x: number, z: number, t: number, w: number) { return (Math.sin(z * 1.75 - t * 1.6) * .045 + Math.cos(x * 1.15 + z * .85 - t * 2.1) * .025 + Math.sin(x * 2.2 - z * 1.3 + t * 3) * .012) * w; }
export const OCEAN_WAVES_GLSL = `float oceanWave(vec2 p,float t,float w){return (sin(p.y*1.75-t*1.6)*.045+cos(p.x*1.15+p.y*.85-t*2.1)*.025+sin(p.x*2.2-p.y*1.3+t*3.0)*.012)*w;}`;
