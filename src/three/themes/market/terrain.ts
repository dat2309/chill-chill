import * as T from 'three';
import { material, box } from '../../core/miniature';
import { bankEdge } from './config';
export const BANK_SEGMENTS = [[-11.5, -2.9], [-1.9, 1.5], [2.5, 11.5]];
export function createTerrain(parent: T.Group) { box(parent, 'river-display-base', 0, -.7, 0, 23, .45, 16, material(0x84725d)); const banks: T.Mesh[] = [], soil = material(0x9b8060), grass = material(0x81804f); for (const [min, max] of BANK_SEGMENTS) {
    const points: T.Vector2[] = [new T.Vector2(min, -8), new T.Vector2(max, -8)];
    for (let j = 40; j >= 0; j--) {
        const x = min + (max - min) * j / 40;
        points.push(new T.Vector2(x, bankEdge(x)));
    }
    const p: number[] = [], indices: number[] = [];
    for (let j = 0; j <= 40; j++) {
        const x = min + (max - min) * j / 40;
        p.push(x, .38, -8, x, .38, bankEdge(x));
        if (j < 40) {
            const k = j * 2;
            indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    const mesh = new T.Mesh(g, grass);
    mesh.name = 'curving-riverbank';
    mesh.receiveShadow = true;
    parent.add(mesh);
    banks.push(mesh);
    const side: number[] = [], si: number[] = [];
    for (const v of points)
        side.push(v.x, -.475, v.y, v.x, .38, v.y);
    for (let j = 0; j < points.length; j++) {
        const k = j * 2, n = ((j + 1) % points.length) * 2;
        si.push(k, k + 1, n, k + 1, n + 1, n);
    }
    const wallGeo = new T.BufferGeometry();
    wallGeo.setAttribute('position', new T.Float32BufferAttribute(side, 3));
    wallGeo.setIndex(si);
    wallGeo.computeVertexNormals();
    const wall = new T.Mesh(wallGeo, soil);
    wall.name = 'riverbank-volume';
    parent.add(wall);
} return { mesh: banks[0], banks }; }
