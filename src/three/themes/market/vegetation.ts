import * as T from 'three';
import { Batch, transform, material } from '../../core/miniature';
import { createBranchCrown } from '../../core/branchCrown';
import { createVegetationWeather } from '../../core/vegetationWeather';
export function createVegetation(parent: T.Group) { const batch = new Batch(), weather = createVegetationWeather(); const wood = material(0x6e6442), leaf = material(0x436d42); for (let i = 0; i < 12; i++) {
    const x = -10.6 + i * 1.85, z = -7.65 + (i % 2) * .14;
    const g = createBranchCrown(true, i % 3);
    batch.add('nipa-stems', g.wood, wood, transform(x, .38, z, .7, 2.4 + (i % 3) * .35, .7, i));
    batch.add('nipa-fronds', g.foliage, leaf, transform(x, .38, z, .7, 2.4 + (i % 3) * .35, .7, i));
} const holder = new T.Group(); parent.add(holder); batch.finish(holder); holder.traverse(m => { if (m instanceof T.Mesh)
    weather.attach(m, m.name === 'nipa-stems' ? .012 : .05); }); return { weather, update(dt: number, time: number, wind: number) { weather.update(dt, time, wind, 0); }, dispose: weather.dispose }; }
