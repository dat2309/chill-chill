import * as THREE from 'three';
export function createPeople(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownWalkingSilhouettes';
    parent.add(group);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x222237, roughness: 1
    }), bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.075, .25, 3, 6), mat, 7), heads = new THREE.InstancedMesh(new THREE.SphereGeometry(.065, 8, 6), mat, 7);
    group.add(bodies, heads);
    const d = new THREE.Object3D();
    return {
        group, update(time: number) {
            for (let i = 0; i < 7; i++) {
                const x = i < 2 ? -9 + ((i * 1.1 + time * .1) % 2.1) : -3.8 + ((i * 2.2 + time * .12) % 12.4);
                d.position.set(x, .79, -1.43 - (i % 2) * .3);
                d.rotation.y = Math.PI / 2;
                d.scale.setScalar(1);
                d.updateMatrix();
                bodies.setMatrixAt(i, d.matrix);
                d.position.y = 1.05;
                d.updateMatrix();
                heads.setMatrixAt(i, d.matrix);
            }
            bodies.instanceMatrix.needsUpdate = true;
            heads.instanceMatrix.needsUpdate = true;
        }
    };
}
