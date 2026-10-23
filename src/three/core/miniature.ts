import * as T from 'three';
import { Batch, transform, beam } from './procedural';
export { Batch, transform, beam };
export const material = (color: T.ColorRepresentation, roughness = .8) => new T.MeshStandardMaterial({ color, roughness });
export function box(parent: T.Group, name: string, x: number, y: number, z: number, w: number, h: number, d: number, mat: T.Material) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.name = name; m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; }
export function rod(parent: T.Group, a: T.Vector3, b: T.Vector3, r: number, mat: T.Material) { const m = new T.Mesh(new T.CylinderGeometry(r * .7, r, a.distanceTo(b), 6), mat); m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize()); m.castShadow = true; parent.add(m); return m; }
export function roof(parent: T.Group, x: number, y: number, z: number, w: number, d: number, rise: number, mat: T.Material) { for (const s of [-1, 1]) {
    const m = box(parent, 'pitched-roof', x + s * w / 4, y + rise / 2, z, Math.hypot(w / 2, rise), .10, d, mat);
    m.rotation.z = -s * Math.atan2(rise, w / 2);
} }
export function lights(parent: T.Group, sky0: number, sky1: number, sun0: number, sun1: number) { const hemi = new T.HemisphereLight(sky0, 0x514936, 2); const sun = new T.DirectionalLight(sun0, 3); sun.position.set(-7, 13, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: .5, far: 55 }); sun.shadow.bias = -.001; parent.add(hemi, sun); const a = new T.Color(sky0), b = new T.Color(sky1), c = new T.Color(sun0), d = new T.Color(sun1); let previous = '', applied = ''; const container = typeof document !== 'undefined' ? (document.querySelector<HTMLElement>('.canvas-container') ?? document.body) : null; const initial = container?.style.background ?? ''; return { hemi, sun, update(blend: number, night = false) { hemi.color.copy(a).lerp(b, blend); sun.color.copy(c).lerp(d, blend); sun.intensity = night ? 1.1 : 2.3 + blend; sun.position.set(-8 + blend * 9, 8 + blend * 9, 6); const css = `linear-gradient(180deg, ${hemi.color.getStyle()}, ${sun.color.getStyle()})`; if (parent.parent instanceof T.Scene) {
        parent.parent.background = null;
        if (container && previous !== css) {
            container.style.background = css;
            previous = css;
            applied = container.style.background;
        }
    } }, dispose() { if (container && container.style.background === applied)
        container.style.background = initial; } }; }
/** Bounded deterministic particles, with analytic collision against actual roof/ground profiles. */
export function precipitation(parent: T.Group, count: number, snow: boolean, heightAt: (x: number, z: number) => number) { const data = new Float32Array(count * 3), geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(data, 3)); const mat = new T.PointsMaterial({ color: snow ? 0xe9f4ff : 0xa9cfef, size: snow ? .065 : .033, transparent: true, opacity: 0, depthWrite: false }); const mesh = new T.Points(geo, mat); mesh.name = snow ? 'snow-particles' : 'rain-particles'; mesh.frustumCulled = false; parent.add(mesh); return { mesh, update(time: number, intensity: number, wind: number) { mat.opacity = intensity * (snow ? .85 : .7); mesh.visible = intensity > .002; for (let i = 0; i < count; i++) {
        const x = ((i * 3.719 + time * wind * .35) % 22 + 22) % 22 - 11, z = ((i * 7.179) % 16) - 8, ground = heightAt(x, z);
        data[i * 3] = x;
        data[i * 3 + 1] = ground + ((i * .171 - time * (snow ? .6 : 5)) % 10 + 10) % 10;
        data[i * 3 + 2] = z;
    } geo.attributes.position.needsUpdate = true; } }; }
export function skyMist(parent: T.Group) { const uniforms = { uTime: { value: 0 }, uAmount: { value: 0 } }; const mat = new T.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragmentShader: `uniform float uTime,uAmount;varying vec2 vUv;void main(){vec2 p=vUv*2.-1.;float edge=exp(-dot(p,p)*4.)*smoothstep(1.,.5,length(p));float w=.55+.25*sin(p.x*5.+uTime*.12)+.2*cos(p.y*7.-uTime*.08);gl_FragColor=vec4(.92,.88,.81,edge*w*uAmount*.18);}` }); const mesh = new T.Mesh(new T.PlaneGeometry(23, 15), mat); mesh.rotation.x = -Math.PI / 2; mesh.position.y = .6; mesh.name = 'valley-mist'; parent.add(mesh); return { mat, update(time: number, amount: number) { uniforms.uTime.value = time; uniforms.uAmount.value = amount; } }; }
