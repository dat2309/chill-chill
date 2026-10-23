import * as T from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Batch, transform, material } from '../../core/miniature';
import { createVegetationWeather } from '../../core/vegetationWeather';
/** Basal nipa palm: curved rachises and paired leaflets, with shared attachment deformation. */
function nipa() {
    const stems: T.BufferGeometry[] = [], p: number[] = [], index: number[] = [];
    for (let f = 0; f < 7; f++) {
        const a = f * Math.PI * 2 / 7, len = 1.1 + (f % 3) * .16, h = .9 + (f % 2) * .25;
        const point = (t: number) => new T.Vector3(Math.cos(a) * len * t, Math.sin(t * Math.PI * .85) * h + .12 * t, Math.sin(a) * len * t);
        for (let k = 0; k < 8; k++) {
            const aa = point(k / 8), b = point((k + 1) / 8), g = new T.CylinderGeometry(.006, .017 * (1 - k / 10), aa.distanceTo(b), 5);
            g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(aa).normalize()));
            g.translate((aa.x + b.x) / 2, (aa.y + b.y) / 2, (aa.z + b.z) / 2);
            stems.push(g);
        }
        for (let k = 0; k < 10; k++) {
            const t = .22 + k * .075, base = point(t);
            for (const s of [-1, 1]) {
                const direction = new T.Vector3(-Math.sin(a) * s, .0, Math.cos(a) * s), length = .28 + .15 * Math.sin(t * Math.PI), tip = base.clone().addScaledVector(direction, length).add(new T.Vector3(Math.cos(a) * .17, -.13, Math.sin(a) * .17)), mid = base.clone().lerp(tip, .48), side = new T.Vector3(Math.cos(a) * .045, 0, Math.sin(a) * .045), ridge = mid.clone().add(new T.Vector3(0, .018, 0)), start = p.length / 3;
                for (const v of [base, mid.clone().sub(side), ridge, mid.clone().add(side), tip])
                    p.push(v.x, v.y, v.z);
                for (const tri of [[0, 2, 1], [0, 3, 2], [1, 2, 4], [2, 3, 4]]) {
                    index.push(...tri.map(v => start + v));
                    index.push(...[...tri].reverse().map(v => start + v));
                }
            }
        }
    }
    const wood = mergeGeometries(stems)!;
    stems.forEach(g => g.dispose());
    const leaves = new T.BufferGeometry();
    leaves.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    leaves.setIndex(index);
    leaves.computeVertexNormals();
    return { wood, leaves };
}
export function createVegetation(parent: T.Group) { const batch = new Batch(), weather = createVegetationWeather(), crown = nipa(), wood = material(0x7a7950), leaf = material(0x486e39); const spots = [[-6.8, -7.2], [-6.8, -5.6], [6.4, -7.2], [6.4, -5.6], [-11.05, -7.5], [10.9, -7.5]]; for (let i = 0; i < spots.length; i++) {
    const [x, z] = spots[i], s = .27 + (i % 3) * .012;
    const m = transform(x, .38, z, s, s * (1 + (i % 2) * .2), s, i * .7);
    batch.add('nipa-stems', crown.wood, wood, m);
    batch.add('nipa-fronds', crown.leaves, leaf, m);
} const holder = new T.Group(); parent.add(holder); batch.finish(holder); holder.traverse(o => { if (o instanceof T.Mesh)
    weather.attach(o, .04); }); return { weather, update(dt: number, time: number, wind: number) { weather.update(dt, time, wind, 0); }, dispose: weather.dispose }; }
