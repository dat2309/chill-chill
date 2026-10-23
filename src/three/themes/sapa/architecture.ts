import * as T from 'three';
import { box, roof, material, Batch, transform } from '../../core/miniature';
import { terrainHeight } from './config';
export function createArchitecture(parent: T.Group) {
    const wood = material(0x76513b), wall = material(0xb69a70), thatch = material(0x817353), supports: T.Mesh[] = [];
    for (const [x, z, w, d, h] of [[-6.6, -6.8, 2.3, 1.4, 1.3], [2, -6.8, 2.5, 1.4, 1.4], [7, 1.5, 1.1, .7, .8]]) {
        let floor = -Infinity;
        for (const dx of [-w / 2, w / 2])
            for (const dz of [-d / 2, d / 2])
                floor = Math.max(floor, terrainHeight(x + dx, z + dz));
        floor += .45;
        box(parent, 'stilt-deck', x, floor, z, w, .12, d, wood);
        for (const dx of [-w * .43, w * .43])
            for (const dz of [-d * .4, d * .4]) {
                const ground = terrainHeight(x + dx, z + dz);
                supports.push(box(parent, 'stilt-support', x + dx, (ground + floor - .06) / 2 - .015, z + dz, .09, floor - .06 - ground + .03, .09, wood));
            }
        box(parent, 'stilt-house-wall', x, floor + .06 + h / 2, z, w * .88, h, d * .88, wall);
        roof(parent, x, floor + .06 + h, z, w + .35, d + .4, .65, thatch);
        const shape = new T.Shape();
        shape.moveTo(-w * .44, 0);
        shape.lineTo(w * .44, 0);
        shape.lineTo(0, .58);
        shape.closePath();
        const attic = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: d * .88, bevelEnabled: false }), wall);
        attic.position.set(x, floor + .06 + h, z - d * .44);
        attic.castShadow = true;
        parent.add(attic);
        box(parent, 'door', x, floor + .6, z + d * .445, .35, .9, .025, wood);
    }
    const batch = new Batch(), animal = material(0x514b43);
    for (const [x, z] of [[-7, 5.8], [-5.9, 5.95]]) {
        const y = terrainHeight(x, z);
        batch.add('buffalo-body', new T.SphereGeometry(1, 10, 7), animal, transform(x, y + .36, z, .4, .25, .2));
        batch.add('buffalo-head', new T.SphereGeometry(1, 8, 6), animal, transform(x + .39, y + .4, z, .18, .19, .17));
        for (const dx of [-.24, .24])
            for (const dz of [-.13, .13])
                batch.add('buffalo-legs', new T.CylinderGeometry(.035, .045, .3, 5), animal, transform(x + dx, y + .15, z + dz));
        for (const s of [-1, 1])
            batch.add('buffalo-horns', new T.TorusGeometry(.12, .018, 4, 8, Math.PI), material(0xb7b197), transform(x + .46, y + .55, z + s * .14, .7, .7, .7));
    }
    batch.finish(parent);
    return { supports };
}
