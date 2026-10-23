import * as T from 'three';
import { precipitation } from '../../core/miniature';
import { roofHeight } from './config';
export function createWeather(parent: T.Group, chimneyTop: number) { const snow = precipitation(parent, 2100, true, roofHeight); const data = new Float32Array(90 * 3), g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(data, 3)); const mat = new T.PointsMaterial({ color: 0xa9b4c2, size: .13, transparent: true, opacity: .22, depthWrite: false }); mat.onBeforeCompile = s => { s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>', 'diffuseColor.a*=exp(-dot(gl_PointCoord-.5,gl_PointCoord-.5)*15.);\n#include <opaque_fragment>'); }; const smoke = new T.Points(g, mat); smoke.name = 'chimney-smoke-particles'; smoke.frustumCulled = false; parent.add(smoke); return { snow, smoke, update(time: number, storm: number, wind: number) { snow.update(time, .02 + storm * .98, wind); for (let i = 0; i < 90; i++) {
        const u = ((i * .13 + time * .14) % 1 + 1) % 1;
        data[i * 3] = -3.3 + u * wind * .8 + Math.sin(i * 2 + time * .2) * u * .15;
        data[i * 3 + 1] = chimneyTop + .08 + u * 1.8;
        data[i * 3 + 2] = -4.2 + Math.cos(i * 4 + time * .2) * u * .12;
    } g.attributes.position.needsUpdate = true; } }; }
