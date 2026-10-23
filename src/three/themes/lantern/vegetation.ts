import * as THREE from 'three';
import { Batch, transform, beam } from './geometry';
import { HOUSE_SPOTS } from './config';
import { createVegetationWeather } from '../../core/vegetationWeather';
export function createVegetation(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownVegetation';
    parent.add(group);
    const roots: THREE.Vector3[] = [];
    const b = new Batch(), wood = new THREE.MeshStandardMaterial({
        color: 0x68482e, roughness: .9
    }), green = new THREE.MeshStandardMaterial({
        color: 0x315c40, roughness: .85
    }), pink = new THREE.MeshStandardMaterial({
        color: 0xc84c83, roughness: .8
    });
    for (const [i, s] of HOUSE_SPOTS.entries()) {
        for (let j = 0; j < 3; j++) {
            const x = s.x - .78 + j * .75, z = s.z + s.d / 2 + .3;
            b.add('LanternTownPlanters', new THREE.BoxGeometry(1, 1, 1), wood, transform(x, 2.42, z, .48, .25, .36));
            for (let k = 0; k < 7; k++) {
                roots.push(new THREE.Vector3(x, 2.5, z));
                const angle = k * 2.4;
                const a = new THREE.Vector3(x, 2.5, z), p = new THREE.Vector3(x + Math.cos(angle) * .26, 2.60 + Math.sin(k) * .1, z + Math.sin(angle) * .2);
                b.add('LanternTownBougainvilleaStems', new THREE.CylinderGeometry(1, 1, 1, 5), wood, beam(a, p, .018));
                b.add('LanternTownBougainvilleaLeaves', new THREE.IcosahedronGeometry(1, 0), green, transform(p.x, p.y, p.z, .16, .08, .10, angle));
                b.add('LanternTownBougainvilleaFlowers', new THREE.IcosahedronGeometry(1, 0), pink, transform(p.x + .04, p.y + .06, p.z + .03, .07, .05, .07, angle));
            }
        }
    }
    b.finish(group);
    const weather = createVegetationWeather();
    group.traverse(o => {
        if (o instanceof THREE.InstancedMesh && !o.name.includes('Planter'))
            weather.attach(o, .012, i => roots[i]);
    });
    return {
        group, update(dt: number, t: number, wind: number, rain: number) {
            weather.update(dt, t, wind, rain);
        }, dispose() {
            weather.dispose();
        }
    };
}
