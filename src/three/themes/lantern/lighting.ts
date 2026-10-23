import * as THREE from 'three';
export function createLighting(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownLighting';
    parent.add(group);
    const ambient = new THREE.HemisphereLight(0x818fce, 0x503229, 1.6), sun = new THREE.DirectionalLight(0xc2c9ff, 1.4);
    sun.position.set(-7, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
        left: -14, right: 14, top: 12, bottom: -12, near: .5, far: 45
    });
    sun.shadow.bias = -.0003;
    group.add(ambient, sun);
    for (const x of [-7, -2, 3, 8]) {
        const light = new THREE.PointLight(0xffba69, 9, 6, 2);
        light.position.set(x, 2.4, -1.3);
        group.add(light);
    }
    const moon = new THREE.Mesh(new THREE.SphereGeometry(.72, 24, 16), new THREE.MeshBasicMaterial({
        color: 0xffedc4
    }));
    moon.name = 'LanternTownMoon';
    moon.position.set(6.7, 6, -5.8);
    parent.add(moon);
    const container = typeof document === 'undefined' ? null : document.querySelector('.canvas-container') as HTMLElement | null;
    let last = '';
    let lastApplied = '';
    const base = [0x151c3c, 0x443965, 0x9e6475].map(c => new THREE.Color(c)), fest = [0x111936, 0x393365, 0xb07075].map(c => new THREE.Color(c)), wet = [0x181e34, 0x35425b, 0x6a5968].map(c => new THREE.Color(c)), sky = base.map(c => c.clone());
    return {
        update(festival: number, rain: number, hour = 19.5) {
            const night = THREE.MathUtils.smoothstep(hour, 18, 22);
            moon.scale.setScalar(.38 + festival * .62);
            (moon.material as THREE.MeshBasicMaterial).color.setRGB(1 - rain * .25, .86 - rain * .18, .64 - rain * .1);
            sun.intensity = 1.4 - rain * .25;
            ambient.intensity = 1.85 - night * .4 + festival * .15;
            const scene = parent.parent;
            if (scene instanceof THREE.Scene)
                scene.background = null;
            for (let i = 0; i < 3; i++)
                sky[i].copy(base[i]).lerp(fest[i], festival).lerp(wet[i], rain).multiplyScalar(1 - night * .18);
            const gradient = `linear-gradient(180deg,#${sky[0].getHexString()},#${sky[1].getHexString()} 60%,#${sky[2].getHexString()})`;
            if (container && scene instanceof THREE.Scene && last !== gradient) {
                container.style.background = gradient;
                lastApplied = container.style.background;
                last = gradient;
            }
        }, dispose() {
            if (container && container.style.background === lastApplied)
                container.style.background = '';
        }
    };
}
