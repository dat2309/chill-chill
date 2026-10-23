import * as T from 'three';
import { ThemeInstance, ThemeState, Quality } from '../../core/types';
import { disposeTree } from '../../core/procedural';
import { AURORA_METADATA, AURORA_CAMERA_PRESET } from './config';
import { createTerrain } from './terrain';
import { createWater } from './water';
import { createArchitecture } from './architecture';
import { createVegetation } from './vegetation';
import { createLighting } from './lighting';
import { createWeather } from './weather';
import { createAurora } from './aurora';
export class AuroraTheme implements ThemeInstance<'aurora'> {
    readonly id = 'aurora' as const;
    readonly group = new T.Group();
    readonly metadata = AURORA_METADATA;
    readonly cameraPreset = AURORA_CAMERA_PRESET;
    terrain!: ReturnType<typeof createTerrain>;
    water!: ReturnType<typeof createWater>;
    architecture!: ReturnType<typeof createArchitecture>;
    vegetation!: ReturnType<typeof createVegetation>;
    lighting!: ReturnType<typeof createLighting>;
    weather!: ReturnType<typeof createWeather>;
    aurora!: ReturnType<typeof createAurora>;
    private firstState = true;
    storm = 0;
    wind = .1;
    level = .24;
    constructor(_renderer: T.WebGLRenderer) { this.group.name = 'AuroraThemeRoot'; }
    async init() { this.terrain = createTerrain(this.group); this.water = createWater(this.group); this.architecture = createArchitecture(this.group); this.vegetation = createVegetation(this.group); this.lighting = createLighting(this.group); this.weather = createWeather(this.group, this.architecture.chimneyTop); this.aurora = createAurora(this.group); }
    applyState(s: ThemeState<'aurora'>) { if (this.firstState) {
        this.level = s.tide === 'low' ? .13 : .24;
        this.water.uniforms.uLevel.value = this.level;
        this.firstState = false;
    } }
    update(dt: number, time: number, s: ThemeState<'aurora'>) { this.applyState(s); dt = Number.isFinite(dt) ? Math.max(0, dt) : 0; const a = 1 - Math.exp(-dt); this.storm += ((s.season === 'blizzard' ? 1 : 0) - this.storm) * a; this.wind += (s.windStrength * .35 + this.storm * .30 - this.wind) * a; this.level += ((s.tide === 'low' ? .13 : .24) - this.level) * (1 - Math.exp(-dt * 2)); this.water.update(time, this.storm, this.level); this.architecture.update(this.storm); this.vegetation.update(dt, time, this.wind, .8 + this.storm * .2); this.weather.update(time, this.storm, this.wind); this.lighting.update(this.storm); this.aurora.update(time, this.storm); }
    setQuality(_q: Quality) { }
    getContentBounds() { return new T.Box3(new T.Vector3(-11, -.9, -8), new T.Vector3(11, 9.6, 8)); }
    isInWater() { return false; }
    getWaterLevel() { return this.level; }
    getWaterMesh() { return this.water.mesh; }
    intersectWater() { return null; }
    addRipple() { }
    reactToSplash() { }
    dispose() { this.vegetation.dispose(); this.lighting.dispose(); disposeTree(this.group); }
}
