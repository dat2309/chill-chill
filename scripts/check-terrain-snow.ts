import * as THREE from 'three';
import {createTerrain} from '../src/three/themes/garden/terrain';
const terrain=createTerrain(new THREE.Scene());terrain.updateSeason('winter',1);
const mesh=terrain.group.getObjectByName('DioramaTerrainMesh')as THREE.Mesh;
const p=mesh.geometry.getAttribute('position'),n=mesh.geometry.getAttribute('normal'),c=mesh.geometry.getAttribute('color'),idx=mesh.geometry.index!;
const count=mesh.geometry.userData.topVertexCount;let worst=0,where:unknown,samples=0;
for(let i=0;i<idx.count;i+=3)for(let j=0;j<3;j++){
 const a=idx.getX(i+j),b=idx.getX(i+(j+1)%3);if(a>=count||b>=count)continue;
 if(p.getZ(a)>-3.6||p.getZ(b)>-3.6||p.getY(a)<2.25||p.getY(b)<2.25)continue;
 if(Math.abs(n.getY(a)-n.getY(b))>.025)continue;
 const distance=new THREE.Vector3().fromBufferAttribute(p,a).distanceTo(new THREE.Vector3().fromBufferAttribute(p,b));if(distance>.14)continue;
 const colorDelta=new THREE.Vector3().fromBufferAttribute(c,a).distanceTo(new THREE.Vector3().fromBufferAttribute(c,b));
 samples++;if(colorDelta>worst){worst=colorDelta;where={a:[p.getX(a),p.getY(a),p.getZ(a),n.getY(a)],b:[p.getX(b),p.getY(b),p.getZ(b),n.getY(b)]};}
}
console.log({samples,worst,where});terrain.dispose();if(samples<100||worst>.20)throw Error('Smooth mountain faces must not acquire a hard winter snow-color contour');
