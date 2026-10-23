import * as THREE from 'three';

// Shared shader path for visible surfaces and shadow maps. Roots are in group space.
export function createVegetationWeather() {
  const uniforms = {
    vegTime: { value: 0 }, vegWind: { value: 0 }, vegWet: { value: 0 },
    vegRain: { value: 0 }, vegSnow: { value: 0 }, vegDensity: { value: 1 },
  };
  const owned: THREE.Material[] = [];
  function attach(mesh: THREE.Mesh, softness: number, rootAt?: (i: number) => THREE.Vector3, deciduous = false, tip = false, articulation?: {stem:number; joint:(i:number)=>THREE.Vector3}) {
    // Geometry can be shared by other meshes with different roots.
    mesh.geometry = mesh.geometry.clone();
    if(!mesh.geometry.getAttribute('vegSnowCover'))mesh.geometry.setAttribute('vegSnowCover',new THREE.Float32BufferAttribute(new Float32Array(mesh.geometry.getAttribute('position').count).fill(1),1));
    const inst = mesh as THREE.InstancedMesh;
    const count = inst.isInstancedMesh ? inst.count : mesh.geometry.attributes.position.count;
    const roots = new Float32Array(count * 3);
    const centers = new Float32Array(count * 3);
    const joints = new Float32Array(count * 3);
    const m = new THREE.Matrix4();
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      if (rootAt) p.copy(rootAt(i));
      else if (inst.isInstancedMesh) { inst.getMatrixAt(i, m); p.setFromMatrixPosition(m); }
      else p.set(0, 0, 0);
      p.toArray(roots, i * 3);
      if (inst.isInstancedMesh) { inst.getMatrixAt(i, m); p.setFromMatrixPosition(m); }
      else p.set(0, 0, 0);
      p.toArray(centers, i * 3);
      (articulation?.joint(i)??new THREE.Vector3().fromArray(roots,i*3)).toArray(joints,i*3);
    }
    mesh.geometry.setAttribute('vegRoot', inst.isInstancedMesh
      ? new THREE.InstancedBufferAttribute(roots, 3) : new THREE.BufferAttribute(roots, 3));
    mesh.geometry.setAttribute('vegCenter', inst.isInstancedMesh
      ? new THREE.InstancedBufferAttribute(centers, 3) : new THREE.BufferAttribute(centers, 3));
    mesh.geometry.setAttribute('vegJoint',inst.isInstancedMesh?new THREE.InstancedBufferAttribute(joints,3):new THREE.BufferAttribute(joints,3));
    const declarations = `
attribute vec3 vegRoot, vegCenter, vegJoint;
attribute float vegSnowCover;
varying float vegSnowExposure;
uniform float vegTime, vegWind, vegSnow, vegDensity;
varying float vegUp;
vec3 vegetationDeform(vec3 p, vec3 root) {
  float h = ${tip ? 'length(p.xz - root.xz)' : 'abs(p.y - root.y)'};
  float phase = root.x * .63 + root.z * .41 + ${tip ? 'dot(p.xz - root.xz, vec2(.37,.21))' : '0.0'};
  float gust = .64 + .22 * sin(vegTime * .63 - phase * .35) + .14 * sin(vegTime * 1.13 + phase);
  float sway = .65 + .35 * sin(vegTime * 1.25 - phase);
  float bend = min(h*h, 9.0) * ${softness.toFixed(5)} * vegWind * gust * sway / (1.0 + vegSnow * 1.6);
  p.x += bend;
  return p;
}
${articulation ? `vec3 vegetationDeformJoint(vec3 p,vec3 root,vec3 joint) {
  vec3 delta=vegetationDeform(p,root)-p;
  float h2=min(pow(abs(p.y-root.y),2.0),9.0);
  float child2=min(pow(max(p.y-joint.y,0.0),2.0),9.0);
  float stemRatio=${(articulation?.stem/softness).toFixed(6)};
  return p+delta*(stemRatio+(1.0-stemRatio)*child2/max(h2,.0001));
}` : ''}
`;
    const deform = `
vec4 vp = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  vp = instanceMatrix * vp;
#endif
vec3 root = (modelMatrix * vec4(vegRoot, 1.0)).xyz;
${deciduous ? `float leafThreshold = .08 + .65 * fract(sin(dot(vegCenter.xz, vec2(12.9898,78.233))) * 43758.5453);
vp.xyz = vegCenter + (vp.xyz-vegCenter) * smoothstep(leafThreshold, leafThreshold + .25, vegDensity);` : ''}
vp = modelMatrix * vp;
${tip ? `vec3 crown = (modelMatrix * vec4(vegCenter, 1.0)).xyz;
float trunkPhase = root.x * .63 + root.z * .41;
float trunkGust = .64 + .22 * sin(vegTime * .63 - trunkPhase * .35) + .14 * sin(vegTime * 1.13 + trunkPhase);
float trunkSway = .65 + .35 * sin(vegTime * 1.25 - trunkPhase);
vp.xyz = vegetationDeform(vp.xyz, crown);
vp.x += min(pow(abs(crown.y-root.y),2.0),9.0) * .009 * vegWind * trunkGust * trunkSway / (1.0 + vegSnow * 1.6);` : articulation ? 'vp.xyz = vegetationDeformJoint(vp.xyz,root,(modelMatrix*vec4(vegJoint,1.0)).xyz);' : 'vp.xyz = vegetationDeform(vp.xyz, root);'}
vec4 mvPosition = viewMatrix * vp;
gl_Position = projectionMatrix * mvPosition;
vec3 vn = normal;
#ifdef USE_INSTANCING
vn /= max(vec3(dot(instanceMatrix[0].xyz, instanceMatrix[0].xyz),
  dot(instanceMatrix[1].xyz, instanceMatrix[1].xyz), dot(instanceMatrix[2].xyz, instanceMatrix[2].xyz)), vec3(.00001));
vn = mat3(instanceMatrix) * vn;
#endif
vegUp = clamp(normalize(mat3(modelMatrix) * vn).y, 0.0, 1.0);
vegSnowExposure=vegSnowCover;
`;
    const material = (mesh.material as THREE.Material).clone();
    const patch = (mat: THREE.Material, surface: boolean) => {
      mat.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = declarations + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', deform);
        shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>', THREE.ShaderChunk.worldpos_vertex.replace('worldPosition = modelMatrix * worldPosition;', 'worldPosition = vp;'));
        if (surface) {
          shader.fragmentShader = 'uniform float vegWet, vegSnow, vegRain; varying float vegUp,vegSnowExposure;\n' + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
 diffuseColor.rgb *= 1.0 - vegWet * .14 - vegRain * .04;
 diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.87,.92,.95), vegSnow * vegSnowExposure * smoothstep(.35,.85,vegUp) * (gl_FrontFacing ? .85 : 0.0));`);
          if (mat instanceof THREE.MeshStandardMaterial) shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor *= 1.0 - vegWet * .28 - vegRain * .1;');
        }
      };
      mat.customProgramCacheKey = () => `vegetation-${softness}-${deciduous}-${tip}-${surface}-${articulation?.stem??0}`;
      owned.push(mat);
    };
    patch(material, true);
    mesh.material = material;
    mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: material.side });
    patch(mesh.customDepthMaterial, false);
    mesh.customDistanceMaterial = new THREE.MeshDistanceMaterial({ side: material.side });
    patch(mesh.customDistanceMaterial, false);
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();
    if (inst.isInstancedMesh) { inst.computeBoundingBox(); inst.computeBoundingSphere(); }
    const box = inst.isInstancedMesh ? inst.boundingBox : mesh.geometry.boundingBox;
    const sphere = inst.isInstancedMesh ? inst.boundingSphere : mesh.geometry.boundingSphere;
    if (box) { box.min.x -= .05; box.max.x += .45; box.min.y -= .12; box.max.y += .12; box.min.z -= .1; box.max.z += .1; }
    if (sphere) sphere.radius += .55;
    mesh.userData.vegetationWeather = { uniforms, softness, deciduous, tip, stem:articulation?.stem };
    geometries.push(mesh.geometry);
  }
  const geometries: THREE.BufferGeometry[] = [];
  return {
    uniforms, attach,
    update(dt: number, elapsed: number, wind: number, rain = 0, snow = 0, density = 1) {
      const step = Math.max(0, Number.isFinite(dt) ? dt : 0);
      uniforms.vegTime.value += step * (1 - .35 * snow);
      uniforms.vegWind.value = THREE.MathUtils.clamp(Number.isFinite(wind) ? wind : 0, 0, 1.2);
      uniforms.vegWet.value += (rain - uniforms.vegWet.value) * (1 - Math.exp(-step * (rain > uniforms.vegWet.value ? 1.8 : .12)));
      uniforms.vegRain.value = rain;
      uniforms.vegSnow.value = snow;
      uniforms.vegDensity.value = density;
    },
    dispose() { owned.forEach(m => m.dispose()); geometries.forEach(g => g.dispose()); },
  };
}
