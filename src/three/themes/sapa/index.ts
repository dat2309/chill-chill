import * as T from 'three';
import { ThemeInstance, ThemeState } from '../../core/types';
import { disposeTree } from '../../core/procedural';
import { SAPA_METADATA, SAPA_CAMERA_PRESET, terraceAt, TERRACES } from './config';
import { createTerrain } from './terrain';
import { createWater } from './water';
import { createArchitecture } from './architecture';
import { createVegetation } from './vegetation';
import { createLighting } from './lighting';
import { createWeather } from './weather';
export class SapaTheme implements ThemeInstance<'sapa'> {
    readonly id = 'sapa' as const;
    readonly group = new T.Group();
    readonly metadata = SAPA_METADATA;
    readonly cameraPreset = SAPA_CAMERA_PRESET;
    terrain!: ReturnType<typeof createTerrain>;
    water!: ReturnType<typeof createWater>;
    architecture!: ReturnType<typeof createArchitecture>;
    vegetation!: ReturnType<typeof createVegetation>;
    lighting!: ReturnType<typeof createLighting>;
    weather!: ReturnType<typeof createWeather>;
    ripe = 0;
    wind = .12;
    private point = new T.Vector3();
    private plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    constructor(_renderer: T.WebGLRenderer) { this.group.name = 'SapaThemeRoot'; }
    async init() { this.terrain = createTerrain(this.group); this.water = createWater(this.group); this.architecture = createArchitecture(this.group); this.vegetation = createVegetation(this.group); this.lighting = createLighting(this.group); this.weather = createWeather(this.group); }
    applyState(_s: ThemeState<'sapa'>) { }
    update(dt: number, time: number, s: ThemeState<'sapa'>) { dt = Number.isFinite(dt) ? Math.max(0, dt) : 0; const a = 1 - Math.exp(-dt); this.ripe += ((s.season === 'ripe' ? 1 : 0) - this.ripe) * a; this.wind += (s.windStrength * .4 - this.wind) * a; this.water.update(this.ripe); this.vegetation.update(dt, time, this.wind, this.ripe); this.weather.update(time, .7 - .4 * this.ripe); this.lighting.update(this.ripe); }
    getContentBounds() { return new T.Box3(new T.Vector3(-10, -.575, -8), new T.Vector3(10, 7.8, 8)); }
    isInWater(x: number, z: number) { return Math.abs(x) < 10 && terraceAt(x, z) >= 0 && this.ripe < .7; }
    getWaterMesh() { return this.water.fields[0]; }
    intersectWater(ray: T.Ray) {
        let closest = Infinity;
        let found: T.Vector3 | null = null;
        for (const t of TERRACES) {
            this.plane.constant = -t.water;
            if (ray.intersectPlane(this.plane, this.point) && Math.abs(this.point.x) < 10 && terraceAt(this.point.x, this.point.z) === t.id && this.ripe < .7) {
                const d = ray.origin.distanceTo(this.point);
                if (d < closest) {
                    closest = d;
                    found = this.point.clone();
                }
            }
        }
        return found ? { point: found, distance: closest } : null;
    }
    addRipple() { }
    reactToSplash() { }
    dispose() { this.vegetation.dispose(); this.lighting.dispose(); disposeTree(this.group); }
}
