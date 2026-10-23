import * as T from 'three';
import { Batch, transform, material } from '../../core/miniature';
import { createBranchCrown } from '../../core/branchCrown';
import { createVegetationWeather } from '../../core/vegetationWeather';
import { terrainHeight } from './config';
export function createVegetation(parent: T.Group) { const group = new T.Group(); group.name = 'snow-pine-forest'; parent.add(group); const weather = createVegetationWeather(), batch = new Batch(), wood = material(0x665d52), leaf = material(0x34665d); leaf.vertexColors = true; for (let i = 0; i < 24; i++) {
    const x = i < 12 ? -9.7 + i * 1.73 : i < 18 ? -9.8 : 9.8, z = i < 12 ? -6.8 + (i % 3) * .2 : -4.7 + (i % 6) * 1.65, y = terrainHeight(x, z) + .02, h = 2.5 + (i % 5) * .36;
    const crown = createBranchCrown(false, i % 3);
    const old = crown.foliage, source = old.attributes.position, baseColors = old.attributes.color, covers = old.attributes.vegSnowCover, pp: number[] = [], cc: number[] = [], ss: number[] = [], ii: number[] = [];
    for (let v = 0; v < source.count; v += 5) {
        const base = new T.Vector3().fromBufferAttribute(source, v);
        for (const angle of [-.3, 0, .3]) {
            const start = pp.length / 3;
            for (let k = 0; k < 5; k++) {
                const point = new T.Vector3().fromBufferAttribute(source, v + k).sub(base).multiplyScalar(1.35).applyAxisAngle(new T.Vector3(0, 1, 0), angle).add(base);
                pp.push(point.x, point.y, point.z);
                cc.push(baseColors.getX(v + k), baseColors.getY(v + k), baseColors.getZ(v + k));
                ss.push(covers.getX(v + k));
            }
            for (const tri of [[0, 2, 1], [0, 3, 2], [1, 2, 4], [2, 3, 4]])
                ii.push(...tri.map(k => k + start));
        }
    }
    const dense = new T.BufferGeometry();
    dense.setAttribute('position', new T.Float32BufferAttribute(pp, 3));
    dense.setAttribute('color', new T.Float32BufferAttribute(cc, 3));
    dense.setAttribute('vegSnowCover', new T.Float32BufferAttribute(ss, 1));
    dense.setIndex(ii);
    dense.computeVertexNormals();
    old.dispose();
    crown.foliage = dense;
    const matrix = transform(x, y, z, .8 + (i % 3) * .12, h, .8 + (i % 3) * .12, i * .6);
    batch.add('pine-wood', crown.wood, wood, matrix);
    batch.add('pine-needles', crown.foliage, leaf, matrix);
} batch.finish(group); group.traverse(o => { if (o instanceof T.Mesh)
    weather.attach(o, .025); }); return { group, weather, update(dt: number, time: number, wind: number, snow: number) { weather.update(dt, time * .75, wind, 0, snow); }, dispose: weather.dispose }; }
