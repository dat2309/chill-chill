import * as THREE from 'three';
import { ThemeInstance, ThemeState, Quality } from '../../core/types';
import { LANTERN_METADATA, LANTERN_CAMERA_PRESET, isRiver, waterLevel } from './config';
import { createTerrain } from './terrain';
import { createWater } from './water';
import { createArchitecture } from './architecture';
import { createVegetation } from './vegetation';
import { createLighting } from './lighting';
import { createWeather } from './weather';
import { hullWidth, createBoats } from './boats';
import { createFloatingLanterns } from './lanterns';
import { createPeople } from './people';
import { disposeTree } from './geometry';
export class LanternTheme implements ThemeInstance<'lantern'> {
    readonly id = 'lantern' as const;
    readonly metadata = LANTERN_METADATA;
    readonly cameraPreset = LANTERN_CAMERA_PRESET;
    readonly group = new THREE.Group();
    terrain!: ReturnType<typeof createTerrain>;
    water!: ReturnType<typeof createWater>;
    architecture!: ReturnType<typeof createArchitecture>;
    vegetation!: ReturnType<typeof createVegetation>;
    lighting!: ReturnType<typeof createLighting>;
    weather!: ReturnType<typeof createWeather>;
    boats!: ReturnType<typeof createBoats>;
    lanterns!: ReturnType<typeof createFloatingLanterns>;
    people!: ReturnType<typeof createPeople>;
    private festival = 0;
    private targetFestival = 0;
    private rainTarget = 0;
    private wind = .12;
    private level = .04;
    private targetLevel = .04;
    private elapsed = 0;
    private alive = false;
    private hit = new THREE.Vector3();
    private localHit = new THREE.Vector3();
    private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -.04);
    private bounds = new THREE.Box3(new THREE.Vector3(-10.3, -.85, -7.6), new THREE.Vector3(10.3, 6.75, 7.6));
    constructor(_renderer: THREE.WebGLRenderer) {
        this.group.name = 'LanternTownThemeRoot';
    }
    async init() {
        this.terrain = createTerrain(this.group);
        this.water = createWater(this.group);
        this.architecture = createArchitecture(this.group);
        this.vegetation = createVegetation(this.group);
        this.boats = createBoats(this.group);
        this.lanterns = createFloatingLanterns(this.group);
        this.people = createPeople(this.group);
        this.weather = createWeather(this.group);
        this.lighting = createLighting(this.group);
        this.water.uniforms.uBoatInverse = {
            value: this.boats.inverse
        };
        this.water.uniforms.uLampSources.value = this.architecture.lampPositions;
        this.alive = true;
        this.update(0, 0, {
            themeId: 'lantern', season: 'night', timeOfDay: 19.5, tide: 'high', rippleStrength: .5, flowSpeed: .4, windStrength: .3, autoRotate: false
        });
    }
    applyState(state: ThemeState<'lantern'>) {
        this.targetFestival = state.season === 'festival' ? 1 : 0;
        this.rainTarget = state.rainIntensity ?? 0;
        this.targetLevel = waterLevel(state.tide);
    }
    update(dt: number, elapsed: number, state: ThemeState<'lantern'>) {
        if (!this.alive)
            return;
        dt = Number.isFinite(dt) ? Math.max(0, dt) : 0;
        this.elapsed = Number.isFinite(elapsed) ? elapsed : this.elapsed;
        this.applyState(state);
        const a = 1 - Math.exp(-dt * 1.25);
        this.festival += (this.targetFestival - this.festival) * a;
        this.level += (this.targetLevel - this.level) * (1 - Math.exp(-dt * 2));
        this.weather.update(dt, this.elapsed, this.rainTarget, this.wind);
        const rain = this.weather.intensity;
        this.wind += ((state.windStrength * .35 + rain * .08) - this.wind) * (1 - Math.exp(-dt * 2));
        this.water.update(this.elapsed, this.wind, this.level, rain, this.festival);
        this.terrain.update(dt, rain);
        this.architecture.update(this.elapsed, this.wind, rain);
        this.vegetation.update(dt, this.elapsed, this.wind, rain);
        this.boats.update(this.elapsed, this.wind, this.level);
        this.lanterns.update(dt, this.elapsed, this.festival, this.wind, this.level, state.flowSpeed);
        this.people.update(this.elapsed);
        this.lighting.update(this.festival, rain, state.timeOfDay);
        this.plane.constant = -this.level;
    }
    getContentBounds() {
        return this.bounds.clone();
    }
    isInWater(x: number, z: number) {
        if (!isRiver(x, z))
            return false;
        if (this.boats)
            for (const inverse of this.boats.inverse) {
                this.localHit.set(x, this.level, z).applyMatrix4(inverse);
                if (Math.abs(this.localHit.z) < 1.2 && Math.abs(this.localHit.x) < hullWidth(this.localHit.z) + .035)
                    return false;
            }
        return true;
    }
    getWaterLevel() {
        return this.level;
    }
    getTideOffset() {
        return this.level - .04;
    }
    getWaterMesh() {
        return this.water?.mesh ?? null;
    }
    getObstacleMeshes() {
        return [];
    }
    setQuality(_q: Quality) {
    }
    intersectWater(ray: THREE.Ray) {
        if (!ray.intersectPlane(this.plane, this.hit) || !this.isInWater(this.hit.x, this.hit.z))
            return null;
        return {
            point: this.hit.clone(), distance: ray.origin.distanceTo(this.hit)
        };
    }
    addRipple(x: number, z: number, strength: number) {
        if (this.isInWater(x, z))
            this.water.ripple(x, z, strength);
    }
    reactToSplash(x: number, z: number) {
        if (this.isInWater(x, z))
            this.lanterns.add(x, z);
    }
    dispose() {
        this.alive = false;
        this.vegetation?.dispose();
        this.lighting?.dispose();
        disposeTree(this.group);
    }
}
