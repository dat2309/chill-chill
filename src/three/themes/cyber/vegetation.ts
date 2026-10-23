import * as T from 'three';
import { Batch, transform, box, material } from '../../core/miniature';
import { createBranchCrown } from '../../core/branchCrown';
import { createVegetationWeather } from '../../core/vegetationWeather';
export function createVegetation(parent: T.Group) { const batch = new Batch(), weather = createVegetationWeather(), wood = material(0x586047), leaf = material(0x537d60); for (const [x, z] of [[-2.45, -3.9], [2.45, -1.5], [-2.45, 2]]) {
    box(parent, 'street-planter', x, .22, z, .45, .3, .45, material(0x655f61));
    const g = createBranchCrown(true, 1);
    batch.add('planter-stems', g.wood, wood, transform(x, .37, z, .45, .75, .45));
    batch.add('planter-leaves', g.foliage, leaf, transform(x, .37, z, .45, .75, .45));
} const plants = new T.Group(); parent.add(plants); batch.finish(plants); plants.traverse(o => { if (o instanceof T.Mesh)
    weather.attach(o, o.name.includes('stems') ? .012 : .04); }); return { weather, update: weather.update, dispose: weather.dispose }; }
