import { BUNGALOW_SPOTS, PIER_CONFIG, getTerrainHeight } from './shoreline';

const covers = BUNGALOW_SPOTS.map(spot => ({ ...spot,
  cos: Math.cos(spot.rotationY), sin: Math.sin(spot.rotationY),
  floor: getTerrainHeight(spot.x,spot.z)+.45,
}));
const umbrellaTop = getTerrainHeight(-3.3,.3)+1.47;
const umbrellaNormals = Array.from({length:8},(_,i)=>{
  const angle=Math.PI/8+i*Math.PI/4;
  return {x:Math.sin(angle)/(.85*Math.cos(Math.PI/8)),z:Math.cos(angle)/(.85*Math.cos(Math.PI/8))};
});

/** Same pyramid, yaw and deck dimensions as architecture.ts. Returns the first rain hit. */
export function getBeachCoverHeight(x: number, z: number): number {
  let height = -Infinity;
  for (const spot of covers) {
    const dx = x - spot.x, dz = z - spot.z;
    const c = spot.cos, s = spot.sin;
    const lx = c * dx - s * dz, lz = s * dx + c * dz;
    const edge = Math.max(Math.abs(lx) / (1.65 / Math.SQRT2 * 1.15), Math.abs(lz + .15) / (1.65 / Math.SQRT2 * 1.05));
    const floor = spot.floor;
    if (edge <= 1) height = Math.max(height, floor + 2.33 - 1.2 * edge);
    if (Math.abs(lx) <= 1.05 && Math.abs(lz) <= 1.05) height = Math.max(height, floor + .04);
    if (Math.abs(lx) <= .4 && Math.abs(lz - 1.25) <= .2) height = Math.max(height, floor - .14);
  }
  if (Math.abs(x - PIER_CONFIG.startX) <= PIER_CONFIG.width / 2 && z >= PIER_CONFIG.startZ && z <= PIER_CONFIG.endZ) {
    height = Math.max(height, PIER_CONFIG.deckElevation + .04);
  }
  // The eight-sided beach umbrella is also a rain shelter.
  const ux=x+3.35, uz=z-.3;
  let umbrellaEdge=-Infinity;
  for(const n of umbrellaNormals)umbrellaEdge=Math.max(umbrellaEdge,ux*n.x+uz*n.z);
  if(umbrellaEdge<=1)height=Math.max(height,umbrellaTop-.4*umbrellaEdge);
  return height;
}

// Generated from the same dimensions and constants, including terrain-based floor elevations.
export const BEACH_COVER_GLSL = `
float beachCoverHeight(vec2 p) {
  float height = -1000.0;
  ${BUNGALOW_SPOTS.map(spot => {
    const floor = getTerrainHeight(spot.x, spot.z) + .45;
    const c = Math.cos(spot.rotationY), s = Math.sin(spot.rotationY);
    return `{
      vec2 d = p - vec2(${spot.x.toFixed(8)},${spot.z.toFixed(8)});
      vec2 local = vec2(${c.toFixed(9)}*d.x-(${s.toFixed(9)})*d.y,${s.toFixed(9)}*d.x+${c.toFixed(9)}*d.y);
      float edge = max(abs(local.x)/${(1.65/Math.SQRT2*1.15).toFixed(9)},abs(local.y+.15)/${(1.65/Math.SQRT2*1.05).toFixed(9)});
      if(edge <= 1.0) height=max(height,${(floor+2.33).toFixed(8)}-1.2*edge);
      if(abs(local.x)<=1.05 && abs(local.y)<=1.05) height=max(height,${(floor+.04).toFixed(8)});
      if(abs(local.x)<=.4 && abs(local.y-1.25)<=.2) height=max(height,${(floor-.14).toFixed(8)});
    }`;
  }).join('\n')}
  if(abs(p.x-(${PIER_CONFIG.startX.toFixed(8)}))<=${(PIER_CONFIG.width/2).toFixed(8)} && p.y>=${PIER_CONFIG.startZ.toFixed(8)} && p.y<=${PIER_CONFIG.endZ.toFixed(8)}) height=max(height,${(PIER_CONFIG.deckElevation+.04).toFixed(8)});
  vec2 umbrella=p-vec2(-3.35,.3);
  float umbrellaEdge=-1000.0;
  for(int i=0;i<8;i++){
    float angle=0.3926990817+float(i)*0.7853981634;
    umbrellaEdge=max(umbrellaEdge,dot(umbrella,vec2(sin(angle),cos(angle)))/0.7852976026);
  }
  if(umbrellaEdge<=1.0)height=max(height,${(getTerrainHeight(-3.3,.3)+1.47).toFixed(9)}-.4*umbrellaEdge);
  return height;
}
`;
