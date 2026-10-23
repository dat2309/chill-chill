import * as THREE from 'three';
/** Build-time batching; update loops only reuse preallocated matrices/vectors. */
export class Batch {
    private groups = new Map<string, {
        geometry: THREE.BufferGeometry;
        material: THREE.Material;
        matrices: THREE.Matrix4[];
    }>();
    add(key: string, geometry: THREE.BufferGeometry, material: THREE.Material, matrix: THREE.Matrix4) {
        let b = this.groups.get(key);
        if (!b) {
            b = {
                geometry, material, matrices: []
            };
            this.groups.set(key, b);
        }
        else if (b.geometry !== geometry)
            geometry.dispose();
        b.matrices.push(matrix.clone());
    }
    finish(parent: THREE.Group) {
        for (const [key, b] of this.groups) {
            const mesh = new THREE.InstancedMesh(b.geometry, b.material, b.matrices.length);
            mesh.name = key;
            for (let i = 0; i < b.matrices.length; i++)
                mesh.setMatrixAt(i, b.matrices[i]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.computeBoundingBox();
            mesh.computeBoundingSphere();
            parent.add(mesh);
        }
        this.groups.clear();
    }
}
export const transform = (x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, ry = 0) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(sx, sy, sz));
export function disposeTree(group: THREE.Group) {
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    group.traverse(o => {
        if (o instanceof THREE.DirectionalLight || o instanceof THREE.PointLight || o instanceof THREE.SpotLight)
            o.shadow.dispose();
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments || o instanceof THREE.Points) {
            geometries.add(o.geometry);
            for (const m of Array.isArray(o.material) ? o.material : [o.material])
                materials.add(m);
        }
    });
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    group.clear();
    group.removeFromParent();
}
export function beam(a: THREE.Vector3, b: THREE.Vector3, width: number) {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return m.compose(a.clone().add(b).multiplyScalar(.5), q, new THREE.Vector3(width, a.distanceTo(b), width));
}
