import * as THREE from 'three';
import { roofTopAt } from './architecture';
import { HOUSE_SPOTS } from './config';
export function coverHeight(x: number, z: number) {
    for (const s of HOUSE_SPOTS)
        if (Math.abs(x - s.x) < s.w / 2 + .21 && Math.abs(z - s.z) < s.d / 2 + .23)
            return .57 + s.h + roofTopAt(x - s.x, s.w + .42) + .06;
    if (Math.abs(x + 5.4) < 1.20 && z > -1.85 && z < 5.5)
        return .82 + .22 * Math.sin(Math.max(0, Math.min(26, Math.round((z + 1.7) / .27))) / 26 * Math.PI) + 1.77 + roofTopAt(x + 5.4, 2.35);
    return z < -.8 || z > 4.4 ? .60 : .04;
}
export function createWeather(parent: THREE.Group) {
    const count = 420, positions = new Float32Array(count * 6), geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
        color: 0xaec1e2, transparent: true, opacity: .25, depthWrite: false
    });
    const rain = new THREE.LineSegments(geo, material);
    rain.name = 'LanternTownRain';
    rain.frustumCulled = false;
    parent.add(rain);
    let intensity = 0;
    return {
        rain, get intensity() {
            return intensity;
        }, update(dt: number, time: number, target: number, wind: number) {
            intensity += (target - intensity) * (1 - Math.exp(-dt * 1.3));
            rain.visible = intensity > .001;
            material.opacity = intensity * .27;
            for (let i = 0; i < count; i++) {
                const x = ((i * 3.873 + time * wind * .5) % 20.2) - 10.1, z = ((i * 2.173) % 14.4) - 7.2, y = 7 - ((time * 4 + i * .313) % 7), floor = coverHeight(x, z);
                const k = i * 6;
                positions[k] = x;
                positions[k + 1] = Math.max(y, floor);
                positions[k + 2] = z;
                positions[k + 3] = x + .025 * wind;
                positions[k + 4] = Math.max(y - .18, floor);
                positions[k + 5] = z;
            }
            geo.attributes.position.needsUpdate = true;
        }
    };
}
