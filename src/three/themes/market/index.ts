import * as T from 'three';
import { ThemeInstance, ThemeState } from '../../core/types';
import { disposeTree } from '../../core/procedural';
import { MARKET_METADATA, MARKET_CAMERA_PRESET, isRiver } from './config';
import { createTerrain } from './terrain';
import { createArchitecture } from './architecture';
import { createVegetation } from './vegetation';
import { createBoats } from './boats';
import { createWater } from './water';
import { createLighting } from './lighting';
import { createWeather } from './weather';
export class MarketTheme implements ThemeInstance<'market'> {
    readonly id = 'market' as const;
    readonly metadata = MARKET_METADATA;
    readonly cameraPreset = MARKET_CAMERA_PRESET;
    readonly group = new T.Group();
    terrain!: ReturnType<typeof createTerrain>;
    architecture!: ReturnType<typeof createArchitecture>;
    vegetation!: ReturnType<typeof createVegetation>;
    boats!: ReturnType<typeof createBoats>;
    water!: ReturnType<typeof createWater>;
    lighting!: ReturnType<typeof createLighting>;
    weather!: ReturnType<typeof createWeather>;
    noon = 0;
    level = 0;
    wind = .12;
    private pathTime = 0;
    private plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
    private hit = new T.Vector3();
    constructor(_renderer: T.WebGLRenderer) { this.group.name = 'MarketThemeRoot'; }
    async init() { this.terrain = createTerrain(this.group); this.architecture = createArchitecture(this.group); this.vegetation = createVegetation(this.group); this.boats = createBoats(this.group); this.water = createWater(this.group, this.boats.inverse, this.boats.positions); this.lighting = createLighting(this.group); this.weather = createWeather(this.group); this.boats.update(0, 0, this.wind, 0, 0); }
    applyState(_s: ThemeState<'market'>) { }
    update(dt: number, time: number, s: ThemeState<'market'>) { dt = Number.isFinite(dt) ? Math.max(0, dt) : 0; const a = 1 - Math.exp(-dt); this.noon += ((s.season === 'noon' ? 1 : 0) - this.noon) * a; this.level += ((s.tide === 'low' ? -.12 : 0) - this.level) * (1 - Math.exp(-dt * 2)); this.wind += (s.windStrength * .35 - this.wind) * a; this.pathTime += dt * (.65 + this.noon * .35) * (.5 + s.flowSpeed); this.boats.update(dt, this.pathTime, this.wind, this.level, this.noon); this.water.update(this.pathTime, this.wind, this.level, this.noon); this.vegetation.update(dt, time, this.wind); this.weather.update(time, 1 - this.noon); this.lighting.update(this.noon); this.plane.constant = -this.level; }
    getContentBounds() { return new T.Box3(new T.Vector3(-11.5, -.95, -8), new T.Vector3(11.5, 4.9, 8)); }
    isInWater(x: number, z: number) { return isRiver(x, z); }
    getWaterLevel() { return this.level; }
    getWaterMesh() { return this.water.mesh; }
    intersectWater(ray: T.Ray) {
        if (!ray.intersectPlane(this.plane, this.hit) || !this.isInWater(this.hit.x, this.hit.z))
            return null;
        return { point: this.hit.clone(), distance: ray.origin.distanceTo(this.hit) };
    }
    handleClick(ray: T.Ray) { return this.boats.selectRay(ray); }
    addRipple(x: number, z: number) { this.water.ripple(x, z); }
    reactToSplash() { }
    dispose() { this.vegetation.dispose(); this.lighting.dispose(); disposeTree(this.group); }
}
