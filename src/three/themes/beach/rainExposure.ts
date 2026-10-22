import * as THREE from 'three';
import { BUNGALOW_SPOTS, PIER_CONFIG, getTerrainHeight } from './shoreline';

/** Keep the complete deck footprint above terrain without moving the bungalow in XZ. */
export function getBungalowFloorHeight(spot: {x:number;z:number;rotationY:number}, height=getTerrainHeight): number {
  const matrix=new THREE.Matrix4().compose(new THREE.Vector3(spot.x,0,spot.z),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),spot.rotationY),new THREE.Vector3(1,1,1));
  let highest=-Infinity;const p=new THREE.Vector3();
  for(let ix=0;ix<=8;ix++)for(let iz=0;iz<=8;iz++){
    p.set(-1.05+ix*2.1/8,0,-1.05+iz*2.1/8).applyMatrix4(matrix);
    highest=Math.max(highest,height(p.x,p.z));
  }
  return Math.max(height(spot.x,spot.z)+.45,highest+.14);
}

/** Compact veranda access; only its lower landing follows terrain, the house remains unchanged. */
export function getBungalowAccess(spot:{x:number;z:number;rotationY:number;accessOffsetX?:number},height=getTerrainHeight){
  const floorTop=getBungalowFloorHeight(spot,height)+.04,run=.22,centerX=spot.accessOffsetX??0;
  const transform=new THREE.Matrix4().makeRotationY(spot.rotationY).setPosition(spot.x,0,spot.z);
  const point=new THREE.Vector3();let count=5,landing=0;
  for(let pass=0;pass<8;pass++){
    let highest=-Infinity;
    for(let ix=0;ix<=8;ix++)for(let iz=0;iz<=4;iz++){
      point.set(centerX-.4+ix*.1,0,1.05+(count-1)*run+iz*run/4).applyMatrix4(transform);
      highest=Math.max(highest,height(point.x,point.z));
    }
    landing=highest+.14;
    const next=Math.max(3,Math.min(7,Math.ceil((floorTop-landing)/.20)));
    if(next===count)break;count=next;
  }
  const rise=(floorTop-landing)/count;
  return {floorTop,run,count,rise,centerX,treads:Array.from({length:count},(_,i)=>({z:1.05+(i+.5)*run,top:floorTop-(i+1)*rise}))};
}

const covers = BUNGALOW_SPOTS.map(spot => ({ ...spot,
  cos: Math.cos(spot.rotationY), sin: Math.sin(spot.rotationY),
  floor: getBungalowFloorHeight(spot), access:getBungalowAccess(spot),
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
    for(const tread of spot.access.treads)if(Math.abs(lx-spot.access.centerX)<=.40001&&Math.abs(lz-tread.z)<=spot.access.run/2+.00001)height=Math.max(height,tread.top);
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
    const floor = getBungalowFloorHeight(spot), access=getBungalowAccess(spot);
    const c = Math.cos(spot.rotationY), s = Math.sin(spot.rotationY);
    return `{
      vec2 d = p - vec2(${spot.x.toFixed(8)},${spot.z.toFixed(8)});
      vec2 local = vec2(${c.toFixed(9)}*d.x-(${s.toFixed(9)})*d.y,${s.toFixed(9)}*d.x+${c.toFixed(9)}*d.y);
      float edge = max(abs(local.x)/${(1.65/Math.SQRT2*1.15).toFixed(9)},abs(local.y+.15)/${(1.65/Math.SQRT2*1.05).toFixed(9)});
      if(edge <= 1.0) height=max(height,${(floor+2.33).toFixed(8)}-1.2*edge);
      if(abs(local.x)<=1.05 && abs(local.y)<=1.05) height=max(height,${(floor+.04).toFixed(8)});
      ${access.treads.map(t=>`if(abs(local.x-(${access.centerX.toFixed(8)}))<=.40001 && abs(local.y-(${t.z.toFixed(8)}))<=.11001) height=max(height,${t.top.toFixed(8)});`).join('\n')}
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
