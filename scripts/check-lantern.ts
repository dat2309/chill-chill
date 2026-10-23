import * as THREE from 'three';
import { LanternTheme } from '../src/three/themes/lantern';
import { DEFAULT_LANTERN_STATE, DEFAULT_GARDEN_STATE, DEFAULT_BEACH_STATE, loadPersistedAppState, savePersistedAppState, CURRENT_STORAGE_VERSION, STORAGE_KEY } from '../src/three/core/storage';
import { HOUSE_SPOTS, isRiver } from '../src/three/themes/lantern/config';
import { getOceanWaveElevation } from '../src/three/core/oceanWaves';
import { getOceanWaveElevation as beachWave } from '../src/three/themes/beach/boats';
import { fitOrthographicCameraToBounds } from '../src/three/core/camera';
async function main() {
    let tests = 0;
    function check(ok: boolean, message: string) {
        tests++;
        if (!ok)
            throw Error(message);
        console.log('PASS', message);
    }
    const theme = new LanternTheme({} as any);
    await theme.init();
    const state = {
        ...DEFAULT_LANTERN_STATE
    };
    let triangles = 0, draws = 0, finite = true;
    theme.group.updateMatrixWorld(true);
    theme.group.traverse(o => {
        if (o instanceof THREE.Mesh) {
            const n = (o.geometry.index?.count ?? o.geometry.getAttribute('position').count) / 3 * (o instanceof THREE.InstancedMesh ? o.count : 1);
            triangles += n;
            draws++;
            if (!Array.from(o.geometry.getAttribute('position').array).every(Number.isFinite))
                finite = false;
        }
    });
    const scene = new THREE.Scene();
    scene.add(theme.group);
    for (const [width, height] of [[1200, 900], [600, 1000]]) {
        const fakeRenderer = {
            domElement: {
                parentElement: {
                    clientWidth: width, clientHeight: height
                }
            }, setSize() {
            }
        };
        const camera = new THREE.OrthographicCamera(-12, 12, 10, -10, .1, 150);
        camera.position.copy(theme.cameraPreset.position);
        camera.lookAt(theme.cameraPreset.target);
        camera.updateMatrixWorld();
        fitOrthographicCameraToBounds(camera, fakeRenderer as any, scene, {
            minFrustumHeight: 17
        });
        const box = theme.getContentBounds();
        let contained = true;
        for (const x of [box.min.x, box.max.x])
            for (const y of [box.min.y, box.max.y])
                for (const z of [box.min.z, box.max.z]) {
                    const p = new THREE.Vector3(x, y, z).project(camera);
                    if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1)
                        contained = false;
                }
        check(contained, `Actual camera fitter contains content bounds at aspect ${width / height}`);
    }
    check(finite && triangles < 400000, 'All procedural vertices finite; triangle budget <400k');
    check(draws < 90, 'Scene batches bound draw submissions');
    check(theme.architecture.lanterns.count === 52, '52 hanging lanterns in one body batch');
    for (let i = 0; i < HOUSE_SPOTS.length; i++)
        for (let j = i + 1; j < HOUSE_SPOTS.length; j++) {
            const a = HOUSE_SPOTS[i], b = HOUSE_SPOTS[j];
            check(Math.abs(a.x - b.x) > (a.w + b.w) / 2 + .1, 'Neighboring house wall footprints have deliberate alley clearance');
        }
    check(!isRiver(0, -2) && !isRiver(-5.4, 2) && !isRiver(11, 1) && isRiver(0, 2), 'Interaction domain excludes banks, bridge and outside display');
    const ray = new THREE.Ray(new THREE.Vector3(0, 8, 2), new THREE.Vector3(0, -1, 0));
    check(!theme.isInWater(theme.boats.boats[0].position.x, theme.boats.boats[0].position.z), 'Boat footprint blocks releasing lotus inside its hull');
    check(!!theme.intersectWater(ray), 'Actual water proxy ray hits open river');
    ray.origin.x = -5.4;
    check(theme.intersectWater(ray) === null, 'Bridge blocks water interactions');
    let footCount = 0;
    for (const [name, floor] of [['LanternTownHousePlinth', .53], ['LanternTownBridgePosts', -.48]] as const) {
        const mesh = theme.architecture.group.getObjectByName(name) as THREE.InstancedMesh;
        const matrix = new THREE.Matrix4();
        mesh.geometry.computeBoundingBox();
        for (let i = 0; i < mesh.count; i++) {
            mesh.getMatrixAt(i, matrix);
            matrix.premultiply(mesh.matrixWorld);
            const box = mesh.geometry.boundingBox!.clone().applyMatrix4(matrix);
            check(box.min.y <= floor + .0001 && box.min.y >= floor - .025, 'Actual full support footprint contacts its bank/riverbed');
            footCount++;
        }
    }
    check(footCount > 10, 'Tests exercise supports across houses and bridge, not only centers');
    let walkersClear=true;const walkerMatrix=new THREE.Matrix4();const walkers=theme.people.group.children[0]as THREE.InstancedMesh;
    for(let time=0;time<=60;time+=.5){theme.people.update(time);for(let i=0;i<walkers.count;i++){walkers.getMatrixAt(i,walkerMatrix);if(Math.abs(walkerMatrix.elements[12]+5.4)<1.3)walkersClear=false;}}
    check(walkersClear,'Actual silhouette paths stay clear of bridge railings for 60 seconds');
    const manual = theme.lanterns.manualCount;
    theme.reactToSplash(0, 2);
    theme.reactToSplash(0, -2);
    check(theme.lanterns.manualCount === manual + 1, 'Only a real open-water click releases a lantern');
    for (let i = 0; i < 100; i++)
        theme.update(.1, i * .1, {
            ...state, season: 'festival', rainIntensity: .65
        });
    check(theme.lanterns.festival > .99, 'Festival reaches a distinct dense lantern state');
    check(theme.terrain.moisture > .8, 'Rain wets outdoor paving continuously');
    const before = theme.lanterns.festival, wet = theme.terrain.moisture;
    theme.applyState(state);
    check(theme.lanterns.festival === before && theme.terrain.moisture === wet, 'State reversal does not reset festival or retained moisture');
    for (let i = 0; i < 100; i++)
        theme.update(.1, 10 + i * .1, state);
    check(theme.lanterns.festival < .001 && theme.terrain.moisture > 0 && theme.terrain.moisture < wet, 'Normal night returns gradually while paving retains wetness');
    for (const tide of ['high', 'low'] as const)
        for (const w of [.1, 1])
            for (const t of [0, 4, 9]) {
                theme.update(.2, t, {
                    ...state, tide, windStrength: w
                });
                const uniforms = theme.water.uniforms;
                for (let i = 0; i < theme.boats.boats.length; i++) {
                    const b = theme.boats.boats[i], height = theme.water.height(b.position.x, b.position.z);
                    check(Math.abs(b.position.y - height) < 1e-8, 'Moored hull waterline uses actual rendered wave field');
                    const e = .0001, dx = (theme.water.height(b.position.x + e, b.position.z) - theme.water.height(b.position.x - e, b.position.z)) / (2 * e), dz = (theme.water.height(b.position.x, b.position.z + e) - theme.water.height(b.position.x, b.position.z - e)) / (2 * e), up = new THREE.Vector3(-dx, 1, -dz).normalize();
                    check(new THREE.Vector3(0, 1, 0).applyQuaternion(b.quaternion).dot(up) > .999999, 'Yaw-aware boat up matches independent finite-difference wave normal');
                    const local = b.position.clone().applyMatrix4(theme.boats.inverse[i]);
                    check(local.length() < 1e-8, 'Final cavity transform tracks final boat pose');
                }
                check(Math.abs(getOceanWaveElevation(1, 2, t, .3) - beachWave(1, 2, t, .3)) < 1e-14, 'Shared river/coastal swell equals the established water model');
            }
    const a = new LanternTheme({} as any), b = new LanternTheme({} as any);
    await a.init();
    await b.init();
    for (let i = 0; i < 600; i++)
        a.update(1 / 60, i / 60, {
            ...state, season: 'festival'
        });
    for (let i = 0; i < 300; i++)
        b.update(1 / 30, i / 30, {
            ...state, season: 'festival'
        });
    check(Math.abs(a.lanterns.festival - b.lanterns.festival) < 1e-12, 'Festival integration independent of FPS');
    check(Array.from(a.architecture.lanterns.geometry.getAttribute('position').array).every((v, i) => v === b.architecture.lanterns.geometry.getAttribute('position').array[i]), 'Procedural seed/build is deterministic');
    let disposed = 0;
    a.group.traverse(o => {
        if (o instanceof THREE.Mesh)
            o.geometry.addEventListener('dispose', () => disposed++);
    });
    a.dispose();
    check(a.group.children.length === 0 && disposed > 20, 'Dispose releases actual geometries and empties root');
    b.dispose();
    theme.dispose();
    const store = new Map<string, string>();
    (globalThis as any).window = {
        localStorage: {
            getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v)
        }
    };
    store.set(STORAGE_KEY, JSON.stringify({
        version: 4, activeThemeId: 'beach', gardenState: {
            ...DEFAULT_GARDEN_STATE, timeOfDay: 9
        }, beachState: {
            ...DEFAULT_BEACH_STATE, season: 'rainy'
        }, shared: {
            quality: 'high'
        }
    }));
    const migrated = loadPersistedAppState();
    check(migrated.version === CURRENT_STORAGE_VERSION && migrated.gardenState.timeOfDay === 9 && migrated.beachState.season === 'rainy' && migrated.lanternState.season === 'night', 'Storage v4 migration preserves old states and initializes isolated lantern state');
    migrated.activeThemeId = 'lantern';
    migrated.lanternState.rainIntensity = .65;
    savePersistedAppState(migrated);
    check(loadPersistedAppState().activeThemeId === 'lantern' && loadPersistedAppState().lanternState.rainIntensity === .65, 'Lantern mode and rain survive storage roundtrip');
    delete (globalThis as any).window;
    console.log(`PASS ${tests} Lantern Town checks; triangles=${triangles}, mesh submissions=${draws}, hanging-lantern bodies=1 draw call`);
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
