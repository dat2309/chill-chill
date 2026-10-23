import * as THREE from 'three';
const N = 32;
export function hullWidth(z: number) { return Math.max(0, .34 * Math.sqrt(Math.max(0, 1 - (z / 1.2) ** 2)) - .035); }
export function createBoatHull() {
    const p: number[] = [];
    const tri = (a: number[], b: number[], c: number[]) => p.push(...a, ...b, ...c);
    // Closed thick shell: open interior, connected inner floor, sides and gunwale.
    for (let i = 0; i < N; i++) {
        const z = -1.2 + i * 2.4 / N, zz = -1.2 + (i + 1) * 2.4 / N, w = hullWidth(z), ww = hullWidth(zz);
        for (const side of [-1, 1]) {
            const a = [side * w * .65, -.10, z], b = [side * ww * .65, -.10, zz], c = [side * ww, .23, zz], d = [side * w, .23, z];
            const aa = [side * (w + .035) * .6, -.16, z], bb = [side * (ww + .035) * .6, -.16, zz], cc = [side * (ww + .035), .24, zz], dd = [side * (w + .035), .24, z];
            if (side < 0) {
                tri(a, d, b);
                tri(b, d, c);
                tri(aa, bb, dd);
                tri(bb, cc, dd);
            }
            else {
                tri(a, b, d);
                tri(b, c, d);
                tri(aa, dd, bb);
                tri(bb, dd, cc);
            }
            tri(d, dd, c);
            tri(c, dd, cc);
        }
        tri([-w * .65, -.10, z], [w * .65, -.10, z], [-ww * .65, -.10, zz]);
        tri([-ww * .65, -.10, zz], [w * .65, -.10, z], [ww * .65, -.10, zz]);
        tri([-(w + .035) * .6, -.16, z], [-(ww + .035) * .6, -.16, zz], [(w + .035) * .6, -.16, z]);
        tri([-(ww + .035) * .6, -.16, zz], [(ww + .035) * .6, -.16, zz], [(w + .035) * .6, -.16, z]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
}
