import * as T from 'three';
import { box, material } from '../../core/miniature';
import { contour, TERRACES } from './config';
export function ribbon(y: number, i: number, start: number, end: number) {
    const p: number[] = [], index: number[] = [];
    for (let n = 0; n <= 100; n++) {
        const x = -10 + n * .2, z = contour(x, i);
        p.push(x, y, z + start, x, y, z + end);
        if (n < 100) {
            const k = n * 2;
            index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
}
export function createTerrain(parent: T.Group) {
    box(parent, 'sapa-display-base', 0, -.35, 0, 20, .45, 16, material(0xb0916e));
    const earth = material(0x9a8451), green = material(0x6f8644), surfaces: T.Mesh[] = [], berms: T.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
        const t = TERRACES[i], m = new T.Mesh(ribbon(t.y, i, 0, 1.38), earth);
        m.name = 'field-floor-' + i;
        m.receiveShadow = true;
        parent.add(m);
        surfaces.push(m);
        const b = new T.Mesh(ribbon(t.berm, i, -.10, .035), green);
        b.name = 'field-berm-' + i;
        b.castShadow = b.receiveShadow = true;
        parent.add(b);
        berms.push(b);
        const front = new T.Mesh(ribbon(t.berm, i, 1.32, 1.4), green);
        front.name = "field-front-berm-" + i;
        parent.add(front);
        berms.push(front);
        for (const x of [-9.98, 9.98]) {
            const side = box(parent, "field-side-berm-" + i, x, t.y + .08, contour(x, i) + .69, .08, .18, 1.5, green);
            berms.push(side);
        }
        const p: number[] = [], idx: number[] = [];
        for (let j = 0; j <= 100; j++) {
            const x = -10 + j * .2, z = contour(x, i) + 1.38, next = i < 7 ? contour(x, i + 1) : 8, yn = i < 7 ? TERRACES[i + 1].berm : -.12;
            const rows = 4;
            for (let k = 0; k <= rows; k++) {
                const u = k / rows;
                p.push(x, T.MathUtils.lerp(t.y, yn, u * u * (3 - 2 * u)), T.MathUtils.lerp(z, next, u));
            }
            if (j < 100)
                for (let k = 0; k < 4; k++) {
                    const a = j * 5 + k;
                    idx.push(a, a + 1, a + 5, a + 1, a + 6, a + 5);
                }
        }
        const g = new T.BufferGeometry();
        g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        const slope = new T.Mesh(g, green);
        slope.name = 'terrace-riser-' + i;
        slope.receiveShadow = true;
        parent.add(slope);
    }
    // Explicit presentation cuts at x bounds, separate from internal terrace risers.
    for (const x of [-10, 10]) {
        const p: number[] = [x, -.12, -8, x, 4.87, -8], idx: number[] = [];
        for (let i = 0; i < 8; i++) {
            for (const z of [contour(x, i) - .1, contour(x, i) + 1.38])
                p.push(x, -.12, z, x, TERRACES[i].y, z);
        }
        p.push(x, -.12, 8, x, -.12, 8);
        for (let j = 0; j < p.length / 6 - 1; j++) {
            const k = j * 2;
            if (x > 0)
                idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
            else
                idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
        const g = new T.BufferGeometry();
        g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        const cut = new T.Mesh(g, material(0xb1966b));
        cut.name = 'sapa-side-cut';
        parent.add(cut);
    }
    const shoulder: number[] = [], si: number[] = [];
    for (let n = 0; n <= 100; n++) {
        const x = -10 + n * .2;
        shoulder.push(x, 4.87, -8, x, 4.87, contour(x, 0) - .1);
        if (n < 100) {
            const k = n * 2;
            si.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.Float32BufferAttribute(shoulder, 3));
    sg.setIndex(si);
    sg.computeVertexNormals();
    parent.add(new T.Mesh(sg, green));
    const rear = new T.Mesh(new T.PlaneGeometry(20, 4.995), earth);
    rear.name = 'rear-earth-cut';
    rear.rotation.y = Math.PI;
    rear.position.set(0, 2.3725, -8);
    parent.add(rear);
    return { surfaces, berms };
}
