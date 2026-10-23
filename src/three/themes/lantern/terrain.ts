import * as THREE from 'three';
import { Batch, transform } from './geometry';
export function createTerrain(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownTerrain';
    parent.add(group);
    const shape = new THREE.Shape(), w = 10.25, d = 7.5, r = .7;
    shape.moveTo(-w + r, -d);
    shape.lineTo(w - r, -d);
    shape.quadraticCurveTo(w, -d, w, -d + r);
    shape.lineTo(w, d - r);
    shape.quadraticCurveTo(w, d, w - r, d);
    shape.lineTo(-w + r, d);
    shape.quadraticCurveTo(-w, d, -w, d - r);
    shape.lineTo(-w, -d + r);
    shape.quadraticCurveTo(-w, -d, -w + r, -d);
    const geo = new THREE.ExtrudeGeometry(shape, {
        depth: .28, bevelEnabled: false, curveSegments: 8
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -.82, 0);
    const base = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: 0x8b7566, roughness: .9
    }));
    base.name = 'LanternTownDisplayBase';
    base.receiveShadow = true;
    group.add(base);
    const batch = new Batch(), stone = new THREE.MeshStandardMaterial({
        color: 0x777779, roughness: .9
    }), paving = new THREE.MeshStandardMaterial({
        color: 0x97918a, roughness: .85
    }), soil = new THREE.MeshStandardMaterial({
        color: 0x8f8070, roughness: 1
    });
    // Banks terminate exactly at the engineered quays; the outer base corner is inset .7.
    batch.add('LanternTownBackBank', new THREE.BoxGeometry(1, 1, 1), soil, transform(0, -.01, -4.15, 19.1, 1.08, 6.7));
    batch.add('LanternTownFrontBank', new THREE.BoxGeometry(1, 1, 1), soil, transform(0, -.01, 5.95, 19.1, 1.08, 3.1));
    for (const z of [-.94, 4.54])
        batch.add('LanternTownQuays', new THREE.BoxGeometry(1, 1, 1), stone, transform(0, .05, z, 20.5, .98, .28));
    for (const z of [-1.7, 5.3])
        for (let ix = 0; ix < 68; ix++)
            for (let iz = 0; iz < 5; iz++)
                batch.add('LanternTownPaving', new THREE.BoxGeometry(1, 1, 1), paving, transform(-10.05 + ix * .30 + (iz % 2) * .08, .555, z + (iz - 2) * .26, .28, .07, .24));
    const bed = new THREE.Mesh(new THREE.PlaneGeometry(20.5, 5.2, 1, 1), new THREE.MeshStandardMaterial({
        color: 0x3b615b, roughness: 1
    }));
    bed.rotation.x = -Math.PI / 2;
    bed.position.set(0, -.48, 1.8);
    group.add(bed);
    batch.finish(group);
    const outdoor = [stone, paving];
    const dry = outdoor.map(m => m.color.clone());
    let moisture = 0;
    return {
        group, update(dt: number, rain: number) {
            const rate = rain * .8 + .025;
            moisture = rain * .8 / rate + (moisture - rain * .8 / rate) * Math.exp(-rate * dt);
            for (let i = 0; i < outdoor.length; i++) {
                outdoor[i].color.copy(dry[i]).multiplyScalar(1 - .20 * moisture);
                outdoor[i].roughness = .85 - .48 * moisture;
            }
        }, get moisture() {
            return moisture;
        }
    };
}
