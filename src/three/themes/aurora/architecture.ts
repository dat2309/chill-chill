import * as T from 'three';
import { box, roof, rod, material, Batch, transform } from '../../core/miniature';
import { CABIN_FLOOR, TENT_FLOOR, terrainHeight } from './config';
export function createArchitecture(parent: T.Group) {
    const wood = material(0x79563e), logs = material(0x9a7450), roofMat = material(0x4e5b68), snowMat = material(0xe0eaf0, .95), supports: T.Mesh[] = [], roofs: T.Mesh[] = [], snowCaps: T.Mesh[] = [];
    const floor = box(parent, 'cabin-floor', -4, CABIN_FLOOR, -3.8, 3.4, .18, 2.8, wood);
    for (const dx of [-1.45, 1.45])
        for (const dz of [-1.1, 1.1]) {
            const x = -4 + dx, z = -3.8 + dz, y = terrainHeight(x, z);
            supports.push(box(parent, 'cabin-support', x, (y + CABIN_FLOOR - .09) / 2 - .015, z, .17, CABIN_FLOOR - .09 - y + .03, .17, wood));
        }
    const batch = new Batch();
    for (let i = 0; i < 10; i++) {
        const y = CABIN_FLOOR + .18 + i * .16;
        for (const z of [-5.12, -2.48]) {
            const g = new T.CylinderGeometry(.095, .095, 3.4, 8);
            g.rotateZ(Math.PI / 2);
            batch.add('cabin-horizontal-logs', g, logs, transform(-4, y, z));
        }
        for (const x of [-5.6, -2.4]) {
            const g = new T.CylinderGeometry(.095, .095, 2.85, 8);
            g.rotateX(Math.PI / 2);
            batch.add('cabin-side-logs', g, logs, transform(x, y, -3.8));
        }
    }
    batch.finish(parent);
    const warm = new T.MeshStandardMaterial({ color: 0xffcf83, emissive: 0xffa746, emissiveIntensity: 1.5, roughness: .5 });
    for (const x of [-4.95, -3.1]) {
        box(parent, 'warm-window', x, CABIN_FLOOR + 1.0, -2.365, .65, .65, .06, warm);
        box(parent, 'window-mullion', x, CABIN_FLOOR + 1, -2.32, .04, .69, .05, wood);
        box(parent, 'window-crossbar', x, CABIN_FLOOR + 1, -2.32, .69, .04, .05, wood);
    }
    box(parent, 'cabin-door', -4, CABIN_FLOOR + .7, -2.36, .48, 1.2, .08, wood);
    const before = parent.children.length;
    roof(parent, -4, CABIN_FLOOR + 1.76, -3.8, 3.8, 3.35, 1.1, roofMat);
    for (const child of parent.children.slice(before)) {
        if (child instanceof T.Mesh) {
            roofs.push(child);
            const cap = new T.Mesh(new T.BoxGeometry((child.geometry as T.BoxGeometry).parameters.width + .13, .075, 3.30), snowMat);
            cap.name = 'cabin-roof-snow';
            cap.quaternion.copy(child.quaternion);
            cap.position.copy(child.position).add(new T.Vector3(0, .0925, 0).applyQuaternion(child.quaternion));
            cap.castShadow = cap.receiveShadow = true;
            parent.add(cap);
            snowCaps.push(cap);
        }
    }
    const shape = new T.Shape();
    shape.moveTo(-1.6, 0);
    shape.lineTo(1.6, 0);
    shape.lineTo(0, .93);
    shape.closePath();
    const attic = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: 2.64, bevelEnabled: false }), wood);
    attic.position.set(-4, CABIN_FLOOR + 1.76, -5.12);
    parent.add(attic);
    const chimneyTop = CABIN_FLOOR + 3.55;
    box(parent, 'chimney', -3.3, CABIN_FLOOR + 2.6, -4.2, .35, 1.9, .4, material(0x68747e));
    box(parent, 'chimney-cap', -3.3, chimneyTop, -4.2, .46, .1, .52, roofMat);
    box(parent, 'chimney-cap-snow', -3.3, chimneyTop + .075, -4.2, .44, .05, .5, snowMat);
    const light = new T.PointLight(0xffad56, 7, 7, 2);
    light.position.set(-4, CABIN_FLOOR + 1, -1.8);
    parent.add(light);
    // A-frame canvas, structural rails and deck; open entrance is actual open geometry.
    box(parent, 'tent-deck', 3.5, TENT_FLOOR, -3.4, 2.4, .14, 2.5, wood);
    for (const dx of [-1, 1])
        for (const dz of [-1, 1]) {
            const x = 3.5 + dx, z = -3.4 + dz, y = terrainHeight(x, z);
            supports.push(box(parent, 'tent-support', x, (y + TENT_FLOOR - .07) / 2 - .015, z, .1, TENT_FLOOR - .07 - y + .03, .1, wood));
        }
    roof(parent, 3.5, TENT_FLOOR + .1, -3.4, 2.2, 2.2, 1.15, material(0x9f7962));
    for (const z of [-4.48, -2.32])
        for (const s of [-1, 1])
            rod(parent, new T.Vector3(3.5 + s * 1.1, TENT_FLOOR + .1, z), new T.Vector3(3.5, TENT_FLOOR + 1.25, z), .04, wood);
    // Firewood rests on a cradle, with a small connected sled beside the lake.
    for (let i = 0; i < 12; i++) {
        const x = -6.2 + (i % 4) * .19, z = -2.2, y = terrainHeight(x, z) + .10 + Math.floor(i / 4) * .16;
        const m = new T.Mesh(new T.CylinderGeometry(.09, .09, .7, 7), logs);
        m.rotation.x = Math.PI / 2;
        m.position.set(x, y, z);
        m.castShadow = true;
        parent.add(m);
    }
    const sx = 5.6, sz = .3, sy = terrainHeight(sx, sz) + .07;
    for (const x of [sx - .3, sx + .3]) {
        const path = new T.CatmullRomCurve3([new T.Vector3(x, sy, sz + .65), new T.Vector3(x, sy, sz - .55), new T.Vector3(x, sy + .24, sz - .8)]);
        parent.add(new T.Mesh(new T.TubeGeometry(path, 14, .035, 5, false), wood));
    }
    for (const z of [sz - .35, sz + .35])
        box(parent, 'sled-crossmember', sx, sy + .12, z, .7, .08, .12, wood);
    box(parent, 'sled-seat', sx, sy + .22, sz, .62, .10, 1.05, logs);
    const animals = new Batch(), fur = material(0x8b8478), antler = material(0xc6bca3);
    for (let i = 0; i < 3; i++) {
        const x = 6.2 + i * .85, z = -4.8 + (i % 2) * .8, y = terrainHeight(x, z);
        animals.add('reindeer-body', new T.SphereGeometry(1, 10, 8), fur, transform(x, y + .48, z, .36, .24, .18));
        animals.add('reindeer-neck', new T.CylinderGeometry(.07, .12, .42, 6), fur, transform(x + .27, y + .67, z));
        animals.add('reindeer-head', new T.SphereGeometry(1, 8, 6), fur, transform(x + .33, y + .9, z, .16, .12, .11));
        for (const dx of [-.22, .22])
            for (const dz of [-.12, .12]) {
                const foot = terrainHeight(x + dx, z + dz);
                animals.add('reindeer-legs', new T.CylinderGeometry(.025, .035, y + .4 - foot, 5), fur, transform(x + dx, (foot + y + .4) / 2, z + dz));
            }
        for (const s of [-1, 1]) {
            const a = new T.Vector3(x + .3, y + .95, z + s * .07), b = new T.Vector3(x + .18, y + 1.23, z + s * .20);
            rod(parent, a, b, .018, antler);
            rod(parent, a.clone().lerp(b, .65), new T.Vector3(x + .4, y + 1.22, z + s * .23), .012, antler);
        }
    }
    animals.finish(parent);
    return { floor, supports, roofs, snowCaps, warm, light, chimneyTop, update(storm: number) { warm.emissiveIntensity = 1.5 + storm * .85; light.intensity = 7 + storm * 3; } };
}
