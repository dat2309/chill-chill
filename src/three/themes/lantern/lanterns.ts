import * as THREE from 'three';
import { getOceanWaveElevation } from '../../core/oceanWaves';
import { LANTERN_COLORS } from './config';
const CAPACITY = 144;
export function createFloatingLanterns(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownFloatingLanterns';
    parent.add(group);
    const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(.095, .15, .06, 6), new THREE.MeshBasicMaterial({
        color: 0xffffff
    }), CAPACITY);
    mesh.name = 'LanternTownLotusBowls';
    const flame = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial({
        color: 0xffe1a0
    }), CAPACITY);
    flame.name = 'LanternTownLotusFlames';
    group.add(mesh, flame);
    const x0 = new Float64Array(CAPACITY), z0 = new Float64Array(CAPACITY), birth = new Float64Array(CAPACITY);
    birth.fill(-1e6);
    const dummy = new THREE.Object3D(), color = new THREE.Color();
    let cursor = 112, manual = 0, time = 0;
    for (let i = 0; i < CAPACITY; i++) {
        x0[i] = -9.2 + (i * .739) % 18.4;
        z0[i] = .5 + (i * .413) % 3.5;
        mesh.setColorAt(i, new THREE.Color(LANTERN_COLORS[i % 6]));
    }
    let festival = 0;
    return {
        group, mesh, flame, get festival() {
            return festival;
        }, get manualCount() {
            return manual;
        }, add(x: number, z: number) {
            const i = 112 + (cursor++ % 32);
            x0[i] = x;
            z0[i] = z;
            birth[i] = time;
            manual++;
        }, update(dt: number, t: number, blend: number, wind: number, level: number, flow: number) {
            time = t;
            festival = blend;
            let visible = 0;
            for (let i = 0; i < CAPACITY; i++) {
                const isManual = i >= 112, age = t - birth[i], active = isManual ? age >= 0 && age < 28 : i < Math.ceil(112 * blend);
                if (!active) {
                    dummy.position.set(0, level, 1.8);
                    dummy.scale.setScalar(0);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    flame.setMatrixAt(i, dummy.matrix);
                    continue;
                }
                const travel = isManual ? age : t * .25 + (i * .237) % 18;
                let x = x0[i] + travel * (.12 + flow * .10);
                if (!isManual)
                    x = -9.3 + ((x + 9.3) % 18.6 + 18.6) % 18.6;
                const z = z0[i] + Math.sin(t * .22 + i * .4) * .035;
                let fade = Math.min(1, Math.max(0, (10.15 - x) * 1.5)) * (isManual ? 1 : Math.min(1, Math.max(0, blend * 112 - i)));
                if (isManual)
                    fade *= Math.min(1, (28 - age) / 3);
                if (Math.abs(x + 5.4) < 1.2)
                    fade *= .65;
                dummy.position.set(x, level + getOceanWaveElevation(x, z, t, wind) + .022, z);
                dummy.rotation.set(0, Math.sin(i * 2.7) * 2, Math.sin(t * .6 + i) * .02);
                dummy.scale.setScalar(Math.max(0, fade));
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
                dummy.position.y += .10;
                dummy.scale.set(.025 * fade, .07 * fade, .025 * fade);
                dummy.updateMatrix();
                flame.setMatrixAt(i, dummy.matrix);
                color.setHex(LANTERN_COLORS[i % 6]).multiplyScalar(.4 + .6 * fade);
                mesh.setColorAt(i, color);
                visible++;
            }
            mesh.instanceMatrix.needsUpdate = true;
            flame.instanceMatrix.needsUpdate = true;
            mesh.instanceColor!.needsUpdate = true;
            mesh.frustumCulled = false;
            flame.frustumCulled = false;
            return visible;
        }
    };
}
