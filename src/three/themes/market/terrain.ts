import * as T from 'three';
import { material, box } from '../../core/miniature';
import { bankEdge } from './config';
export function createTerrain(group: T.Group) { box(group, 'river-display-base', 0, -.7, 0, 23, .45, 16, material(0x84725d)); const p: number[] = [], idx: number[] = []; for (let i = 0; i <= 80; i++) {
    const x = -11.5 + i * 23 / 80;
    p.push(x, .38, -8, x, .38, bankEdge(x));
    if (i < 80) {
        const k = i * 2;
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
} const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(p, 3)); g.setIndex(idx); g.computeVertexNormals(); const mesh = new T.Mesh(g, material(0x81804f)); mesh.receiveShadow = true; mesh.name = 'curving-riverbank'; group.add(mesh); box(group, 'bank-rear-cut', 0, -.03, -7.1, 23, .8, 1.8, material(0x9b8060)); return { mesh }; }
