import * as T from 'three';
import { box, material, roof, rod } from '../../core/miniature';
export function createArchitecture(parent: T.Group) {
    const wood = material(0x8d6543), roofMat = material(0x795b4e), wall = material(0xb6a071), dark = material(0x364950);
    const supports: T.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
        const x = -9 + i * 4.4, z = -6.5, h = 1.6 + (i % 2) * .3;
        box(parent, 'stilt-floor', x, 1.0, z, 3.2, .16, 2, wood);
        for (const dx of [-1.4, 1.4])
            for (const dz of [-.8, .8])
                supports.push(box(parent, 'stilt-foundation', x + dx, .205, z + dz, .12, 1.43, .12, wood));
        box(parent, 'river-house', x, 1.08 + h / 2, z, 2.9, h, 1.8, wall);
        roof(parent, x, 1.08 + h, z, 3.4, 2.4, .66, roofMat);
        box(parent, 'open-door', x, 1.65, z + .913, .55, 1.15, .03, dark);
        for (const dx of [-.92, .92]) {
            box(parent, 'shutter-window', x + dx, 2, z + .92, .55, .55, .04, dark);
        }
        box(parent, 'riverside-deck', x, .9, z + 1.5, 3.1, .12, .85, wood);
        for (const dx of [-1.4, 1.4])
            box(parent, 'deck-support', x + dx, .17, z + 1.5, .11, 1.34, .11, wood);
    }
    // Narrow monkey bridge along the bank, with real rails and supports.
    for (let i = 0; i < 12; i++)
        box(parent, 'monkey-bridge-plank', -3 + i * .5, .7, -4.75, .52, .09, .48, wood);
    for (const x of [-3, 0, 2.5]) {
        rod(parent, new T.Vector3(x, -.45, -4.5), new T.Vector3(x, 1.4, -4.5), .045, wood);
    }
    rod(parent, new T.Vector3(-3, 1.4, -4.5), new T.Vector3(2.5, 1.4, -4.5), .035, wood);
    return { supports };
}
