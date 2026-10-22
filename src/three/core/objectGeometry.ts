import * as THREE from 'three';

/** Thin closed layer following the supplied triangles. Coverage is clipped continuously on each face. */
export function createSurfaceCoating(source: THREE.BufferGeometry, options: {
  thickness: number;
  coverage?: (point: THREE.Vector3) => number;
  face?: (normal: THREE.Vector3) => boolean;
  normal?: (point: THREE.Vector3, faceNormal: THREE.Vector3) => THREE.Vector3;
}): THREE.BufferGeometry {
  const geometry = source.index ? source.toNonIndexed() : source;
  const p = geometry.getAttribute('position'); const vertices: number[] = [];
  const append = (a: THREE.Vector3,b: THREE.Vector3,c: THREE.Vector3) => { for(const v of [a,b,c])vertices.push(v.x,v.y,v.z); };
  for(let i=0;i<p.count;i+=3){
    const tri=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,i+j));
    const n=new THREE.Triangle(...tri as [THREE.Vector3,THREE.Vector3,THREE.Vector3]).getNormal(new THREE.Vector3());
    if(options.face&&!options.face(n))continue;
    let polygon=tri;
    if(options.coverage){
      polygon=[];
      for(let j=0;j<3;j++){
        const a=tri[j],b=tri[(j+1)%3],da=options.coverage(a),db=options.coverage(b);
        if(da>=0)polygon.push(a);
        if((da>=0)!==(db>=0))polygon.push(a.clone().lerp(b,da/(da-db)));
      }
    }
    if(polygon.length<3)continue;
    const normals=polygon.map(v=>options.normal?.(v,n)??n);
    const top=polygon.map((v,j)=>v.clone().addScaledVector(normals[j],options.thickness));
    const bottom=polygon.map((v,j)=>v.clone().addScaledVector(normals[j],.001));
    for(let j=1;j+1<polygon.length;j++){append(top[0],top[j],top[j+1]);append(bottom[0],bottom[j+1],bottom[j]);}
    for(let j=0;j<polygon.length;j++){const k=(j+1)%polygon.length;append(bottom[j],bottom[k],top[j]);append(top[j],bottom[k],top[k]);}
  }
  const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));result.computeVertexNormals();
  if(geometry!==source)geometry.dispose();return result;
}

/** Close a fabric shell at its actual boundary; preserve the original exterior triangles/colors. */
export function createFabricShell(surface: THREE.BufferGeometry, thickness: number): THREE.BufferGeometry {
  const p=surface.getAttribute('position'),colors=surface.getAttribute('color');
  const positions:number[]=[],tints:number[]=[];
  const normal=(v: THREE.Vector3)=>new THREE.Vector3(v.x/(.72*.72),v.y/(.62*.62),v.z/(.72*.72)).normalize();
  const key=(v:THREE.Vector3)=>[v.x,v.y,v.z].map(n=>n.toFixed(6)).join(',');
  const boundary=new Map<string,{a:THREE.Vector3;b:THREE.Vector3;color:THREE.Color;count:number}>();
  const append=(v:THREE.Vector3,c:THREE.Color)=>{positions.push(v.x,v.y,v.z);tints.push(c.r,c.g,c.b);};
  for(let i=0;i<p.count;i+=3){
    const outer=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,i+j));
    const inner=outer.map(v=>v.clone().addScaledVector(normal(v),-thickness));
    const c=new THREE.Color().fromArray(colors.array,i*3);
    outer.forEach(v=>append(v,c));[inner[0],inner[2],inner[1]].forEach(v=>append(v,c));
    for(let j=0;j<3;j++){
      const a=outer[j],b=outer[(j+1)%3],id=[key(a),key(b)].sort().join('|');
      const edge=boundary.get(id);if(edge)edge.count++;else boundary.set(id,{a,b,color:c,count:1});
    }
  }
  for(const {a,b,color,count} of boundary.values())if(count===1){
    const ai=a.clone().addScaledVector(normal(a),-thickness),bi=b.clone().addScaledVector(normal(b),-thickness);
    [a,ai,b,b,ai,bi].forEach(v=>append(v,color));
  }
  const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));result.setAttribute('color',new THREE.Float32BufferAttribute(tints,3));result.computeVertexNormals();return result;
}

/** Sink a rock until at least half of its underside contacts soil across its actual footprint. */
export function groundRock(geometry:THREE.BufferGeometry, transform:THREE.Object3D, height:(x:number,z:number)=>number, burial=.025):void {
  transform.updateMatrix();const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal'),v=new THREE.Vector3();const offsets:number[]=[];
  for(let i=0;i<p.count;i++)if(!n||n.getY(i)<-.15){
    v.fromBufferAttribute(p,i).applyMatrix4(transform.matrix);
    offsets.push(height(v.x,v.z)-v.y);
  }
  offsets.sort((a,b)=>a-b);
  if(offsets.length)transform.position.y+=offsets[Math.floor(offsets.length*.55)]-burial;
  transform.updateMatrix();
}
