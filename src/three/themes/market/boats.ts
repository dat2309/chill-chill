import * as T from 'three';
import { Batch, transform, material } from '../../core/miniature';
import { createBoatHull } from '../../core/boatHull';
import { getOceanWaveElevation } from '../../core/oceanWaves';
import { BOAT_COUNT, boatPosition } from './config';
export function createBoats(parent: T.Group) {
    const boats: T.Group[] = [], inverse: T.Matrix4[] = [], cargo: T.InstancedMesh[] = [], positions = Array.from({ length: BOAT_COUNT }, () => new T.Vector3());
    const hullGeo = createBoatHull(), wood = material(0x765033), trim = material(0xa98b54);
    const awnings = [0x9d5548, 0x698a81, 0xcfad60];
    for (let i = 0; i < BOAT_COUNT; i++) {
        const b = new T.Group();
        b.name = 'market-ghe';
        b.scale.setScalar(.8);
        const hull = new T.Mesh(hullGeo, wood);
        hull.castShadow = true;
        b.add(hull);
        const batch = new Batch();
        for (const z of [-.65, .65])
            batch.add('seats', new T.BoxGeometry(.53, .055, .14), trim, transform(0, .13, z));
        for (const x of [-.31, .31])
            for (const z of [-.2, .7])
                batch.add('awning-posts', new T.CylinderGeometry(.014, .014, .95, 5), wood, transform(x, .66, z));
        batch.add('canvas-awning', new T.BoxGeometry(.8, .045, 1.25), material(awnings[i % 3]), transform(0, 1.14, .22));
        batch.add('cay-beo', new T.CylinderGeometry(.018, .025, 1.95, 6), trim, transform(.26, 1.04, -.85));
        const type = i % 3, geo = type === 2 ? new T.ConeGeometry(.065, .23, 6) : new T.SphereGeometry(type === 0 ? .105 : .075, 8, 6), mat = material(type === 0 ? 0x365d39 : type === 1 ? 0xb9a139 : 0xdd803f);
        batch.add('hanging-produce', geo.clone(), mat, transform(.26, 1.85, -.85));
        batch.finish(b);
        const c = new T.InstancedMesh(geo, mat, 24);
        c.name = ['watermelons', 'pineapples', 'carrots'][type];
        for (let j = 0; j < 24; j++)
            c.setMatrixAt(j, transform((j % 3 - 1) * .145, .05 + Math.floor(j / 12) * .14, -.8 + Math.floor(j % 12 / 3) * .19, 1, 1, 1, type === 2 ? .4 : 0));
        c.castShadow = true;
        b.add(c);
        cargo.push(c);
        boats.push(b);
        inverse.push(new T.Matrix4());
        parent.add(b);
    }
    const bubble = new T.Group();
    bubble.name = 'produce-bubble';
    const plate = new T.Mesh(new T.SphereGeometry(.36, 16, 10), new T.MeshBasicMaterial({ color: 0xffedc9 }));
    plate.scale.set(1, .9, .18);
    bubble.add(plate);
    const symbol = new T.Mesh(new T.SphereGeometry(.16, 12, 8), material(0x365d39));
    symbol.position.z = .12;
    bubble.add(symbol);
    parent.add(bubble);
    bubble.visible = false;
    let remaining = 0, selected = -1;
    const up = new T.Vector3(), forward = new T.Vector3(), right = new T.Vector3(), basis = new T.Matrix4(), hit = new T.Vector3(), local = new T.Vector3();
    const selectionRay = new T.Ray(), selectionBoxes = [new T.Box3(new T.Vector3(-.36, -.18, -1.21), new T.Vector3(.36, .25, 1.21)), new T.Box3(new T.Vector3(-.40, 1.1175, -.405), new T.Vector3(.40, 1.1625, .845)), new T.Box3(new T.Vector3(.235, .065, -.875), new T.Vector3(.285, 2.015, -.825))];
    const plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    return { boats, cargo, inverse, positions, bubble, get remaining() { return remaining; }, selectRay(ray: T.Ray) { let nearest = Infinity, index = -1; for (let i = 0; i < BOAT_COUNT; i++) {
            selectionRay.copy(ray).applyMatrix4(inverse[i]);
            for (const selectionBox of selectionBoxes)
                if (selectionRay.intersectBox(selectionBox, local)) {
                    hit.copy(local).applyMatrix4(boats[i].matrixWorld);
                    const distance = hit.distanceToSquared(ray.origin);
                    if (distance < nearest) {
                        nearest = distance;
                        index = i;
                    }
                }
        } if (index < 0)
            return false; selected = index; remaining = 2; symbol.material.color.setHex(index % 3 === 0 ? 0x365d39 : index % 3 === 1 ? 0xb9a139 : 0xdd803f); return true; }, update(dt: number, time: number, wind: number, level: number, activity: number) {
            for (let i = 0; i < BOAT_COUNT; i++) {
                const p = boatPosition(i, time, positions[i]), e = .001, dx = (getOceanWaveElevation(p.x + e, p.z, time, wind) - getOceanWaveElevation(p.x - e, p.z, time, wind)) / (2 * e), dz = (getOceanWaveElevation(p.x, p.z + e, time, wind) - getOceanWaveElevation(p.x, p.z - e, time, wind)) / (2 * e);
                up.set(-dx, 1, -dz).normalize();
                const lane = Math.floor(i / 5), a = i % 5 * Math.PI * 2 / 5 + lane * .41 + time * .011;
                forward.set(-(3.3 + lane * 2.05) * Math.sin(a), 0, (1.35 + lane * 1.32) * Math.cos(a)).normalize();
                forward.addScaledVector(up, -forward.dot(up)).normalize();
                right.crossVectors(up, forward);
                basis.makeBasis(right, up, forward);
                boats[i].quaternion.setFromRotationMatrix(basis);
                boats[i].position.set(p.x, level + getOceanWaveElevation(p.x, p.z, time, wind), p.z);
                boats[i].updateMatrixWorld(true);
                inverse[i].copy(boats[i].matrixWorld).invert();
            }
            remaining = Math.max(0, remaining - dt);
            bubble.visible = remaining > 0;
            if (selected >= 0) {
                bubble.position.copy(boats[selected].position);
                bubble.position.y += 2.45;
                bubble.rotation.y = .55;
            }
            plane.constant = -level;
        } };
}
