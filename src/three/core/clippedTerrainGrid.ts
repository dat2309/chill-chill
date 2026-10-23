import * as THREE from 'three';

/** Uniform cells clipped against a counterclockwise convex display polygon; the returned rim is shared by walls/base. */
export function createClippedTerrainGrid(outline:readonly THREE.Vector2[],columns:number,rows:number,domain?:{minX:number;maxX:number;minZ:number;maxZ:number}){
  const minX=Math.min(...outline.map(p=>p.x)),maxX=Math.max(...outline.map(p=>p.x)),minZ=Math.min(...outline.map(p=>p.y)),maxZ=Math.max(...outline.map(p=>p.y));
  const points:THREE.Vector2[]=[],triangles:number[]=[],ids=new Map<string,number>();
  function inside(p:THREE.Vector2){for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];if((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x)<-1e-9)return false}return true}
  function vertex(p:THREE.Vector2){const x=Math.round(p.x*1e6)/1e6,z=Math.round(p.y*1e6)/1e6,key=x+','+z;let index=ids.get(key);if(index===undefined){index=points.length;points.push(new THREE.Vector2(x,z));ids.set(key,index)}return index}
  const bounds=domain??{minX,maxX,minZ,maxZ};
  for(let iz=0;iz<rows;iz++)for(let ix=0;ix<columns;ix++){
    const x0=bounds.minX+(bounds.maxX-bounds.minX)*ix/columns,x1=bounds.minX+(bounds.maxX-bounds.minX)*(ix+1)/columns,z0=bounds.minZ+(bounds.maxZ-bounds.minZ)*iz/rows,z1=bounds.minZ+(bounds.maxZ-bounds.minZ)*(iz+1)/rows;
    if(x1<minX||x0>maxX||z1<minZ||z0>maxZ)continue;
    let polygon=[new THREE.Vector2(x0,z0),new THREE.Vector2(x1,z0),new THREE.Vector2(x1,z1),new THREE.Vector2(x0,z1)];
    if(!polygon.every(inside))for(let edge=0;edge<outline.length&&polygon.length;edge++){
      const a=outline[edge],b=outline[(edge+1)%outline.length],clipped:THREE.Vector2[]=[];
      const distance=(p:THREE.Vector2)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
      for(let i=0;i<polygon.length;i++){
        const p=polygon[i],q=polygon[(i+1)%polygon.length],dp=distance(p),dq=distance(q);
        if(dp>=-1e-10)clipped.push(p);
        if((dp>=-1e-10)!==(dq>=-1e-10))clipped.push(p.clone().lerp(q,dp/(dp-dq)));
      }polygon=clipped;
    }
    const vertices=polygon.map(vertex).filter((v,i,array)=>array.indexOf(v)===i);
    // Remove redundant collinear corners before triangulating, including sub-float slivers at the rim.
    let changed=true;while(changed&&vertices.length>3){changed=false;for(let i=0;i<vertices.length;i++){
      const a=points[vertices[(i+vertices.length-1)%vertices.length]],b=points[vertices[i]],c=points[vertices[(i+1)%vertices.length]];
      if(Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))<1e-8){vertices.splice(i,1);changed=true;break;}
    }}
    for(let i=1;i+1<vertices.length;i++){
      const a=points[vertices[0]],b=points[vertices[i]],c=points[vertices[i+1]];
      if(Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))>1e-8)triangles.push(vertices[0],vertices[i+1],vertices[i]);
    }
  }
  const used=new Set(triangles),rim:THREE.Vector2[]=[];
  for(const index of used){const p=points[index];for(let i=0;i<outline.length;i++){
    const a=outline[i],b=outline[(i+1)%outline.length],dx=b.x-a.x,dz=b.y-a.y,length2=dx*dx+dz*dz;
    const t=((p.x-a.x)*dx+(p.y-a.y)*dz)/length2;
    if(t>=-1e-6&&t<=1+1e-6&&Math.abs(dx*(p.y-a.y)-dz*(p.x-a.x))/Math.sqrt(length2)<1e-6){rim.push(p);break;}
  }}
  const center=outline.reduce((sum,p)=>sum.add(p),new THREE.Vector2()).multiplyScalar(1/outline.length);
  rim.sort((a,b)=>Math.atan2(a.y-center.y,a.x-center.x)-Math.atan2(b.y-center.y,b.x-center.x));
  return {points,triangles,boundary:rim};
}
