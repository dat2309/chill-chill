import * as T from 'three';
import { box, material, rod, Batch, transform } from '../../core/miniature';
import { BUILDINGS } from './config';
export function createArchitecture(parent: T.Group) {
    const trim = material(0x404955), dark = material(0x202b37), walls = [0x67616c, 0x4f656b, 0x5e5964, 0x626b65];
    const frontBatch = new Batch(), frontWindow = new T.MeshStandardMaterial({ color: 0x768895, emissive: 0x5a777c, emissiveIntensity: .28 });
    const signs: T.Mesh[] = [], halos: T.Mesh[] = [], supports: T.Mesh[] = [];
    const glowUniform = { value: 1 };
    const haloMat = new T.ShaderMaterial({ uniforms: { uGlow: glowUniform }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `varying vec2 vUv;uniform float uGlow;void main(){vec2 p=(vUv-.5)*2.;float a=exp(-dot(p,p)*3.5)*smoothstep(1.,.35,length(p))*.15*uGlow;gl_FragColor=vec4(.12,.7,1.,a);}` });
    for (let i = 0; i < BUILDINGS.length; i++) {
        const b = BUILDINGS[i], side = Math.sign(b.x);
        box(parent, 'alley-building', b.x, b.h / 2 + .08, b.z, 3.2, b.h, 3.35, material(walls[i % 4]));
        box(parent, 'roof-parapet', b.x, b.h + .15, b.z, 3.4, .2, 3.55, trim);
        for (let level = 0; level < Math.floor(b.h / 1.6); level++)
            for (const dz of [-.83, .83]) {
                box(parent, 'window-recess', b.x - side * 1.615, 1.1 + level * 1.5, b.z + dz, .045, .65, .7, dark);
                box(parent, 'window-light', b.x - side * 1.645, 1.1 + level * 1.5, b.z + dz, .025, .53, .57, new T.MeshStandardMaterial({ color: i % 2 ? 0x6e9b9e : 0xab9969, emissive: i % 2 ? 0x3a6f75 : 0x8c6634, emissiveIntensity: .45 }));
            }
        box(parent, 'shop-door', b.x - side * 1.62, .95, b.z, .05, 1.7, .9, dark);
        for (let level = 0; level < Math.floor(b.h / 1.6); level++)
            for (const dx of [-.75, .75])
                frontBatch.add('end-facade-windows', new T.BoxGeometry(.65, .64, .035), frontWindow, transform(b.x + dx, 1.1 + level * 1.5, b.z + 1.697));
        box(parent, 'air-conditioner', b.x - side * 1.83, b.h - 1, b.z + .9, .42, .43, .6, trim);
        const color = i % 2 ? 0xff5dba : 0x42deef, signMat = new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.8, roughness: .4 });
        const sign = box(parent, 'neon-sign', b.x - side * 1.82, 2.8 + (i % 2) * .6, b.z - 1, .12, 1.5, .72, signMat);
        signs.push(sign);
        const frame = box(parent, 'sign-frame', b.x - side * 1.73, sign.position.y, b.z - 1, .09, 1.65, .86, dark);
        const symbol = new T.Mesh(new T.TorusGeometry(.22, .035, 6, 18), new T.MeshBasicMaterial({ color: 0xe9faff }));
        symbol.rotation.y = Math.PI / 2;
        symbol.position.set(sign.position.x - side * .073, sign.position.y + .22, sign.position.z);
        parent.add(symbol);
        for (const yy of [-.15, -.36])
            box(parent, 'sign-symbol', symbol.position.x, sign.position.y + yy, symbol.position.z, .02, .05, .32, new T.MeshBasicMaterial({ color: 0xe9faff }));
        const halo = new T.Mesh(new T.PlaneGeometry(2.5, 3), haloMat);
        halo.rotation.y = -side * Math.PI / 2;
        halo.position.set(sign.position.x - side * .09, sign.position.y, sign.position.z);
        parent.add(halo);
        halos.push(halo);
    }
    frontBatch.finish(parent);
    // Catenary-like wires attach at the roof edges; no unanchored line endpoints.
    for (let i = 0; i < 6; i++) {
        const z = -6 + i * 2.25, h = 5.4 + (i % 2) * .35;
        const curve = new T.CatmullRomCurve3([new T.Vector3(-3.2, h, z), new T.Vector3(0, h - .6, z + .18), new T.Vector3(3.2, h + .1, z)]);
        const m = new T.Mesh(new T.TubeGeometry(curve, 24, .018, 4, false), dark);
        parent.add(m);
        for (const x of [-3.2, 3.2])
            rod(parent, new T.Vector3(x, h, z), new T.Vector3(x, h - 1, z), .04, trim);
    }
    box(parent, 'noodle-counter', -2.45, .68, 6.5, .85, 1.2, 2.2, material(0x915d3f));
    box(parent, 'noodle-awning', -2.38, 2.2, 6.5, 2.0, .1, 3.2, material(0x3d7781));
    for (const z of [5, 8])
        supports.push(box(parent, 'awning-post', -1.43, 1.12, z, .065, 2.14, .065, trim));
    for (let j = 0; j < 4; j++) {
        const bowl = new T.Mesh(new T.TorusGeometry(.13, .045, 6, 12), material(0xe8d6a5));
        bowl.rotation.x = Math.PI / 2;
        bowl.position.set(-2.1, 1.31, 5.8 + j * .4);
        parent.add(bowl);
    }
    box(parent, 'vending-machine', 2.35, .95, 6.5, .8, 1.75, 1, dark);
    box(parent, 'vending-light', 1.93, 1.1, 6.5, .035, 1.15, .75, new T.MeshStandardMaterial({ color: 0x79ced5, emissive: 0x5ebfcc, emissiveIntensity: 1.2 }));
    const drone = new T.Group();
    box(drone, 'drone-body', 0, 0, 0, .5, .15, .32, trim);
    const batch = new Batch();
    for (const x of [-.3, .3])
        for (const z of [-.25, .25])
            batch.add('drone-rotors', new T.TorusGeometry(.16, .025, 4, 12), material(0xadb9c2), transform(x, .04, z));
    batch.finish(drone);
    parent.add(drone);
    const wetMaterials = new Map<T.MeshStandardMaterial, {
        color: T.Color;
        roughness: number;
    }>();
    parent.traverse(o => { if (o instanceof T.Mesh && o.material instanceof T.MeshStandardMaterial && o.material.emissiveIntensity === 1 && o.material.emissive.getHex() === 0)
        wetMaterials.set(o.material, { color: o.material.color.clone(), roughness: o.material.roughness }); });
    let previousWet = -1;
    return { signs, halos, glowUniform, supports, drone, update(time: number, rain: number, glow: boolean, wet = rain) { if (Math.abs(wet - previousWet) > .0001) {
            for (const [m, base] of wetMaterials) {
                m.color.copy(base.color).multiplyScalar(1 - wet * .12);
                m.roughness = base.roughness * (1 - wet * .24);
            }
            previousWet = wet;
        } glowUniform.value = glow ? 1 : 0; for (let i = 0; i < signs.length; i++) {
            const m = signs[i].material as T.MeshStandardMaterial;
            m.emissiveIntensity = 1.7 + .18 * Math.sin(time * .7 + i * 2.1);
            halos[i].visible = glow;
        } drone.position.set(Math.sin(time * .09) * 1.5, 6.7 + Math.sin(time * .3) * .1, Math.sin(time * .065) * 6); drone.rotation.y = Math.cos(time * .065) * .3; } };
}
