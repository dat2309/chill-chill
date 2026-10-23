import * as THREE from 'three';
import {getGroundWeights, GroundWeights} from './groundMaterial';
export {getGroundWeights} from './groundMaterial';
import { BeachTerrainSystem } from './terrain';
import { isInsideBeachFootprint } from './footprint';
import { BEACH_COVER_GLSL, getBeachCoverHeight } from './rainExposure';

export type GroundMaterial = 'sand' | 'soil' | 'rock';
const DRAIN = { sand: .10, soil: .035, rock: .018 };
export const MAX_PUDDLE_SLOPE = .08;
const DRY = { sand: .014, soil: .007, rock: .009 };
export function getGroundMaterial(x: number, z: number): GroundMaterial {
  // Discrete label is only for basin eligibility/reporting, never for shading.
  const w=getGroundWeights(x,z);
  return w.soil>Math.max(w.sand,w.rock) ? 'soil' : w.rock>w.sand ? 'rock' : 'sand';
}
function integrate(value: number, input: number, loss: number, dt: number): number {
  const rate = input + loss;
  return rate > 0 ? input / rate + (value - input / rate) * Math.exp(-rate * dt) : value;
}
export function createGroundMoisture() {
  const moisture = { sand: 0, soil: 0, rock: 0 };
  return {
    moisture,
    update(dt: number, rain: number) {
      const step = Number.isFinite(dt) ? Math.max(0, dt) : 0;
      const r = Number.isFinite(rain) ? THREE.MathUtils.clamp(rain, 0, 1) : 0;
      for (const type of ['sand','soil','rock'] as const) moisture[type] = integrate(moisture[type], r * .8, DRY[type], step);
    },
  };
}

interface Basin {
  x: number; z: number; floor: number; level: number; radius: number; area: number;
  type: GroundMaterial; weights:GroundWeights; drain:number; amount: number; mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
}

/** Flood connected depressions on the actual rendered triangles; never carve/flatten terrain. */
export function createBeachSurfaceWeather(parent: THREE.Group, terrain: BeachTerrainSystem, architecture: THREE.Group) {
  const group = new THREE.Group(); group.name = 'BeachRainSurface'; parent.add(group);
  const ground = createGroundMoisture();
  const uniforms = {
    uGroundWet: { value: new THREE.Vector3() }, uGroundRain: { value: 0 },
    uRainTime: { value: 0 }, uSeaLevel: { value: .44 },
    uPondRims: { value: Array.from({ length: 8 }, () => new THREE.Vector4(1000,1000,.01,0)) },
    uPondSky: { value: new THREE.Color(0xb7d3dd) },
    uPondSun: { value: new THREE.Vector3(-.4,.8,.3).normalize() },
  };
  const basins: Basin[] = [];
  const geo = terrain.surfaceGeometry;
  const pos = geo.getAttribute('position'); const index = geo.index!;
  const count = terrain.surfaceVertexCount;
  const neighbors = Array.from({ length: count }, () => new Set<number>());
  const triangles = Array.from({ length: count }, () => [] as number[]);
  const valid = new Uint8Array(count);
  const point = (i: number) => new THREE.Vector3(pos.getX(i),pos.getY(i),pos.getZ(i));
  for (let i=0;i<count;i++) {
    const x=pos.getX(i), z=pos.getZ(i), type=getGroundMaterial(x,z);
    // Leave lawns/grass untouched; retain water in exposed sand and granite pockets.
    valid[i] = +(type !== 'soil' && getGroundWeights(x,z).soil < .18 && terrain.getSlopeAt(x,z) <= MAX_PUDDLE_SLOPE && pos.getY(i) > .54 && getBeachCoverHeight(x,z) === -Infinity && isInsideBeachFootprint(x,z,.25));
  }
  for(let t=0;t<index.count;t+=3) {
    const a=index.getX(t), b=index.getX(t+1), c=index.getX(t+2);
    if(a>=count||b>=count||c>=count)continue;
    for(const [v,n1,n2] of [[a,b,c],[b,c,a],[c,a,b]]) { neighbors[v].add(n1); neighbors[v].add(n2); triangles[v].push(t); }
  }
  const minima: number[] = [];
  for(let i=0;i<count;i++) if(valid[i] && terrain.getSlopeAt(pos.getX(i),pos.getZ(i)) <= .015 && neighbors[i].size && [...neighbors[i]].every(n=>pos.getY(n)>=pos.getY(i))) minima.push(i);
  minima.sort((a,b)=>pos.getY(a)-pos.getY(b));
  for(const seed of minima) {
    if(basins.length>=8)break;
    const root=point(seed);
    if(basins.some(b=>Math.hypot(b.x-root.x,b.z-root.z)<b.radius+.65))continue;
    // Minimax flood finds the lowest spill path, including roofs, domain and material boundaries.
    const frontier=[{i:seed,h:root.y}]; const visited=new Set<number>();
    let spill=root.y+.08;
    while(frontier.length) {
      let best=0; for(let j=1;j<frontier.length;j++)if(frontier[j].h<frontier[best].h)best=j;
      const node=frontier.splice(best,1)[0]; if(visited.has(node.i))continue; visited.add(node.i);
      const x=pos.getX(node.i),z=pos.getZ(node.i);
      if(!valid[node.i] || Math.hypot(x-root.x,z-root.z)>1.4) { spill=Math.min(spill,node.h); break; }
      if(node.h>=root.y+.08)break;
      for(const n of neighbors[node.i])if(!visited.has(n))frontier.push({i:n,h:Math.max(node.h,pos.getY(n))});
    }
    const level=root.y+Math.min(.065,(spill-root.y)*.96);
    if(level-root.y<.007)continue;
    const flooded=new Set<number>(), queue=[seed], faces=new Set<number>();
    while(queue.length) {
      const v=queue.pop()!; if(flooded.has(v)||pos.getY(v)>=level)continue;
      flooded.add(v); triangles[v].forEach(t=>faces.add(t));
      for(const n of neighbors[v])if(valid[n]&&!flooded.has(n)&&pos.getY(n)<level)queue.push(n);
    }
    const vertices:number[]=[], beds:number[]=[]; let area=0,radius=0,invalidBasin=false;
    for(const t of faces) {
      let polygon=[point(index.getX(t)),point(index.getX(t+1)),point(index.getX(t+2))];
      // Exact intersection with each rendered terrain triangle at the maximum pond level.
      const clipped:THREE.Vector3[]=[];
      for(let i=0;i<3;i++) {
        const a=polygon[i],b=polygon[(i+1)%3],inside=a.y<level;
        if(inside)clipped.push(a);
        if(inside!==(b.y<level))clipped.push(a.clone().lerp(b,(level-a.y)/(b.y-a.y)));
      }
      polygon=clipped;
      if(polygon.some(p=>getBeachCoverHeight(p.x,p.z)>-Infinity||!isInsideBeachFootprint(p.x,p.z,.15)||(getGroundMaterial(p.x,p.z)==='soil'||getGroundWeights(p.x,p.z).soil>=.18))) { invalidBasin=true;break; }
      for(let i=1;i+1<polygon.length;i++) {
        const a=polygon[0],b=polygon[i],c=polygon[i+1];
        area+=Math.abs((b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x))*.5;
        for(const p of [a,b,c]) { vertices.push(p.x,level+.002,p.z); beds.push(p.y); radius=Math.max(radius,Math.hypot(p.x-root.x,p.z-root.z)); }
      }
    }
    if(invalidBasin||area<.025||area>1.8)continue;
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('aPondBed',new THREE.Float32BufferAttribute(beds,1));geometry.computeVertexNormals();geometry.computeBoundingSphere();geometry.boundingSphere!.radius+=level-root.y;
    const material=new THREE.ShaderMaterial({ transparent:true,depthWrite:false, uniforms:{...uniforms,uPondLevel:{value:root.y},uPondFloor:{value:root.y}},
      vertexShader:`attribute float aPondBed; uniform float uPondLevel; varying vec3 vPondPosition; varying float vPondBed;
      void main(){vec3 p=position;p.y=uPondLevel+.002;vPondPosition=p;vPondBed=aPondBed;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
      fragmentShader:`uniform float uGroundRain,uRainTime,uPondLevel,uPondFloor,uSeaLevel;uniform vec3 uPondSky,uPondSun;
      varying vec3 vPondPosition;varying float vPondBed;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){float depth=uPondLevel-vPondBed;
        if(depth<=.0005||vPondPosition.y<=uSeaLevel+.015)discard;
        vec2 cell=floor(vPondPosition.xz*5.0);vec2 local=fract(vPondPosition.xz*5.0)-.5;
        float age=fract(uRainTime*1.7+hash(cell));float radius=length(local);
        float ring=sin((radius-age*.7)*42.0)*exp(-pow((radius-age*.7)*12.0,2.0))*(1.0-age)*uGroundRain;
        vec3 N=normalize(vec3(local.x*ring*.045,1.0,local.y*ring*.045));vec3 V=normalize(cameraPosition-vPondPosition);
        float fresnel=.08+.45*pow(1.0-max(dot(N,V),0.0),5.0);
        vec3 col=mix(vec3(.20,.34,.34),uPondSky,fresnel+.20);
        col+=vec3(.55)*pow(max(dot(N,normalize(V+uPondSun)),0.0),80.0)*.3;
        float alpha=smoothstep(.0005,.006,depth)*smoothstep(.001,.007,uPondLevel-uPondFloor)*.78;
        gl_FragColor=vec4(col,alpha);
      }`,
    });
    const mesh=new THREE.Mesh(geometry,material);mesh.name='RainPuddle';mesh.renderOrder=2;mesh.visible=false;group.add(mesh);
    const weights=getGroundWeights(root.x,root.z);
    const drain=weights.sand*DRAIN.sand+weights.soil*DRAIN.soil+weights.rock*DRAIN.rock;
    basins.push({x:root.x,z:root.z,floor:root.y,level,radius,area,type:getGroundMaterial(root.x,root.z),weights,drain,amount:0,mesh});
  }

  const patched = new Set<THREE.Material>();
  function patch(mesh: THREE.Mesh) {
    if(Array.isArray(mesh.material))return;
    const mat=mesh.material;
    if(!(mat instanceof THREE.MeshStandardMaterial)||patched.has(mat))return;
    patched.add(mat);
    const top = mesh.geometry === geo;
    if (top) {
      const allowed=new Float32Array(pos.count);allowed.fill(1,0,count);
      geo.setAttribute('aRainSurface',new THREE.BufferAttribute(allowed,1));
      const types=new Float32Array(pos.count*3);
      for(let i=0;i<count;i++) {
        const weights=getGroundWeights(pos.getX(i),pos.getZ(i));
        types.set([weights.sand,weights.soil,weights.rock],i*3);
      }
      geo.setAttribute('aRainMaterial',new THREE.BufferAttribute(types,3));
    }
    const rockSurface = mesh instanceof THREE.InstancedMesh && mesh.parent === terrain.group;
    mat.onBeforeCompile=shader=>{
      Object.assign(shader.uniforms,uniforms);
      shader.vertexShader=`varying vec3 vRainWorld,vRainMaterial;varying float vRainAllowed;${top ? 'attribute float aRainSurface;attribute vec3 aRainMaterial;' : ''}\n`+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
        vec4 rainPosition=vec4(transformed,1.0);
        #ifdef USE_INSTANCING
        rainPosition=instanceMatrix*rainPosition;
        #endif
        vRainWorld=(modelMatrix*rainPosition).xyz;vRainAllowed=${top ? 'aRainSurface' : '1.0'};
        vRainMaterial=${top ? 'aRainMaterial' : rockSurface ? 'vec3(0.0,0.0,1.0)' : 'vec3(0.0,1.0,0.0)'};`);
      shader.fragmentShader=`varying vec3 vRainWorld,vRainMaterial;varying float vRainAllowed; uniform vec3 uGroundWet,uPondSky;uniform float uGroundRain,uSeaLevel;uniform vec4 uPondRims[8];\n${BEACH_COVER_GLSL}\n`+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float wet = dot(uGroundWet,vRainMaterial);
        float exposure = step(beachCoverHeight(vRainWorld.xz)-.025,vRainWorld.y)*vRainAllowed;
        wet *= exposure;
        float rim=0.0;
        for(int i=0;i<8;i++)rim=max(rim,(1.0-smoothstep(uPondRims[i].z*.5,uPondRims[i].z*1.4,distance(vRainWorld.xz,uPondRims[i].xy)))*uPondRims[i].w);
        wet=max(wet,rim*.9*exposure);
        float rainGrain=.94+.06*sin(vRainWorld.x*31.0)*sin(vRainWorld.z*27.0);
        diffuseColor.rgb *= 1.0-wet*.22*rainGrain;
        // A restrained sky tint on wet outdoor surfaces supplements direct specular lighting.
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.28,.39,.43),wet*.045);`);
      shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor, max(.20,roughnessFactor*.48),wet);');
      shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        float wetSheen=pow(1.0-max(dot(normal,normalize(vViewPosition)),0.0),4.0);
        reflectedLight.indirectSpecular+=uPondSky*wet*(.015+.08*wetSheen);`);
    };
    mat.customProgramCacheKey=()=> `beach-ground-rain-v4-${top}-${rockSurface}`;mat.needsUpdate=true;
  }
  terrain.group.traverse(obj=>{if(obj instanceof THREE.Mesh)patch(obj);});
  architecture.traverse(obj=>{if(obj instanceof THREE.Mesh)patch(obj);});

  return {
    group, basins: basins as readonly Basin[], moisture: ground.moisture,
    update(dt: number, elapsed: number, rainIntensity: number, seaLevel: number, sky?: THREE.Color, sun?: THREE.Vector3) {
      const step=Number.isFinite(dt)?Math.max(0,dt):0;
      const rain=Number.isFinite(rainIntensity)?THREE.MathUtils.clamp(rainIntensity,0,1):0;
      ground.update(step,rain);
      uniforms.uGroundWet.value.set(ground.moisture.sand,ground.moisture.soil,ground.moisture.rock);
      uniforms.uGroundRain.value=rain;uniforms.uRainTime.value=Number.isFinite(elapsed)?elapsed:0;uniforms.uSeaLevel.value=Number.isFinite(seaLevel)?seaLevel:.44;
      if(sky)uniforms.uPondSky.value.copy(sky);if(sun)uniforms.uPondSun.value.copy(sun);
      basins.forEach((b,i)=>{
        b.amount=integrate(b.amount,rain*.12,b.drain,step);
        b.mesh.material.uniforms.uPondLevel.value=b.floor+(b.level-b.floor)*b.amount;
        b.mesh.visible=b.amount>.015 && b.floor>seaLevel+.025;
        uniforms.uPondRims.value[i].set(b.x,b.z,b.radius,Math.max(b.amount,(b.weights.sand*ground.moisture.sand+b.weights.soil*ground.moisture.soil+b.weights.rock*ground.moisture.rock)*.65));
      });
    },
    dispose(){basins.forEach(b=>{b.mesh.geometry.dispose();b.mesh.material.dispose();});group.clear();parent.remove(group);},
  };
}
export type BeachSurfaceWeather = ReturnType<typeof createBeachSurfaceWeather>;
