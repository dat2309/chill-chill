import * as THREE from 'three';
import { getOceanWaveElevation } from '../../core/oceanWaves';
const N = 32;
export function hullWidth(z: number) {
    return Math.max(0, .34 * Math.sqrt(Math.max(0, 1 - (z / 1.2) ** 2)) - .035);
}
export function createBoats(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownBoats';
    parent.add(group);
    const p: number[] = [];
    const tri = (a: number[], b: number[], c: number[]) => p.push(...a, ...b, ...c);
    // Closed thick shell: open interior, connected inner floor, sides and gunwale.
    for (let i = 0; i < N; i++) {
        const z = -1.2 + i * 2.4 / N, zz = -1.2 + (i + 1) * 2.4 / N, w = hullWidth(z), ww = hullWidth(zz);
        for (const side of [-1, 1]) {
            const a = [side * w * .65, -.10, z], b = [side * ww * .65, -.10, zz], c = [side * ww, .23, zz], d = [side * w, .23, z];
            const aa = [side * (w + .035) * .6, -.16, z], bb = [side * (ww + .035) * .6, -.16, zz], cc = [side * (ww + .035), .24, zz], dd = [side * (w + .035), .24, z];
            if (side < 0) {
                tri(a, d, b);
                tri(b, d, c);
                tri(aa, bb, dd);
                tri(bb, cc, dd);
            }
            else {
                tri(a, b, d);
                tri(b, c, d);
                tri(aa, dd, bb);
                tri(bb, dd, cc);
            }
            tri(d, dd, c);
            tri(c, dd, cc);
        }
        tri([-w * .65, -.10, z], [w * .65, -.10, z], [-ww * .65, -.10, zz]);
        tri([-ww * .65, -.10, zz], [w * .65, -.10, z], [ww * .65, -.10, zz]);
        tri([-(w + .035) * .6, -.16, z], [-(ww + .035) * .6, -.16, zz], [(w + .035) * .6, -.16, z]);
        tri([-(ww + .035) * .6, -.16, zz], [(ww + .035) * .6, -.16, zz], [(w + .035) * .6, -.16, z]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    const wood = new THREE.MeshStandardMaterial({
        color: 0x77533d, roughness: .78
    });
    const spots = [{
            x: -8, z: .5, yaw: .65
        }, {
            x: -1.3, z: .15, yaw: 1.3
        }, {
            x: 5.2, z: .2, yaw: 1.1
        }];
    const boats: THREE.Group[] = [], inverse = spots.map(() => new THREE.Matrix4());
    for (const s of spots) {
        const boat = new THREE.Group();
        boat.name = 'LanternTownMooredBoat';
        const hull = new THREE.Mesh(geometry, wood);
        hull.castShadow = true;
        boat.add(hull);
        for (const z of [-.55, .35]) {
            const seat = new THREE.Mesh(new THREE.BoxGeometry(.51, .05, .15), wood);
            seat.position.set(0, .13, z);
            boat.add(seat);
        }
        group.add(boat);
        boats.push(boat);
    }
    const up = new THREE.Vector3(), forward = new THREE.Vector3(), right = new THREE.Vector3(), basis = new THREE.Matrix4();
    return {
        group, boats, inverse, update(time: number, wind: number, level: number) {
            for (let i = 0; i < boats.length; i++) {
                const b = boats[i], s = spots[i], e = .001, dx = (getOceanWaveElevation(s.x + e, s.z, time, wind) - getOceanWaveElevation(s.x - e, s.z, time, wind)) / (2 * e), dz = (getOceanWaveElevation(s.x, s.z + e, time, wind) - getOceanWaveElevation(s.x, s.z - e, time, wind)) / (2 * e);
                up.set(-dx, 1, -dz).normalize();
                forward.set(Math.sin(s.yaw), 0, Math.cos(s.yaw));
                forward.addScaledVector(up, -forward.dot(up)).normalize();
                right.crossVectors(up, forward).normalize();
                basis.makeBasis(right, up, forward);
                b.quaternion.setFromRotationMatrix(basis);
                b.position.set(s.x, level + getOceanWaveElevation(s.x, s.z, time, wind), s.z);
                b.updateMatrixWorld(true);
                inverse[i].copy(b.matrixWorld).invert();
            }
        }
    };
}
export const HULL_CAVITY_GLSL = `uniform mat4 uBoatInverse[3];float innerWidth(float z){return max(0.,.34*sqrt(max(0.,1.-pow(z/1.2,2.)))-.035);}bool boatCavity(vec3 world){for(int b=0;b<3;b++){vec3 p=(uBoatInverse[b]*vec4(world,1.)).xyz;if(abs(p.z)>=1.2||p.y<-.10||p.y>.24)continue;float station=clamp((p.z+1.2)/2.4*32.,0.,31.999);float a=floor(station);float w=mix(innerWidth(-1.2+a*2.4/32.),innerWidth(-1.2+(a+1.)*2.4/32.),fract(station));w*=mix(.65,1.,clamp((p.y+.10)/.33,0.,1.));if(abs(p.x)<w)return true;}return false;}`;
