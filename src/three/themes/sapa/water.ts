import * as T from 'three';
import { ribbon } from './terrain';
import { TERRACES, contour } from './config';
export function createWater(parent: T.Group) {
    const material = new T.MeshStandardMaterial({ color: 0x91c2c1, roughness: .19, metalness: .25, transparent: true, opacity: .88 });
    material.onBeforeCompile = s => { s.uniforms.uTime = { value: 0 }; s.vertexShader = 'varying vec3 vFieldPosition;\n' + s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvFieldPosition=position;'); s.fragmentShader = 'varying vec3 vFieldPosition;\n' + s.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb*=.94+.06*sin(vFieldPosition.x*.8+vFieldPosition.z*.5);'); };
    const fields = TERRACES.map(t => { const mesh = new T.Mesh(ribbon(t.water, t.id, .055, 1.30), material); mesh.name = 'field-water-' + t.id; parent.add(mesh); return mesh; });
    // Narrow cascade on the right bank, follows each individual terrace elevation.
    const cascadeMat = new T.MeshStandardMaterial({ color: 0xafd5d7, roughness: .3, metalness: .12 });
    const p: number[] = [], idx: number[] = [];
    for (let i = 0; i < 8; i++) {
        const z = contour(9.6, i) + .3;
        for (const v of [[9.35, TERRACES[i].water, z], [9.75, TERRACES[i].water, z], [9.35, i < 7 ? TERRACES[i + 1].water : .7, i < 7 ? contour(9.6, i + 1) + .3 : 7], [9.75, i < 7 ? TERRACES[i + 1].water : .7, i < 7 ? contour(9.6, i + 1) + .3 : 7]])
            p.push(...v);
        const k = i * 4;
        idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    parent.add(new T.Mesh(g, cascadeMat));
    return { fields, material, update(blend: number) { material.opacity = .88 * (1 - blend) + .06 * blend; material.roughness = .19 + blend * .5; } };
}
