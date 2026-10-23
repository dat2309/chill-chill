import * as T from 'three';
import { lights } from '../../core/miniature';
export function createLighting(parent: T.Group) { const base = lights(parent, 0x171b34, 0x8c688d, 0x668fa6, 0xffb8bb); base.hemi.intensity = 1.2; for (const [x, z, c] of [[-2.7, -4, 0xff519d], [2.7, 2, 0x39c8de], [-2.7, 6, 0xf79a66]]) {
    const p = new T.PointLight(c, 8, 7, 2);
    p.position.set(x, 2.6, z);
    parent.add(p);
} return { ...base, update(blend: number) { base.update(blend, true); base.hemi.intensity = 1.5 + blend * .35; base.hemi.color.setRGB(.55 + blend * .15, .65 + blend * .1, .85); base.hemi.groundColor.setHex(0x57546a); base.sun.intensity = .8 + blend * .8; } }; }
