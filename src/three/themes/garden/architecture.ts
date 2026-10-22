import * as THREE from 'three';
import { createSurfaceCoating, createFabricShell } from '../../core/objectGeometry';
import { COLORS, GLAMPING_CENTER_X, GLAMPING_CENTER_Z, Season } from './constants';
import { rng } from './noise';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export interface ArchitectureSystem {
  group: THREE.Group;
  emissiveMeshes: THREE.Mesh[];
  fireMesh: THREE.Mesh | null;
  update(dt: number, elapsed: number, timeOfDay: number): void;
  updateSeason(season: Season, t: number): void;
  dispose(): void;
}

export interface SteppingStoneSpot {
  x: number;
  z: number;
  r?: number;
  rot?: number;
}

export const GARDEN_STEPPING_STONES: SteppingStoneSpot[] = [
  // 1. Cabin porch (-1.0, -0.9) to Campfire (-3.2, -0.8)
  { x: -1.35, z: -0.95, r: 0.22, rot: 0.35 },
  { x: -1.75, z: -0.92, r: 0.21, rot: 0.82 },
  { x: -2.15, z: -0.90, r: 0.23, rot: 1.25 },
  { x: -2.55, z: -0.88, r: 0.20, rot: 0.15 },
  { x: -2.90, z: -0.85, r: 0.22, rot: 0.65 },

  // 2. Dome 1 (-5.0, -2.0) to Campfire
  { x: -4.20, z: -1.65, r: 0.22, rot: 0.45 },
  { x: -3.95, z: -1.40, r: 0.20, rot: 1.10 },
  { x: -3.70, z: -1.15, r: 0.23, rot: 0.20 },
  { x: -3.45, z: -0.95, r: 0.21, rot: 0.75 },

  // 3. Dome 1 to Picnic Table (-6.2, -0.5)
  { x: -4.85, z: -1.75, r: 0.21, rot: 0.90 },
  { x: -5.20, z: -1.50, r: 0.23, rot: 0.30 },
  { x: -5.55, z: -1.20, r: 0.20, rot: 1.45 },
  { x: -5.85, z: -0.90, r: 0.22, rot: 0.60 },
  { x: -6.10, z: -0.65, r: 0.24, rot: 0.10 },

  // 4. Picnic Table to Dome 3 & Meadow Hub
  { x: -5.75, z: -0.45, r: 0.20, rot: 0.85 },
  { x: -5.35, z: -0.40, r: 0.22, rot: 0.40 },
  { x: -4.95, z: -0.35, r: 0.21, rot: 1.30 },
  { x: -4.60, z: -0.30, r: 0.23, rot: 0.15 },

  // 5. Dome 3 (-4.2, 0.05) to Campfire
  { x: -3.90, z: -0.15, r: 0.22, rot: 0.55 },
  { x: -3.65, z: -0.40, r: 0.20, rot: 1.05 },
  { x: -3.40, z: -0.65, r: 0.23, rot: 0.25 },

  // 6. Dome 3 to Hillside Trail Junction (-2.60, 0.60)
  { x: -3.80, z: 0.35,  r: 0.21, rot: 0.70 },
  { x: -3.45, z: 0.48,  r: 0.23, rot: 0.15 },
  { x: -3.05, z: 0.55,  r: 0.20, rot: 1.20 },
  { x: -2.70, z: 0.58,  r: 0.22, rot: 0.50 },

  // 7. Dome 2 (-2.2, -1.2) to Campfire
  { x: -2.40, z: -1.05, r: 0.21, rot: 0.30 },
  { x: -2.75, z: -0.95, r: 0.22, rot: 0.95 },

  // 8. Dome 2 Southward towards Hillside Trail Junction
  { x: -2.25, z: -0.50, r: 0.20, rot: 0.65 },
  { x: -2.35, z: -0.15, r: 0.22, rot: 1.40 },
  { x: -2.45, z: 0.20,  r: 0.23, rot: 0.25 },
  { x: -2.55, z: 0.50,  r: 0.21, rot: 0.80 },

  // 9. Continuous Gentle Hillside Trail (men theo sườn thoải từ thềm xuống bãi sỏi)
  // Winding S-curve trail avoiding steep ~41° cliff, maintaining gentle descent gradients
  { x: -2.70, z: 0.65,  r: 0.22, rot: 0.40 },
  { x: -2.45, z: 0.88,  r: 0.21, rot: 1.15 },
  { x: -2.20, z: 1.10,  r: 0.23, rot: 0.25 },
  { x: -1.95, z: 1.32,  r: 0.22, rot: 0.75 },
  { x: -1.70, z: 1.54,  r: 0.24, rot: 1.35 },
  { x: -1.45, z: 1.76,  r: 0.21, rot: 0.10 },
  { x: -1.22, z: 2.00,  r: 0.23, rot: 0.60 },
  { x: -1.02, z: 2.25,  r: 0.22, rot: 1.05 },
  { x: -0.90, z: 2.52,  r: 0.24, rot: 0.35 },
  { x: -0.92, z: 2.80,  r: 0.21, rot: 0.90 },
  { x: -1.08, z: 3.08,  r: 0.23, rot: 0.15 },
  { x: -1.30, z: 3.36,  r: 0.22, rot: 0.70 },
  { x: -1.48, z: 3.68,  r: 0.24, rot: 1.25 },

  // 10. Bãi sỏi ven suối (Left bank dry gravel shoreline)
  { x: -1.45, z: 4.05,  r: 0.22, rot: 0.50 },
  { x: -1.40, z: 4.40,  r: 0.23, rot: 1.20 },
  { x: -1.45, z: 4.75,  r: 0.21, rot: 0.30 },
  { x: -1.55, z: 5.10,  r: 0.24, rot: 0.85 },
  { x: -1.70, z: 5.45,  r: 0.22, rot: 0.15 },

  // 11. Right Bank Pebble Trail to SUP landing (safely >0.65m clear from Boulder 2 at 4.60, 3.60)
  { x: 4.60,  z: 2.10,  r: 0.22, rot: 0.45 },
  { x: 4.90,  z: 2.45,  r: 0.24, rot: 1.10 },
  { x: 5.25,  z: 2.80,  r: 0.21, rot: 0.20 },
  { x: 5.60,  z: 3.18,  r: 0.23, rot: 0.75 },
  { x: 5.85,  z: 3.55,  r: 0.22, rot: 1.30 },
];

export function createIrregularFlagstoneGeometry(radius: number, seed: number): THREE.BufferGeometry {
  const segments = 8;
  const positions: number[] = [];
  const colors: number[] = [];
  const normals: number[] = [];

  const stoneH = 0.045; // 4.5cm thickness
  const halfH = stoneH / 2;

  // Natural weathered river/fieldstone color
  const topColor = new THREE.Color(0x827d75).offsetHSL(
    Math.sin(seed * 2.7) * 0.02,
    Math.cos(seed * 1.9) * 0.03,
    Math.sin(seed * 4.3) * 0.03
  );
  const bottomColor = topColor.clone().multiplyScalar(0.70);

  const rTop: number[] = [];
  const rBot: number[] = [];
  for (let k = 0; k < segments; k++) {
    const ang = (k / segments) * Math.PI * 2;
    const wave = 1.0 + Math.sin(ang * 2.0 + seed * 1.7) * 0.13 + Math.cos(ang * 3.0 + seed * 2.5) * 0.07;
    const rt = radius * wave;
    rTop.push(rt);
    rBot.push(rt * 0.88); // bottom bevel into soil
  }

  // Top face fan (faces strictly UP +Y, CCW order when viewed from +Y: topCenter, p1, p0)
  const topCenter = new THREE.Vector3(0, halfH, 0);
  for (let k = 0; k < segments; k++) {
    const kNext = (k + 1) % segments;
    const ang0 = (k / segments) * Math.PI * 2;
    const ang1 = ((k + 1) / segments) * Math.PI * 2;

    const p0 = new THREE.Vector3(Math.cos(ang0) * rTop[k], halfH, Math.sin(ang0) * rTop[k]);
    const p1 = new THREE.Vector3(Math.cos(ang1) * rTop[kNext], halfH, Math.sin(ang1) * rTop[kNext]);

    positions.push(
      topCenter.x, topCenter.y, topCenter.z,
      p1.x, p1.y, p1.z,
      p0.x, p0.y, p0.z
    );
    for (let c = 0; c < 3; c++) {
      colors.push(topColor.r, topColor.g, topColor.b);
      normals.push(0, 1, 0);
    }
  }

  // Bottom face fan (faces strictly DOWN -Y, CCW order when viewed from -Y: botCenter, b0, b1)
  const botCenter = new THREE.Vector3(0, -halfH, 0);
  for (let k = 0; k < segments; k++) {
    const kNext = (k + 1) % segments;
    const ang0 = (k / segments) * Math.PI * 2;
    const ang1 = ((k + 1) / segments) * Math.PI * 2;

    const b0 = new THREE.Vector3(Math.cos(ang0) * rBot[k], -halfH, Math.sin(ang0) * rBot[k]);
    const b1 = new THREE.Vector3(Math.cos(ang1) * rBot[kNext], -halfH, Math.sin(ang1) * rBot[kNext]);

    positions.push(
      botCenter.x, botCenter.y, botCenter.z,
      b0.x, b0.y, b0.z,
      b1.x, b1.y, b1.z
    );
    for (let c = 0; c < 3; c++) {
      colors.push(bottomColor.r, bottomColor.g, bottomColor.b);
      normals.push(0, -1, 0);
    }
  }

  // Side quads (facing OUTWARD: t0, t1, b1 and t0, b1, b0)
  for (let k = 0; k < segments; k++) {
    const kNext = (k + 1) % segments;
    const ang0 = (k / segments) * Math.PI * 2;
    const ang1 = ((k + 1) / segments) * Math.PI * 2;

    const t0 = new THREE.Vector3(Math.cos(ang0) * rTop[k], halfH, Math.sin(ang0) * rTop[k]);
    const t1 = new THREE.Vector3(Math.cos(ang1) * rTop[kNext], halfH, Math.sin(ang1) * rTop[kNext]);
    const b0 = new THREE.Vector3(Math.cos(ang0) * rBot[k], -halfH, Math.sin(ang0) * rBot[k]);
    const b1 = new THREE.Vector3(Math.cos(ang1) * rBot[kNext], -halfH, Math.sin(ang1) * rBot[kNext]);

    positions.push(
      t0.x, t0.y, t0.z,
      t1.x, t1.y, t1.z,
      b1.x, b1.y, b1.z,

      t0.x, t0.y, t0.z,
      b1.x, b1.y, b1.z,
      b0.x, b0.y, b0.z
    );

    const edge1 = new THREE.Vector3().subVectors(t1, t0);
    const edge2 = new THREE.Vector3().subVectors(b1, t0);
    const sideNorm = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

    for (let c = 0; c < 6; c++) {
      const col = c % 2 === 0 ? topColor : bottomColor;
      colors.push(col.r, col.g, col.b);
      normals.push(sideNorm.x, sideNorm.y, sideNorm.z);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geo;
}

function prepareGeometry(
  geo: THREE.BufferGeometry,
  color: THREE.Color | number | ((pos: THREE.Vector3, norm: THREE.Vector3, index: number) => THREE.Color)
): THREE.BufferGeometry {
  const nonIndexed = geo.index ? geo.toNonIndexed() : geo.clone();
  delete nonIndexed.attributes.uv;
  if (!nonIndexed.attributes.normal) {
    nonIndexed.computeVertexNormals();
  }

  const count = nonIndexed.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const posAttr = nonIndexed.attributes.position;
  const normAttr = nonIndexed.attributes.normal;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  if (typeof color === 'function') {
    for (let i = 0; i < count; i++) {
      p.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      if (normAttr) n.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      const c = color(p, n, i);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
  } else {
    const c = color instanceof THREE.Color ? color : new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
  }

  nonIndexed.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return nonIndexed;
}

function createGeodesicDomeHemisphere(): { domeGeo: THREE.BufferGeometry; edgesGeo: THREE.BufferGeometry } {
  const baseIco = new THREE.IcosahedronGeometry(1.0, 2);
  const posAttr = baseIco.attributes.position;
  const positions: number[] = [];
  const colors: number[] = [];

  const tentBaseColor = COLORS.architecture.tent;
  const tentAltColor = new THREE.Color(0xeee5d6);
  const doorColor = new THREE.Color(0x35281e);

  const radius = 0.72;
  const height = 0.62;

  for (let i = 0; i < posAttr.count; i += 3) {
    const y0 = posAttr.getY(i);
    const y1 = posAttr.getY(i + 1);
    const y2 = posAttr.getY(i + 2);
    const cy = (y0 + y1 + y2) / 3;

    if (Math.max(y0,y1,y2) >= 0) {
      const cx=(posAttr.getX(i)+posAttr.getX(i+1)+posAttr.getX(i+2))/3;
      const cz=(posAttr.getZ(i)+posAttr.getZ(i+1)+posAttr.getZ(i+2))/3;
      const isDoor=cz>.45&&Math.abs(cx)<.28&&cy<.40;
      const color=isDoor?doorColor:((i/3)%2===0?tentBaseColor:tentAltColor);
      const tri=[0,1,2].map(j=>new THREE.Vector3(posAttr.getX(i+j)*radius,posAttr.getY(i+j)*height,posAttr.getZ(i+j)*radius));
      const polygon:THREE.Vector3[]=[];
      for(let j=0;j<3;j++){
        const a=tri[j],b=tri[(j+1)%3];
        if(a.y>=0)polygon.push(a);
        if((a.y>=0)!==(b.y>=0))polygon.push(a.clone().lerp(b,a.y/(a.y-b.y)));
      }
      for(let j=1;j+1<polygon.length;j++)for(const v of [polygon[0],polygon[j],polygon[j+1]]){
        positions.push(v.x,v.y,v.z);colors.push(color.r,color.g,color.b);
      }
    }
  }

  const domeGeo = new THREE.BufferGeometry();
  domeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  domeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  domeGeo.computeVertexNormals();

  const edgesGeo = new THREE.EdgesGeometry(domeGeo, 1);
  return { domeGeo, edgesGeo };
}

export function createArchitecture(
  scene: THREE.Scene,
  getHeightAt: (x: number, z: number) => number
): ArchitectureSystem {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'architecture';

  const emissiveMeshes: THREE.Mesh[] = [];
  let fireMesh: THREE.Mesh | null = null;

  const woodGeometries: THREE.BufferGeometry[] = [];
  const stoneGeometries: THREE.BufferGeometry[] = [];
  const propGeometries: THREE.BufferGeometry[] = [];
  const snowGeometries: THREE.BufferGeometry[] = [];

  const woodMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.05,
    flatShading: true,
  });

  const stoneMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.05,
    flatShading: true,
  });

  const propMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.62,
    metalness: 0.05,
    flatShading: true,
  });

  // 1. THREE GEODESIC DOME TENTS ON INDIVIDUAL WOODEN DECKS
  // Separated across the meadow with space and natural vegetation between them
  const domeConfigs = [
    { x: -6.0, z: -2.2, rotY: 0.15 }, // Dome 1 (Back left)
    { x: -3.8, z: -1.8, rotY: -0.20 }, // Dome 2 (Mid right)
    { x: -4.30, z: 0.05, rotY: 0.05 },   // Dome 3 (Front left)
  ];

  domeConfigs.forEach((cfg, idx) => {
    const groundY = getHeightAt(cfg.x, cfg.z);
    // Distinct compact individual platform for each dome
    const platformW = 1.72;
    const platformD = 1.72;
    const platformH = 0.09;
    let highest=groundY;
    for(let ix=0;ix<=6;ix++)for(let iz=0;iz<=6;iz++)highest=Math.max(highest,getHeightAt(cfg.x-.86+ix*1.72/6,cfg.z-.86+iz*1.72/6));
    const platformTopY=Math.max(groundY+platformH,highest+platformH+.015);
    const deckBottomY=platformTopY-platformH;

    // Separate wooden planks
    const plankCount = 8;
    const plankW = (platformW - 0.03) / plankCount;
    for (let p = 0; p < plankCount; p++) {
      const plankGeo = new THREE.BoxGeometry(plankW - 0.015, platformH, platformD).toNonIndexed();
      const px = -platformW / 2 + 0.015 + (p + 0.5) * plankW;
      plankGeo.translate(cfg.x + px, deckBottomY + platformH / 2, cfg.z);

      plankGeo.userData.role='deck';
      const baseCol = p % 2 === 0 ? COLORS.wood.plank.clone() : COLORS.wood.light.clone();
      woodGeometries.push(prepareGeometry(plankGeo, (_p, norm) => {
        return Math.abs(norm.x) > 0.8 ? COLORS.wood.dark : baseCol;
      }));
    }

    // Individual step at front (+Z direction)
    const stepGeo = new THREE.BoxGeometry(0.70, 0.05, 0.22).toNonIndexed();
    stepGeo.translate(cfg.x, groundY + 0.025, cfg.z + platformD / 2 + 0.11);
    woodGeometries.push(prepareGeometry(stepGeo, COLORS.wood.light));

    // Sturdy corner foundation posts firmly in ground
    const cornerOffsets = [
      [-0.76, -0.76],
      [0.76, -0.76],
      [-0.76, 0.76],
      [0.76, 0.76],
    ];
    cornerOffsets.forEach(([cx, cz]) => {
      const cornerGround = getHeightAt(cfg.x + cx, cfg.z + cz);
      const postTop=deckBottomY+.006;
      const postH=postTop-cornerGround+.03;
      const post = new THREE.BoxGeometry(0.09, postH, 0.09).toNonIndexed();
      post.translate(cfg.x + cx, postTop - postH / 2, cfg.z + cz);
      const foot=post.getAttribute('position');
      for(let v=0;v<foot.count;v++)if(foot.getY(v)<postTop-postH+.001)foot.setY(v,getHeightAt(foot.getX(v),foot.getZ(v))-.025);
      post.computeVertexNormals();
      post.userData.role='foundation';
      woodGeometries.push(prepareGeometry(post,COLORS.wood.dark));
    });

    // Geodesic Dome Mesh
    const { domeGeo, edgesGeo } = createGeodesicDomeHemisphere();

    const domeFabricMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color(0xff9a2e),
      emissiveIntensity: 0.0,
      flatShading: true,
      side: THREE.FrontSide,
    });

    const domeShell=createFabricShell(domeGeo,.008);
    const domeMesh = new THREE.Mesh(domeShell, domeFabricMat);
    domeMesh.name = `domeTent_${idx}`;
    domeMesh.position.set(cfg.x, platformTopY, cfg.z);
    domeMesh.rotation.y = cfg.rotY;
    rootGroup.add(domeMesh);
    emissiveMeshes.push(domeMesh);

    // The structural struts sit beneath the fabric; their lower ends seat into the deck.
    const strutGeo=new THREE.CylinderGeometry(.006,.006,1,5);
    const strutMat=new THREE.MeshStandardMaterial({color:0xb29f86,roughness:.7});
    const ep=edgesGeo.getAttribute('position');
    const struts=new THREE.InstancedMesh(strutGeo,strutMat,ep.count/2);struts.name=`DomeFrame_${idx}`;
    const frameDummy=new THREE.Object3D(),axis=new THREE.Vector3(0,1,0);
    const inward=(v:THREE.Vector3)=>v.addScaledVector(new THREE.Vector3(v.x/(.72*.72),v.y/(.62*.62),v.z/(.72*.72)).normalize(),-.014);
    for(let e=0;e<ep.count;e+=2){
      const a=inward(new THREE.Vector3().fromBufferAttribute(ep,e)),b=inward(new THREE.Vector3().fromBufferAttribute(ep,e+1));
      frameDummy.position.copy(a).add(b).multiplyScalar(.5);
      frameDummy.quaternion.setFromUnitVectors(axis,b.clone().sub(a).normalize());frameDummy.scale.set(1,a.distanceTo(b),1);frameDummy.updateMatrix();struts.setMatrixAt(e/2,frameDummy.matrix);
    }
    struts.position.copy(domeMesh.position);struts.rotation.copy(domeMesh.rotation);struts.castShadow=true;rootGroup.add(struts);
    const snowCapGeo=createSurfaceCoating(domeGeo,{
      thickness:.018,
      coverage:p=>p.y-.24-.018*Math.sin(p.x*12+p.z*7),
      normal:p=>new THREE.Vector3(p.x/(.72*.72),p.y/(.62*.62),p.z/(.72*.72)).normalize(),
    });
    domeMesh.updateMatrix();snowCapGeo.applyMatrix4(domeMesh.matrix);
    snowGeometries.push(prepareGeometry(snowCapGeo,COLORS.terrain.snow));
    domeGeo.dispose();edgesGeo.dispose();

  });

  // 2. A-FRAME CABIN WITH TEAL ROOF
  // Solidly placed in the back meadow at X = -1.0, Z = -2.5
  const cabinX = -1.0;
  const cabinZ = -2.5;
  const cabinGroundY = getHeightAt(cabinX, cabinZ);
  const cabinFloorH = 0.10;
  let cabinSupportHeight=cabinGroundY;
  for(let ix=0;ix<=8;ix++)for(let iz=0;iz<=10;iz++)cabinSupportHeight=Math.max(cabinSupportHeight,getHeightAt(cabinX-.925+ix*1.85/8,cabinZ-1+iz*2.7/10));
  const cabinFloorY=Math.max(cabinGroundY+cabinFloorH,cabinSupportHeight+cabinFloorH+.015);

  const cabinW = 1.6;
  const cabinD = 2.0;
  const ridgeH = 1.35;
  const porchD = 0.7;
  const totalDeckD = cabinD + porchD;

  // Deck platform
  const cabinDeckGeo = new THREE.BoxGeometry(cabinW + 0.25, cabinFloorH, totalDeckD).toNonIndexed();
  cabinDeckGeo.translate(cabinX, cabinFloorY - cabinFloorH / 2, cabinZ + porchD / 2);
  cabinDeckGeo.userData.role='deck';
  woodGeometries.push(prepareGeometry(cabinDeckGeo, (_p, norm) => {
    return Math.abs(norm.y) > 0.8 ? COLORS.wood.plank : COLORS.wood.dark;
  }));

  // Deck posts into ground
  const cabinPostOffsets = [
    [-(cabinW + 0.1) / 2, -cabinD / 2+.08],
    [(cabinW + 0.1) / 2, -cabinD / 2+.08],
    [-(cabinW + 0.1) / 2, cabinD / 2 + porchD-.08],
    [(cabinW + 0.1) / 2, cabinD / 2 + porchD-.08],
  ];
  cabinPostOffsets.forEach(([cx, cz]) => {
    const cgY = getHeightAt(cabinX + cx, cabinZ + cz);
    const postTop=cabinFloorY-cabinFloorH+.006;
    const stiltH=postTop-cgY+.04;
    const post = new THREE.BoxGeometry(0.12, stiltH, 0.12).toNonIndexed();
    post.translate(cabinX + cx, postTop - stiltH / 2, cabinZ + cz);
    const foot=post.getAttribute('position');
    for(let v=0;v<foot.count;v++)if(foot.getY(v)<postTop-stiltH+.001)foot.setY(v,getHeightAt(foot.getX(v),foot.getZ(v))-.03);
    post.computeVertexNormals();
    post.userData.role='foundation';
    woodGeometries.push(prepareGeometry(post,COLORS.wood.dark));
  });

  // Porch step
  const cabinStep = new THREE.BoxGeometry(0.9, 0.05, 0.28).toNonIndexed();
  cabinStep.translate(cabinX, cabinGroundY + 0.025, cabinZ + cabinD / 2 + porchD + 0.14);
  woodGeometries.push(prepareGeometry(cabinStep, COLORS.wood.light));

  // Front porch railing posts
  const porchPostL = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6).toNonIndexed();
  porchPostL.translate(cabinX - cabinW / 2 + 0.06, cabinFloorY + 0.4, cabinZ + cabinD / 2 + porchD - 0.06);
  woodGeometries.push(prepareGeometry(porchPostL, COLORS.wood.dark));

  const porchPostR = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6).toNonIndexed();
  porchPostR.translate(cabinX + cabinW / 2 - 0.06, cabinFloorY + 0.4, cabinZ + cabinD / 2 + porchD - 0.06);
  woodGeometries.push(prepareGeometry(porchPostR, COLORS.wood.dark));

  // Side rails have a rear upright of their own; the sloped cabin cannot support a high rail at its eaves.
  for(const side of [-1,1]){
    const backPost=new THREE.CylinderGeometry(.04,.04,.8,6).toNonIndexed();
    backPost.translate(cabinX+side*(cabinW/2-.06),cabinFloorY+.4,cabinZ+cabinD/2+.23);
    woodGeometries.push(prepareGeometry(backPost,COLORS.wood.dark));
    for(const height of [.30,.77]){
      const rail=new THREE.BoxGeometry(.045,.045,porchD-.25).toNonIndexed();
      rail.translate(cabinX+side*(cabinW/2-.06),cabinFloorY+height,cabinZ+cabinD/2+porchD/2+.085);
      woodGeometries.push(prepareGeometry(rail,COLORS.wood.dark));
    }
  }

  // Triangular End Walls (front & back) - Warm Cedar Wood
  const cedarWood = new THREE.Color(0x78532f);

  function addTriWall(zVal:number):void {
    const outline=new THREE.Shape();outline.moveTo(-cabinW/2,0);outline.lineTo(cabinW/2,0);outline.lineTo(0,ridgeH);outline.closePath();
    const geometry=new THREE.ExtrudeGeometry(outline,{depth:.055,bevelEnabled:false});
    geometry.translate(cabinX,cabinFloorY,cabinZ+zVal);
    woodGeometries.push(prepareGeometry(geometry,cedarWood));
  }
  addTriWall(-cabinD/2);addTriWall(cabinD/2-.055);

  // Front Door
  const doorGeo = new THREE.BoxGeometry(0.48, 0.78, 0.04).toNonIndexed();
  doorGeo.translate(cabinX, cabinFloorY + 0.39, cabinZ + cabinD / 2 + 0.02);
  woodGeometries.push(prepareGeometry(doorGeo, new THREE.Color(0x3e2c1e)));

  // Upper Triangular Glass Window with warm glow
  const windowShape=new THREE.Shape();windowShape.moveTo(-.18,0);windowShape.lineTo(.18,0);windowShape.lineTo(0,.30);windowShape.closePath();
  const windowGeo=new THREE.ExtrudeGeometry(windowShape,{depth:.015,bevelEnabled:false});
  windowGeo.translate(cabinX,cabinFloorY+.79,cabinZ+cabinD/2+.005);
  const windowMat = new THREE.MeshStandardMaterial({
    color: COLORS.architecture.windowGlow,
    emissive: COLORS.architecture.windowGlow,
    emissiveIntensity: 0.15,
    roughness: 0.3,
  });
  const windowMesh = new THREE.Mesh(windowGeo, windowMat);
  rootGroup.add(windowMesh);
  emissiveMeshes.push(windowMesh);

  // Sloped A-Frame Vivid Teal Roof
  const cabinTeal = new THREE.Color(0x1e8c7c);
  const roofThickness = 0.06;
  const slopeLen = Math.hypot(cabinW / 2, ridgeH) + 0.22;
  const roofAngle = Math.atan2(ridgeH, cabinW / 2);
  const roofD = cabinD + 0.35;

  // Left roof slope
  const roofL = new THREE.BoxGeometry(slopeLen, roofThickness, roofD).toNonIndexed();
  roofL.rotateZ(roofAngle);
  roofL.translate(cabinX - cabinW / 4, cabinFloorY + ridgeH / 2, cabinZ);
  propGeometries.push(prepareGeometry(roofL, cabinTeal));

  // Right roof slope
  const roofR = new THREE.BoxGeometry(slopeLen, roofThickness, roofD).toNonIndexed();
  roofR.rotateZ(-roofAngle);
  roofR.translate(cabinX + cabinW / 4, cabinFloorY + ridgeH / 2, cabinZ);
  propGeometries.push(prepareGeometry(roofR, cabinTeal));

  // Roof ridge beam
  const ridgeBeam = new THREE.BoxGeometry(0.08, 0.08, roofD + 0.06).toNonIndexed();
  ridgeBeam.translate(cabinX, cabinFloorY + ridgeH + 0.04, cabinZ);
  woodGeometries.push(prepareGeometry(ridgeBeam, COLORS.wood.dark));

  // Snow is offset along each actual roof normal, including the roof's existing thickness.
  const roofNormalL=new THREE.Vector3(-Math.sin(roofAngle),Math.cos(roofAngle),0);
  const roofNormalR=new THREE.Vector3(Math.sin(roofAngle),Math.cos(roofAngle),0);
  snowGeometries.push(prepareGeometry(createSurfaceCoating(roofL,{thickness:.018,face:n=>n.dot(roofNormalL)>.99}),COLORS.terrain.snow));
  snowGeometries.push(prepareGeometry(createSurfaceCoating(roofR,{thickness:.018,face:n=>n.dot(roofNormalR)>.99}),COLORS.terrain.snow));

  // 3. CAMPFIRE CIRCLE IN CENTRAL MEADOW
  const fireX = -3.2;
  const fireZ = -0.8;
  const fireGroundY = getHeightAt(fireX, fireZ);

  // Stone ring
  const numFireStones = 8;
  const ringRadius = 0.40;
  for (let s = 0; s < numFireStones; s++) {
    const angle = (s / numFireStones) * Math.PI * 2;
    const stoneGeo = new THREE.DodecahedronGeometry(0.09, 1).toNonIndexed();
    stoneGeo.scale(1.0, 0.65, 1.0);
    stoneGeo.translate(fireX + Math.cos(angle) * ringRadius, fireGroundY + 0.05, fireZ + Math.sin(angle) * ringRadius);
    stoneGeometries.push(prepareGeometry(stoneGeo, COLORS.terrain.rockDark));
  }

  // Charred logs
  for (let l = 0; l < 4; l++) {
    const logGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.38, 6).toNonIndexed();
    logGeo.rotateZ(0.35);
    logGeo.rotateY((l / 4) * Math.PI * 2);
    logGeo.translate(fireX, fireGroundY + 0.06, fireZ);
    woodGeometries.push(prepareGeometry(logGeo, new THREE.Color(0x281e14)));
  }

  // Animated flame cones
  const flameGeo1 = new THREE.ConeGeometry(0.12, 0.35, 6);
  flameGeo1.translate(0, 0.175, 0);
  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff4400,
    emissiveIntensity: 1.0,
    roughness: 0.2,
  });
  fireMesh = new THREE.Mesh(flameGeo1, flameMat);
  fireMesh.position.set(fireX, fireGroundY + 0.05, fireZ);
  rootGroup.add(fireMesh);

  // 4. PICNIC TABLE WITH BENCHES
  const tableX = -6.2;
  const tableZ = -0.5;
  const tableGroundY = getHeightAt(tableX, tableZ);
  const tableTopH = 0.62;
  const tableW = 1.25;
  const tableD = 0.60;

  // Tabletop slats
  for (let tp = 0; tp < 3; tp++) {
    const tz = -tableD / 2 + 0.10 + tp * 0.20;
    const tPlank = new THREE.BoxGeometry(tableW, 0.045, 0.18).toNonIndexed();
    tPlank.translate(tableX, tableGroundY + tableTopH, tableZ + tz);
    woodGeometries.push(prepareGeometry(tPlank, COLORS.wood.plank));
  }

  // Benches
  [-0.45, 0.45].forEach((bz) => {
    const bench = new THREE.BoxGeometry(tableW, 0.045, 0.22).toNonIndexed();
    bench.translate(tableX, tableGroundY + 0.36, tableZ + bz);
    woodGeometries.push(prepareGeometry(bench, COLORS.wood.plank));
  });

  // Table legs
  const legA = new THREE.BoxGeometry(0.05, 0.62, 0.05).toNonIndexed();
  legA.translate(tableX - 0.45, tableGroundY + 0.31, tableZ);
  woodGeometries.push(prepareGeometry(legA, COLORS.wood.dark));

  const legB = new THREE.BoxGeometry(0.05, 0.62, 0.05).toNonIndexed();
  legB.translate(tableX + 0.45, tableGroundY + 0.31, tableZ);
  woodGeometries.push(prepareGeometry(legB, COLORS.wood.dark));

  // 5. NATURAL STEPPING STONE TRAIL (LỐI ĐI LÓT ĐÁ TỰ NHIÊN MEN THEO ĐỊA HÌNH)
  // Winding gently between tents, cabin, picnic table, and down the gentle slope to the waterside pebble shore.
  // Flat, irregular stones partially buried into soil/turf, aligned with terrain normal.
  GARDEN_STEPPING_STONES.forEach((fp, idx) => {
    const groundY = getHeightAt(fp.x, fp.z);
    const eps = (fp.r ?? 0.22) * 0.9;
    const hL = getHeightAt(fp.x - eps, fp.z);
    const hR = getHeightAt(fp.x + eps, fp.z);
    const hD = getHeightAt(fp.x, fp.z - eps);
    const hU = getHeightAt(fp.x, fp.z + eps);
    const terrainNormal = new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU).normalize();

    const stoneGeo = createIrregularFlagstoneGeometry(fp.r ?? 0.22, idx);
    // 1. Decorative yaw rotation around local +Y
    stoneGeo.rotateY(fp.rot ?? (idx * 0.77));
    // 2. Terrain slope alignment: orient stone's top surface normal parallel to true terrain normal
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), terrainNormal);
    stoneGeo.applyQuaternion(q);

    // 3. Terrain grounding: ensure all top vertices stay above terrain mesh (reveal >= 0.6cm)
    // while bottom remains embedded into the soil/turf
    const pAttr = stoneGeo.attributes.position;
    let minReveal = 999;
    for (let i = 0; i < 24; i++) {
      const vx = pAttr.getX(i);
      const vy = pAttr.getY(i);
      const vz = pAttr.getZ(i);
      const terrAtV = getHeightAt(fp.x + vx, fp.z + vz);
      const diff = (groundY + vy) - terrAtV;
      if (diff < minReveal) minReveal = diff;
    }
    let lift = 0.006;
    if (minReveal < 0.004) {
      lift += (0.004 - minReveal);
    }
    const stoneY = groundY + lift;
    stoneGeo.translate(fp.x, stoneY, fp.z);
    stoneGeometries.push(stoneGeo);
  });

  // 7. SUP BOARD AND ACCESSORIES ON PEBBLE BANK
  // Beached naturally on dry gravel shore at water margin (X = 5.0, Z = 4.2)
  const supX = 5.05;
  const supZ = 4.15;
  const supGroundY = getHeightAt(supX, supZ);

  // SUP Hull with tapered bow & stern
  const supLen = 1.95;
  const supWidth = 0.52;
  const supBoard = new THREE.BoxGeometry(supWidth, 0.075, supLen).toNonIndexed();
  const bPos = supBoard.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const zL = bPos.getZ(i);
    const taper = 1.0 - Math.pow(Math.abs(zL) / (supLen * 0.5), 3.0) * 0.32;
    bPos.setX(i, bPos.getX(i) * taper);
  }
  supBoard.computeVertexNormals();
  supBoard.rotateY(-0.42);
  supBoard.rotateZ(0.08); // Gently tilted resting along pebble slope
  supBoard.translate(supX, supGroundY + 0.05, supZ);
  propGeometries.push(prepareGeometry(supBoard, new THREE.Color(0xf9c74f))); // Bright sunny yellow SUP

  // Grip Pad on SUP
  const gripPad = new THREE.BoxGeometry(supWidth * 0.70, 0.01, supLen * 0.62).toNonIndexed();
  gripPad.rotateY(-0.42);
  gripPad.rotateZ(0.08);
  gripPad.translate(supX, supGroundY + 0.088, supZ);
  propGeometries.push(prepareGeometry(gripPad, new THREE.Color(0x18484e))); // Alpine dark teal grip

  // Bungee deck cords across the yellow nose
  [-0.60, -0.48, -0.36].forEach((bz) => {
    const cord = new THREE.BoxGeometry(supWidth * 0.45, 0.012, 0.02).toNonIndexed();
    cord.rotateY(-0.42);
    cord.rotateZ(0.08);
    cord.translate(supX + Math.sin(0.42) * bz, supGroundY + 0.088, supZ + Math.cos(0.42) * bz);
    propGeometries.push(prepareGeometry(cord, new THREE.Color(0x222222)));
  });

  // Paddle with T-grip handle
  const padGroundY = getHeightAt(supX + 0.42, supZ - 0.28);
  const paddleShaft = new THREE.CylinderGeometry(0.012, 0.012, 1.45, 6).toNonIndexed();
  paddleShaft.rotateZ(Math.PI / 2 - 0.12);
  paddleShaft.translate(supX + 0.42, padGroundY + 0.03, supZ - 0.28);
  propGeometries.push(prepareGeometry(paddleShaft, COLORS.wood.dark));

  const paddleBlade = new THREE.BoxGeometry(0.15, 0.01, 0.34).toNonIndexed();
  paddleBlade.rotateY(-0.12);
  paddleBlade.translate(supX + 1.10, padGroundY + 0.025, supZ - 0.18);
  propGeometries.push(prepareGeometry(paddleBlade, new THREE.Color(0xf9c74f)));

  // Ergonomic Life Vest (Áo phao) with twin chest foam pads and buckle straps
  const vestGroundY = getHeightAt(supX + 0.45, supZ + 0.45);
  // Left chest pad
  const vestLeft = new THREE.BoxGeometry(0.13, 0.09, 0.32).toNonIndexed();
  vestLeft.rotateY(0.35);
  vestLeft.translate(supX + 0.38, vestGroundY + 0.05, supZ + 0.42);
  propGeometries.push(prepareGeometry(vestLeft, new THREE.Color(0xf4511e)));

  // Right chest pad
  const vestRight = new THREE.BoxGeometry(0.13, 0.09, 0.32).toNonIndexed();
  vestRight.rotateY(0.35);
  vestRight.translate(supX + 0.52, vestGroundY + 0.05, supZ + 0.48);
  propGeometries.push(prepareGeometry(vestRight, new THREE.Color(0xf4511e)));

  // Webbing buckle straps across vest
  [-0.08, 0.08].forEach((sz) => {
    const strap = new THREE.BoxGeometry(0.26, 0.018, 0.035).toNonIndexed();
    strap.rotateY(0.35);
    strap.translate(supX + 0.45, vestGroundY + 0.095, supZ + 0.45 + sz);
    propGeometries.push(prepareGeometry(strap, new THREE.Color(0x222222)));
  });

  // Wicker Picnic Basket with lid and handle
  const basketGroundY = getHeightAt(supX + 0.50, supZ + 0.90);
  const basket = new THREE.BoxGeometry(0.28, 0.18, 0.22).toNonIndexed();
  basket.rotateY(-0.20);
  basket.translate(supX + 0.50, basketGroundY + 0.09, supZ + 0.90);
  propGeometries.push(prepareGeometry(basket, new THREE.Color(0xb2834e)));

  const basketHandle = new THREE.CylinderGeometry(0.012, 0.012, 0.26, 6).toNonIndexed();
  basketHandle.rotateX(Math.PI / 2);
  basketHandle.translate(supX + 0.50, basketGroundY + 0.20, supZ + 0.90);
  propGeometries.push(prepareGeometry(basketHandle, new THREE.Color(0x8d6232)));

  // Canvas Dry Bag / Tote
  const toteGroundY = getHeightAt(supX + 0.25, supZ + 0.85);
  const dryBag = new THREE.CylinderGeometry(0.09, 0.09, 0.24, 8).toNonIndexed();
  dryBag.rotateZ(0.15);
  dryBag.translate(supX + 0.25, toteGroundY + 0.12, supZ + 0.85);
  propGeometries.push(prepareGeometry(dryBag, new THREE.Color(0xdcd4c4)));

  // Merge static geometries
  const timberParts:{role:string;start:number;count:number}[]=[];let timberOffset=0;
  woodGeometries.forEach(g=>{const count=g.getAttribute('position').count;if(g.userData.role)timberParts.push({role:g.userData.role,start:timberOffset,count});timberOffset+=count;});
  const mergedWood = BufferGeometryUtils.mergeGeometries(woodGeometries, false);
  if (mergedWood) {const mesh=new THREE.Mesh(mergedWood,woodMaterial);mesh.name='GardenTimber';mesh.userData.parts=timberParts;rootGroup.add(mesh);}

  const mergedStone = BufferGeometryUtils.mergeGeometries(stoneGeometries, false);
  if (mergedStone) {
    const stoneMesh = new THREE.Mesh(mergedStone, stoneMaterial);
    stoneMesh.name = 'GardenStoneMesh';
    rootGroup.add(stoneMesh);
  }

  const mergedProp = BufferGeometryUtils.mergeGeometries(propGeometries, false);
  if (mergedProp) {const mesh=new THREE.Mesh(mergedProp,propMaterial);mesh.name='GardenProps';rootGroup.add(mesh);}

  const mergedSnow = BufferGeometryUtils.mergeGeometries(snowGeometries, false);
  let snowMesh: THREE.Mesh | null = null;
  if (mergedSnow) {
    const snowMat = new THREE.MeshStandardMaterial({
      color: COLORS.terrain.snow,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.0,
    });
    snowMesh = new THREE.Mesh(mergedSnow, snowMat);
    snowMesh.name = 'GardenSnow';
    rootGroup.add(snowMesh);
  }

  [...woodGeometries,...stoneGeometries,...propGeometries,...snowGeometries].forEach(g=>g.dispose());
  scene.add(rootGroup);

  function update(dt: number, elapsed: number, timeOfDay: number): void {
    if (fireMesh) {
      const flicker = 1.0 + Math.sin(elapsed * 12.0) * 0.08 + Math.cos(elapsed * 18.0) * 0.05;
      fireMesh.scale.set(flicker, flicker * 1.1, flicker);
      fireMesh.rotation.y = elapsed * 2.0;
    }
  }

  function updateSeason(season: Season, t: number): void {
    if (snowMesh) {
      const targetOpacity = season === 'winter' ? 0.95 : 0.0;
      const mat = snowMesh.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, t);
      snowMesh.visible = mat.opacity > 0.01;
    }
  }

  return {
    group: rootGroup,
    emissiveMeshes,
    fireMesh,
    update,
    updateSeason,
    dispose() {
      woodMaterial.dispose();
      stoneMaterial.dispose();
      propMaterial.dispose();
      rootGroup.traverse(obj=>{
        if(obj instanceof THREE.Mesh||obj instanceof THREE.LineSegments){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}
      });
      rootGroup.removeFromParent();
    },
  };
}
