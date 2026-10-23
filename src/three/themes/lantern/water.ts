import * as THREE from 'three';
import { OCEAN_WAVES_GLSL, getOceanWaveElevation } from '../../core/oceanWaves';
import { HULL_CAVITY_GLSL } from './boats';
import { RIVER, LANTERN_COLORS } from './config';
export function createWater(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownRiver';
    parent.add(group);
    const uniforms = {
        uTime: {
            value: 0
        }, uWind: {
            value: .12
        }, uLevel: {
            value: .04
        }, uRain: {
            value: 0
        }, uFestival: {
            value: 0
        }, uLampSources: {
            value: Array.from({
                length: 52
            }, () => new THREE.Vector2())
        }, uBoatInverse: {
            value: [new THREE.Matrix4(), new THREE.Matrix4(), new THREE.Matrix4()]
        }, uRipples: {
            value: Array.from({
                length: 12
            }, () => new THREE.Vector4(0, 0, -100, 0))
        }
    };
    const geo = new THREE.PlaneGeometry(20.5, 5.2, 160, 48);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, 1.8);
    geo.computeBoundingBox();
    geo.boundingBox!.min.y = -.2;
    geo.boundingBox!.max.y = .2;
    geo.computeBoundingSphere();
    geo.boundingSphere!.radius += .2;
    const material = new THREE.ShaderMaterial({
        uniforms, vertexShader: `uniform float uTime,uWind,uLevel;varying vec3 vWorld;${OCEAN_WAVES_GLSL}void main(){vec3 p=position;p.y=uLevel+oceanWave(p.xz,uTime,uWind);vWorld=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`, fragmentShader: `uniform float uTime,uRain,uFestival;uniform vec2 uLampSources[52];uniform vec4 uRipples[12];varying vec3 vWorld;
 ${OCEAN_WAVES_GLSL}
 ${HULL_CAVITY_GLSL}
 vec3 lamp(float i){float k=mod(i,6.0);if(k<1.0)return vec3(1.,.18,.09);if(k<2.)return vec3(1.,.4,.08);if(k<3.)return vec3(1.,.75,.2);if(k<4.)return vec3(.1,.7,.4);if(k<5.)return vec3(.55,.2,.8);return vec3(1.,.8,.5);}
 void main(){if(boatCavity(vWorld))discard;vec2 p=vWorld.xz;float ripple=0.;for(int i=0;i<12;i++){float age=uTime-uRipples[i].z;float d=distance(p,uRipples[i].xy);if(age>0.&&age<4.)ripple+=sin(d*24.-age*9.)*exp(-pow((d-age*.6)*3.,2.))*exp(-age)*uRipples[i].w;}
 float grain=sin(p.x*23.+sin(p.y*7.)+uTime*1.6)*.5+.5;float rain=sin(length(fract(p*3.)-.5)*38.-uTime*10.)*uRain*.012;
 vec3 view=normalize(cameraPosition-vWorld);float fresnel=pow(1.-max(view.y,0.),4.);vec3 c=mix(vec3(.018,.09,.10),vec3(.10,.10,.20),fresnel);
 for(int i=0;i<52;i++){float fi=float(i);vec2 source=uLampSources[i];float dz=abs(p.y-source.y);float dx=p.x-source.x+sin(p.y*13.+uTime*2.+fi)*.035;float shimmer=(.55+.45*grain)*(1.+rain+ripple*.2);float glow=exp(-dx*dx*45./(1.+dz*.25))*exp(-dz*.62);c+=lamp(fi)*glow*.10*shimmer;}

 c+=vec3(.13,.18,.24)*(ripple*.12+rain);c+=vec3(.18,.20,.30)*uFestival*.12;gl_FragColor=vec4(c,1.);#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include', ';\n#include')
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = 'LanternTownWaterSurface';
    group.add(mesh);
    // The cut water edges meet the surface at the same local tide (no second overlaid plane).
    const edges = new THREE.BufferGeometry(), v: number[] = [];
    for (const x of [RIVER.minX, RIVER.maxX]) {
        const a = [x, -.48, -.8], b = [x, -.48, 4.4], c = [x, 0, 4.4], d = [x, 0, -.8];
        const points = x < 0 ? [a, d, b, b, d, c] : [a, b, d, b, c, d];
        for (const p of points)
            v.push(...p);
    }
    edges.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    edges.computeVertexNormals();
    const skirtMaterial = new THREE.MeshStandardMaterial({
        color: 0x244944, transparent: true, opacity: .78, roughness: .4
    });
    skirtMaterial.onBeforeCompile = shader => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = `uniform float uTime,uWind,uLevel;${OCEAN_WAVES_GLSL}\n` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y=position.y>-.1?uLevel+oceanWave(position.xz,uTime,uWind):-.48;');
    };
    const skirt = new THREE.Mesh(edges, skirtMaterial);
    skirt.frustumCulled = false;
    group.add(skirt);
    let pointer = 0;
    return {
        group, mesh, uniforms, update(t: number, wind: number, level: number, rain: number, festival: number) {
            uniforms.uTime.value = t;
            uniforms.uWind.value = wind;
            uniforms.uLevel.value = level;
            uniforms.uRain.value = rain;
            uniforms.uFestival.value = festival;
        }, height(x: number, z: number) {
            return uniforms.uLevel.value + getOceanWaveElevation(x, z, uniforms.uTime.value, uniforms.uWind.value);
        }, ripple(x: number, z: number, strength: number) {
            uniforms.uRipples.value[pointer++ % 12].set(x, z, uniforms.uTime.value, strength);
        }
    };
}
