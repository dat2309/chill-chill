import * as T from 'three';
import { ThemeInstance, ThemeState, Quality } from '../../core/types';
import { disposeTree } from '../../core/procedural';
import { CYBER_METADATA, CYBER_CAMERA_PRESET } from './config';
import { createTerrain } from './terrain';
import { createWater } from './water';
import { createArchitecture } from './architecture';
import { createVegetation } from './vegetation';
import { createLighting } from './lighting';
import { createWeather } from './weather';
export class CyberTheme implements ThemeInstance<'cyber'> {
    readonly id = 'cyber' as const;
    readonly group = new T.Group();
    readonly metadata = CYBER_METADATA;
    readonly cameraPreset = CYBER_CAMERA_PRESET;
    terrain!: ReturnType<typeof createTerrain>;
    water!: ReturnType<typeof createWater>;
    architecture!: ReturnType<typeof createArchitecture>;
    vegetation!: ReturnType<typeof createVegetation>;
    lighting!: ReturnType<typeof createLighting>;
    weather!: ReturnType<typeof createWeather>;
    rain = 1;
    wind = .15;
    after = 0;
    glowEnabled = true;
    private sampleTime = 0;
    private frames = 0;
    private quality: Quality = 'high';
    constructor(_renderer: T.WebGLRenderer) { this.group.name = 'CyberThemeRoot'; }
    async init() { this.terrain = createTerrain(this.group); this.water = createWater(this.group); this.architecture = createArchitecture(this.group); this.vegetation = createVegetation(this.group); this.lighting = createLighting(this.group); this.weather = createWeather(this.group); }
    applyState(_s: ThemeState<'cyber'>) { }
    update(dt: number, time: number, s: ThemeState<'cyber'>) { dt = Number.isFinite(dt) ? Math.max(0, dt) : 0; const a = 1 - Math.exp(-dt); this.after += ((s.season === 'after' ? 1 : 0) - this.after) * a; this.rain = 1 - this.after; this.wind += (s.windStrength * .45 + this.rain * .07 - this.wind) * a; if (this.sampleTime < 2 && dt > 0) {
        this.sampleTime += dt;
        this.frames++;
        if (this.sampleTime >= 2 && this.frames / this.sampleTime < 28)
            this.glowEnabled = false;
    } this.terrain.update(dt, time, this.rain); this.water.update(dt, time, this.rain); this.architecture.update(time, this.rain, this.glowEnabled && this.quality !== 'low', this.terrain.moisture); this.vegetation.update(dt, time, this.wind, this.rain); this.weather.update(time, this.rain, this.wind); this.lighting.update(this.after); }
    setQuality(q: Quality) { this.quality = q; }
    getContentBounds() { return new T.Box3(new T.Vector3(-7.5, -.55, -9), new T.Vector3(7.5, 8.6, 9)); }
    isInWater() { return false; }
    intersectWater() { return null; }
    getWaterMesh() { return null; }
    addRipple() { }
    reactToSplash() { }
    dispose() { this.vegetation.dispose(); this.lighting.dispose(); disposeTree(this.group); }
}
