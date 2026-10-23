import * as THREE from 'three';
import { Batch, transform, beam } from './geometry';
import { HOUSE_SPOTS, LANTERN_COLORS } from './config';
export function roofTopAt(x: number, width: number) {
    const t = Math.max(0, Math.min(1, (-.44 + Math.sqrt(.1936 + .24 * Math.abs(x) / width)) / .12));
    return .78 * (1 - t) * (1 - t) + .24 * (1 - t) * t;
}
function roofGeometry(width: number, depth: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.quadraticCurveTo(-width * .22, .12, 0, .78);
    shape.quadraticCurveTo(width * .22, .12, width / 2, 0);
    shape.lineTo(width / 2, -.1);
    shape.quadraticCurveTo(width * .22, .02, 0, .65);
    shape.quadraticCurveTo(-width * .22, .02, -width / 2, -.1);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
        depth, bevelEnabled: false, curveSegments: 12
    });
    g.translate(0, 0, -depth / 2);
    return g;
}
export function createArchitecture(parent: THREE.Group) {
    const group = new THREE.Group();
    group.name = 'LanternTownArchitecture';
    parent.add(group);
    const batch = new Batch();
    const wall = new THREE.MeshStandardMaterial({
        color: 0xd3a348, roughness: .95
    }), wallAlt = new THREE.MeshStandardMaterial({
        color: 0xe0bb60, roughness: .92
    }), wood = new THREE.MeshStandardMaterial({
        color: 0x523626, roughness: .82
    }), trim = new THREE.MeshStandardMaterial({
        color: 0x332b2b, roughness: .8
    }), tile = new THREE.MeshStandardMaterial({
        color: 0x805344, roughness: .85
    }), tileAlt = new THREE.MeshStandardMaterial({
        color: 0x9b6650, roughness: .9
    }), glass = new THREE.MeshStandardMaterial({
        color: 0xffce74, emissive: 0xffa942, emissiveIntensity: .6, roughness: .4
    });
    const box = (name: string, mat: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number) => batch.add(name, new THREE.BoxGeometry(1, 1, 1), mat, transform(x, y, z, w, h, d));
    for (const [i, s] of HOUSE_SPOTS.entries()) {
        box('LanternTownHouseWalls' + i % 2, i % 2 ? wall : wallAlt, s.x, .57 + s.h / 2, s.z, s.w, s.h, s.d);
        box('LanternTownHousePlinth', trim, s.x, .59, s.z, s.w + .12, .15, s.d + .12);
        // Recessed wooden shop fronts, glowing windows and balcony supported on posts.
        const front = s.z + s.d / 2 + .035;
        box('LanternTownDoors', wood, s.x, .57 + .77, front, .73, 1.54, .11);
        for (const side of [-1, 1]) {
            box('LanternTownWindowFrames', wood, s.x + side * .8, 1.67, front, .60, .94, .14);
            box('LanternTownWindowGlass', glass, s.x + side * .8, 1.67, front + .076, .43, .76, .025);
            for (const dx of [-.14, 0, .14])
                box('LanternTownShutters', wood, s.x + side * .8 + dx, 1.67, front + .105, .035, .80, .045);
        }
        box('LanternTownBalconyDecks', wood, s.x, 2.22, front + .24, 2.14, .12, .66);
        for (const side of [-1, 1])
            box('LanternTownBalconySupports', wood, s.x + side * .94, 1.43, front + .46, .075, 1.55, .075);
        box('LanternTownBalconyRail', wood, s.x, 2.73, front + .51, 2.14, .065, .065);
        for (let j = 0; j < 12; j++)
            box('LanternTownBalusters', wood, s.x - 1 + j * .18, 2.48, front + .51, .035, .45, .035);
        const roofY = .57 + s.h;
        // Close both attic ends against the actual curved roof underside.
        const gableShape=new THREE.Shape();gableShape.moveTo(-s.w/2,-.03);
        for(let j=0;j<=20;j++){const x=-s.w/2+j*s.w/20;gableShape.lineTo(x,Math.max(0,roofTopAt(x,s.w+.42)-.10));}
        gableShape.lineTo(s.w/2,-.03);gableShape.closePath();
        for(const side of [-1,1]){const gable=new THREE.ExtrudeGeometry(gableShape,{depth:.12,bevelEnabled:false});gable.translate(0,0,-.06);batch.add('LanternTownGables'+i%2,gable,i%2?wall:wallAlt,transform(s.x,roofY,s.z+side*(s.d/2-.01)));}

        batch.add('LanternTownTiledRoofs', roofGeometry(s.w + .42, s.d + .45), tile, transform(s.x, roofY, s.z));
        for (let ix = 0; ix < 18; ix++)
            for (let iz = 0; iz < 11; iz++) {
                const x = -1.3 + ix * 2.6 / 17, u = Math.abs(x) / 1.385;
                const y = roofTopAt(x, s.w + .42) + .04;
                const matrix = new THREE.Matrix4().compose(new THREE.Vector3(s.x + x, roofY + y, s.z - 1.51 + iz * .30), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), new THREE.Vector3(.072, .30, .045));
                batch.add('LanternTownRoofTiles' + (ix % 2), new THREE.CylinderGeometry(1, 1, 1, 6, 1), ix % 2 ? tile : tileAlt, matrix);
            }
        box('LanternTownRidgeCaps', tileAlt, s.x, roofY + .79, s.z, .13, .13, s.d + .58);
    }
    // Cambered bridge: linked deck modules, columns planted in bed and roof following the arch.
    for (let j = 0; j < 27; j++) {
        const z = -1.7 + j * .27, arch = .22 * Math.sin(j / 26 * Math.PI), y = .82 + arch;
        box('LanternTownBridgeDeck', wood, -5.4, y, z, 1.95, .14, .28);
        for (const side of [-1, 1]) {
            box('LanternTownBridgeRails', wood, -5.4 + side * .91, y + .55, z, .08, .08, .29);
            if (j % 4 === 0 || j === 26) {
                box('LanternTownBridgePosts', wood, -5.4 + side * .87, (y - .48) / 2, z, .13, y + .48, .13);
                box('LanternTownBridgeUpperPosts', wood, -5.4 + side * .87, y + .88, z, .10, 1.72, .10);
            }
        }
        batch.add('LanternTownBridgeRoof', roofGeometry(2.35, .29), tile, transform(-5.4, y + 1.77, z));
    }
    // Short grounded stone approaches meet the bridge; no long exterior staircase.
    for (const [z, sign] of [[-1.95, -1], [5.55, 1]])
        for (let j = 0; j < 3; j++)
            box('LanternTownBridgeApproaches', trim, -5.4, .54 + (2 - j) * .095, z + sign * j * .22, 1.95, .12 + (2 - j) * .19, .24);
    // Cable lines and anchor poles, with hanging lanterns rooted at their actual cable positions.
    const lanternAnchors: THREE.Vector3[] = [];
    for (const z of [-2.1, 5.85]) {
        for (const x of [-9.8, 0, 9.8])
            box('LanternTownStreetPosts', wood, x, 2.18, z, .10, 3.25, .10);
        for (let segment = 0; segment < 2; segment++) {
            const start = -9.8 + segment * 9.8;
            for (let j = 0; j < 24; j++) {
                const x0 = start + j * 9.8 / 24, x1 = start + (j + 1) * 9.8 / 24;
                const y0 = 3.80 - .38 * Math.sin(j / 24 * Math.PI), y1 = 3.80 - .38 * Math.sin((j + 1) / 24 * Math.PI);
                batch.add('LanternTownCables', new THREE.BoxGeometry(1, 1, 1), trim, beam(new THREE.Vector3(x0, y0, z), new THREE.Vector3(x1, y1, z), .018));
            }
            for (let j = 0; j < 13; j++) {
                const f = (j + .3) / 13;
                lanternAnchors.push(new THREE.Vector3(start + f * 9.8, 3.80 - .38 * Math.sin(f * Math.PI), z));
            }
        }
    }
    batch.finish(group);
    const lampPositions = lanternAnchors.map(a => new THREE.Vector2(a.x, a.z));
    const lanternGeometry = new THREE.SphereGeometry(1, 12, 8), lanternMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    const lanterns = new THREE.InstancedMesh(lanternGeometry, lanternMaterial, lanternAnchors.length);
    lanterns.name = 'LanternTownHangingLanterns';
    group.add(lanterns);
    const halo = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 6), new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false
    }), lanternAnchors.length);
    halo.name = 'LanternTownLanternHalos';
    halo.frustumCulled = false;
    group.add(halo);
    const strings = new THREE.InstancedMesh(new THREE.CylinderGeometry(.006, .006, .05, 5), trim, lanternAnchors.length);
    strings.name = 'LanternTownLanternHangers';
    group.add(strings);
    const caps = new THREE.InstancedMesh(new THREE.CylinderGeometry(.095, .095, .035, 10), trim, lanternAnchors.length * 2);
    caps.name = 'LanternTownLanternCaps';
    group.add(caps);
    for (let i = 0; i < lanterns.count; i++) {
        const c = new THREE.Color(LANTERN_COLORS[i % 6]);
        lanterns.setColorAt(i, c);
        halo.setColorAt(i, c);
    }
    const dummy = new THREE.Object3D(), anchor = new THREE.Vector3(), cap = new THREE.Vector3(), q = new THREE.Quaternion(), axis = new THREE.Vector3(0, 0, 1), offset = new THREE.Vector3();
    function update(time: number, wind: number, rain: number) {
        for (let i = 0; i < lanternAnchors.length; i++) {
            anchor.copy(lanternAnchors[i]);
            q.setFromAxisAngle(axis, Math.sin(time * .8 - i * .67) * wind * .14);
            offset.set(0, -.27, 0).applyQuaternion(q);
            dummy.position.copy(anchor).add(offset);
            dummy.quaternion.copy(q);
            dummy.scale.set(.16, .235, .16);
            dummy.updateMatrix();
            lanterns.setMatrixAt(i, dummy.matrix);
            lampPositions[i].set(dummy.position.x, dummy.position.z);
            dummy.scale.set(.29 * (1 - rain * .28), .37 * (1 - rain * .28), .29 * (1 - rain * .28));
            dummy.updateMatrix();
            halo.setMatrixAt(i, dummy.matrix);
            dummy.position.copy(anchor);
            offset.set(0, -.025, 0).applyQuaternion(q);
            dummy.position.add(offset);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            strings.setMatrixAt(i, dummy.matrix);
            for (let j = 0; j < 2; j++) {
                cap.set(0, j ? -.50 : -.04, 0).applyQuaternion(q).add(anchor);
                dummy.position.copy(cap);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                caps.setMatrixAt(i * 2 + j, dummy.matrix);
            }
        }
        lanterns.instanceMatrix.needsUpdate = true;
        halo.instanceMatrix.needsUpdate = true;
        strings.instanceMatrix.needsUpdate = true;
        caps.instanceMatrix.needsUpdate = true;
        glass.emissiveIntensity = .6 + rain * .1;
    }
    update(0, 0, 0);
    lanterns.computeBoundingBox();
    lanterns.computeBoundingSphere();
    lanterns.boundingSphere!.radius += .2;
    caps.computeBoundingSphere();
    caps.boundingSphere!.radius += .2;
    strings.computeBoundingSphere();
    strings.boundingSphere!.radius += .2;
    return {
        group, lanterns, lanternAnchors, lampPositions, update
    };
}
