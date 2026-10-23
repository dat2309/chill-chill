import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** A normalized tree made of connected wood and separate needle-bearing sprays, never a closed crown. */
export function createBranchCrown(coastal: boolean, variant: number) {
  const wood: THREE.BufferGeometry[] = [], positions:number[]=[],indices:number[]=[],colors:number[]=[],snow:number[]=[];
  let seed=1931+variant*337+(coastal?1703:0);
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const axis=new THREE.Vector3(0,1,0);
  const stem=(y:number)=>new THREE.Vector3(Math.sin(y*2+variant)*y*y*(coastal?.10:.035),y,Math.cos(y*2+variant)*y*y*.025);
  function stick(a:THREE.Vector3,b:THREE.Vector3,r0:number,r1:number){
    const radial = coastal ? 4 : 3;
    const g=new THREE.CylinderGeometry(r1,r0,a.distanceTo(b),radial,1);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(axis,b.clone().sub(a).normalize()));g.translate((a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2);wood.push(g);
  }
  const stemSteps = coastal ? 8 : 6;
  for(let i=0;i<stemSteps;i++)stick(stem(i/stemSteps),stem((i+1)/stemSteps),.065*(1-i/(stemSteps+1)),.065*(1-(i+1)/(stemSteps+1)));
  function blade(base:THREE.Vector3,direction:THREE.Vector3,length:number,width:number,tint:number,cover=.78){
    const side=new THREE.Vector3(-direction.z,0,direction.x).normalize().multiplyScalar(width);
    const tip=base.clone().addScaledVector(direction,length),mid=base.clone().lerp(tip,.48),ridge=mid.clone().add(new THREE.Vector3(0,.014,0));
    const points=[base,mid.clone().sub(side),ridge,mid.clone().add(side),tip],start=positions.length/3;
    for(const p of points){positions.push(p.x,p.y,p.z);colors.push(.70+tint*.20,.82+tint*.16,.66+tint*.20);snow.push(cover)}
    // Up-facing folded blades; their back faces remain evergreen under snow.
    for(let t of [[0,2,1],[0,3,2],[1,2,4],[2,3,4]])indices.push(...t.map(i=>i+start));
  }
  const levels=coastal?5+(variant%2):5;
  for(let level=0;level<levels;level++){
    const y=(coastal?.30:.23)+level*(coastal?.12:.135)+(coastal?(random()-.5)*.035:0),branches=(coastal?3:(3+(level+variant)%2));
    for(let branch=0;branch<branches;branch++){
      const angle=branch/branches*Math.PI*2+level*1.73+variant*.61+(random()-.5)*(coastal?.8:.35);
      const envelope=coastal?.62*(.72+.40*Math.sin((level+1)/(levels+1)*Math.PI)):1.02*(1-level/(levels+.3));
      const length=envelope*(.78+random()*.30);
      const dir=new THREE.Vector3(Math.cos(angle),0,Math.sin(angle));
      const a=stem(y),knee=a.clone().addScaledVector(dir,length*.47).add(new THREE.Vector3(0,-.025,0));
      const tip=a.clone().addScaledVector(dir,length).add(new THREE.Vector3(0,(coastal?.04-.08*(1-y):.045)+random()*.025,0));
      stick(a,knee,.023*(1-level/(levels+2)),.014);stick(knee,tip,.014,.004);
      const twigs=coastal?4:3;
      for(let twig=0;twig<twigs;twig++){
        const u=.28+twig*(coastal?.13:.18),start=knee.clone().lerp(tip,u);
        const sideSign=twig%2?1:-1,sideDir=dir.clone().applyAxisAngle(axis,sideSign*(.55+random()*.35));
        const reach=(coastal?.22:.24)*(1-u*.35),end=start.clone().addScaledVector(sideDir,reach).add(new THREE.Vector3(0,coastal?-.015:.025,0));
        stick(start,end,.005,.0018);
        const needles=coastal?5:4;
        for(let n=0;n<needles;n++){
          const t=n/(needles-1),base=start.clone().lerp(end,t);
          const out=sideDir.clone().applyAxisAngle(axis,(n%2?1:-1)*.70);out.y=coastal?-.50:.06;out.normalize();
          blade(base,out,coastal?.23:.15,coastal?.015:.034,random(),n%5===0?.20:.78);
        }
      }
      blade(tip,dir,.11,.025,random());
    }
  }
  // Young terminal shoots keep the leader botanical rather than an exposed straight spike.
  for(const y of [.94,.98])for(let i=0;i<4;i++){
    const angle=i*Math.PI/2+variant*.7,dir=new THREE.Vector3(Math.cos(angle),coastal?-.30:.25,Math.sin(angle)).normalize();
    blade(stem(y),dir,coastal?.11:.085,coastal?.012:.022,.75,.65);
  }
  const timber=mergeGeometries(wood)!;wood.forEach(g=>g.dispose());timber.computeBoundingBox();timber.computeBoundingSphere();
  const foliage=new THREE.BufferGeometry();foliage.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));foliage.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));foliage.setAttribute('vegSnowCover',new THREE.Float32BufferAttribute(snow,1));foliage.setIndex(indices);foliage.computeVertexNormals();foliage.computeBoundingBox();foliage.computeBoundingSphere();
  return {wood:timber,foliage};
}
