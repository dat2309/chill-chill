import * as T from 'three';
import { precipitation } from '../../core/miniature';
import { roofHeight } from './config';
export function createWeather(group: T.Group) { const rain = precipitation(group, 2000, false, roofHeight, 15, 18); const p = new Float32Array(120 * 3), g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(p, 3)); const mat = new T.PointsMaterial({ color: 0xc6dddd, size: .11, transparent: true, opacity: .12, depthWrite: false }); mat.onBeforeCompile = s => { s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', 'diffuseColor.a*=exp(-dot(gl_PointCoord-.5,gl_PointCoord-.5)*12.);\n#include <opaque_fragment>'); }; const steam = new T.Points(g, mat); steam.name = 'steam-particles'; steam.frustumCulled = false; group.add(steam); return { rain, steam, update(time: number, intensity: number, wind: number) { rain.update(time, intensity, wind); mat.opacity = .12 + (1 - intensity) * .20; for (let i = 0; i < 120; i++) {
        const u = ((i * .151 + time * .19) % 1 + 1) % 1;
        p[i * 3] = -2.1 + u * 2.1 + Math.sin(i * 3 + time * .2) * u * .16;
        p[i * 3 + 1] = 1.4 + u * 2;
        p[i * 3 + 2] = 5.9 + (i % 4) * .4 + Math.cos(i + time * .3) * u * .2;
    } g.attributes.position.needsUpdate = true; } }; }
