import * as T from 'three';
import { material, Batch, transform } from '../../core/miniature';
import { createVegetationWeather } from '../../core/vegetationWeather';
import { TERRACES, contour, terrainHeight } from './config';
export function createVegetation(parent: T.Group) {
    const uniforms = { uRipe: { value: 0 }, uTime: { value: 0 }, uWind: { value: 0 } }, gold = new T.Color(0xd6ae36), green = new T.Color(0x9ac66c);
    const p: number[] = [];
    for (let j = 0; j < 3; j++) {
        const a = j * Math.PI * 2 / 3, dx = Math.cos(a) * .065, dz = Math.sin(a) * .065;
        for (const v of [[0, 0, 0], [dx, .6, dz], [0, 1, 0], [0, 0, 0], [0, 1, 0], [dx, .6, dz]])
            p.push(...v);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    geo.computeVertexNormals();
    const mat = material(green), depth = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking });
    const deform = `uniform float uRipe,uTime,uWind;`;
    const code = `vec3 transformed=position;transformed.y*=.20+.63*uRipe;float phase=instanceMatrix[3].x*.7+instanceMatrix[3].z*.43;transformed.x+=position.y*position.y*uWind*.10*(.65+.35*sin(uTime*.8+phase));`;
    for (const m of [mat, depth])
        m.onBeforeCompile = s => { Object.assign(s.uniforms, uniforms); s.vertexShader = deform + "\n" + s.vertexShader.replace('#include <begin_vertex>', code); };
    const transforms: T.Matrix4[] = [];
    for (let i = 0; i < 8; i++)
        for (let row = 0; row < 4; row++)
            for (let col = 0; col < 145; col++) {
                const x = -9.65 + col * .128 + Math.sin(col * 19 + row) * .025, z = contour(x, i) + .20 + row * .265 + Math.cos(col * 11) * .025;
                if (i === 0 && (Math.abs(x + 6.6) < 1.4 || Math.abs(x - 2) < 1.5))
                    continue;
                if (i === 4 && Math.abs(x - 7) < .8)
                    continue;
                if (Math.hypot(x + 7, z - 5.8) < .65 || Math.hypot(x + 5.9, z - 5.95) < .55)
                    continue;
                transforms.push(transform(x, TERRACES[i].y, z, 1, .85 + .23 * (Math.sin(col * 5 + row) * .5 + .5), 1));
            }
    const rice = new T.InstancedMesh(geo, mat, transforms.length);
    rice.name = 'sapa-rice';
    transforms.forEach((m, i) => rice.setMatrixAt(i, m));
    rice.customDepthMaterial = depth;
    rice.castShadow = rice.receiveShadow = true;
    rice.computeBoundingBox();
    rice.boundingBox!.expandByScalar(.25);
    rice.computeBoundingSphere();
    rice.boundingSphere!.radius += .25;
    parent.add(rice);
    const batch = new Batch(), wood = material(0x688047), leaf = material(0x467548), weather = createVegetationWeather();
    for (let i = 0; i < 45; i++) {
        const x = -9 + (i % 9) * .18 + (i < 24 ? 0 : 15), z = -7.5 + Math.floor(i / 9) * .12, y = terrainHeight(x, z), h = 1.6 + (i % 5) * .24;
        batch.add('bamboo-stems', new T.CylinderGeometry(.022, .035, h, 5), wood, transform(x, y + h / 2, z));
        for (let k = 0; k < 5; k++) {
            const g = new T.OctahedronGeometry(1, 0);
            batch.add('bamboo-leaves', g, leaf, transform(x + Math.sin(k * 2 + i) * .24, y + h * (.5 + k * .1), z + Math.cos(k * 2 + i) * .24, .25, .035, .09, k));
        }
    }
    for (let i = 0; i < 4; i++) {
        const x = -9 + i * .5, z = 3.6, y = terrainHeight(x, z);
        batch.add('banana-stems', new T.CylinderGeometry(.07, .12, 1.2, 6), wood, transform(x, y + .6, z));
        for (let f = 0; f < 6; f++) {
            const a = f * Math.PI / 3, positions = [0, 0, 0, Math.cos(a + .2) * .65, -.13, Math.sin(a + .2) * .65, Math.cos(a) * 1.1, -.36, Math.sin(a) * 1.1, Math.cos(a - .2) * .65, -.13, Math.sin(a - .2) * .65];
            const g = new T.BufferGeometry();
            g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
            g.setIndex([0, 1, 2, 0, 2, 3, 0, 2, 1, 0, 3, 2]);
            g.computeVertexNormals();
            batch.add('banana-fronds', g, leaf, transform(x, y + 1.2, z));
        }
    }
    const plants = new T.Group();
    parent.add(plants);
    batch.finish(plants);
    plants.traverse(o => {
        if (o instanceof T.Mesh)
            weather.attach(o, o.name.includes('stems') ? .012 : .045);
    });
    return { rice, uniforms, get color() { return mat.color; }, update(dt: number, time: number, wind: number, ripe: number) { uniforms.uRipe.value = ripe; uniforms.uTime.value = time; uniforms.uWind.value = wind; mat.color.copy(green).lerp(gold, ripe); weather.update(dt, time, wind, 0); }, dispose() { weather.dispose(); depth.dispose(); } };
}
