import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  TERRAIN_RES,
  PHUQUOC_COLORS,
  PhuQuocSeason,
  SEED,
} from './constants';
import {
  getTerrainHeight,
  getDistanceToShore,
  isOnSand,
  SHORELINE_BOUNDS,
} from './shoreline';
import { SeededRandom, SimplexNoise2D } from '../../core/noise';

export interface PhuQuocTerrainSystem {
  group: THREE.Group;
  getHeightAt(x: number, z: number): number;
  getNormalAt(x: number, z: number): THREE.Vector3;
  getSlopeAt(x: number, z: number): number;
  updateSeason(season: PhuQuocSeason, t: number): void;
  dispose(): void;
}

export function createPhuQuocTerrain(parentGroup: THREE.Group): PhuQuocTerrainSystem {
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'PhuQuocTerrain';
  parentGroup.add(terrainGroup);

  const res = TERRAIN_RES;
  const halfW = DIORAMA_WIDTH / 2;
  const halfD = DIORAMA_DEPTH / 2;
  const BASE_Y = -1.5;

  // Grid heightfield cache for fast bilinear lookup
  const heights = new Float32Array(res * res);
  for (let iz = 0; iz < res; iz++) {
    const z = -halfD + (iz / (res - 1)) * DIORAMA_DEPTH;
    for (let ix = 0; ix < res; ix++) {
      const x = -halfW + (ix / (res - 1)) * DIORAMA_WIDTH;
      heights[iz * res + ix] = getTerrainHeight(x, z);
    }
  }

  function sampleHeight(x: number, z: number): number {
    const u = (x + halfW) / DIORAMA_WIDTH;
    const v = (z + halfD) / DIORAMA_DEPTH;
    const fx = Math.max(0, Math.min(res - 1.001, u * (res - 1)));
    const fz = Math.max(0, Math.min(res - 1.001, v * (res - 1)));
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const rx = fx - ix;
    const rz = fz - iz;

    const h00 = heights[iz * res + ix];
    const h10 = heights[iz * res + (ix + 1)];
    const h01 = heights[(iz + 1) * res + ix];
    const h11 = heights[(iz + 1) * res + (ix + 1)];

    const top = h00 * (1 - rx) + h10 * rx;
    const bot = h01 * (1 - rx) + h11 * rx;
    return top * (1 - rz) + bot * rz;
  }

  function sampleNormal(x: number, z: number): THREE.Vector3 {
    const eps = 0.08;
    const hL = sampleHeight(x - eps, z);
    const hR = sampleHeight(x + eps, z);
    const hD = sampleHeight(x, z - eps);
    const hU = sampleHeight(x, z + eps);
    const normal = new THREE.Vector3(hL - hR, 2 * eps, hD - hU).normalize();
    return normal;
  }

  function sampleSlope(x: number, z: number): number {
    const n = sampleNormal(x, z);
    return 1 - n.y; // 0 = flat, 1 = vertical
  }

  // --- Geometry Construction ---
  // 1. Top Surface
  const topVertCount = res * res;
  const topPositions = new Float32Array(topVertCount * 3);
  const topNormals = new Float32Array(topVertCount * 3);
  const dryColors = new Float32Array(topVertCount * 3);
  const rainyColors = new Float32Array(topVertCount * 3);
  const topIndices: number[] = [];

  const tempNorm = new THREE.Vector3();
  const cDry = new THREE.Color();
  const cRainy = new THREE.Color();

  for (let iz = 0; iz < res; iz++) {
    const z = -halfD + (iz / (res - 1)) * DIORAMA_DEPTH;
    for (let ix = 0; ix < res; ix++) {
      const x = -halfW + (ix / (res - 1)) * DIORAMA_WIDTH;
      const idx = iz * res + ix;
      const h = heights[idx];

      topPositions[idx * 3] = x;
      topPositions[idx * 3 + 1] = h;
      topPositions[idx * 3 + 2] = z;

      tempNorm.copy(sampleNormal(x, z));
      topNormals[idx * 3] = tempNorm.x;
      topNormals[idx * 3 + 1] = tempNorm.y;
      topNormals[idx * 3 + 2] = tempNorm.z;

      const slope = 1 - tempNorm.y;
      const dist = getDistanceToShore(x, z);

      // Vertex color determination:
      // A. Seabed (submerged)
      if (dist < 0) {
        cDry.copy(PHUQUOC_COLORS.sand.deep).lerp(PHUQUOC_COLORS.sand.wet, Math.min(1, 1 + dist * 0.8));
        cRainy.copy(cDry).multiplyScalar(0.92);
      }
      // B. Wet swash zone
      else if (dist < 0.8) {
        const t = dist / 0.8;
        cDry.copy(PHUQUOC_COLORS.sand.wet).lerp(PHUQUOC_COLORS.sand.dry, t);
        // Rainy season expands wet sand
        cRainy.copy(PHUQUOC_COLORS.sand.wet).multiplyScalar(0.9);
      }
      // C. Dry Sand Beach
      else if (dist < 5.0 && x < 4.0) {
        const t = (dist - 0.8) / 4.2;
        cDry.copy(PHUQUOC_COLORS.sand.dry);
        // Subtle sand warmth variation
        const sandVar = 0.04 * SimplexNoise2D(x * 0.4, z * 0.4);
        cDry.offsetHSL(0.01 * sandVar, 0.05 * sandVar, sandVar);
        
        // Blend into coastal grass near back edge
        if (t > 0.7) {
          const grassBlend = (t - 0.7) / 0.3;
          cDry.lerp(new THREE.Color(0x739a48), grassBlend * 0.6);
        }

        cRainy.copy(cDry).multiplyScalar(0.88); // Damp darkened sand
      }
      // D. Granite Headlands / Hills
      else {
        // High slope = exposed granite rock
        if (slope > 0.35 || x > 4.5) {
          const rockBlend = Math.min(1.0, (slope - 0.3) / 0.4 + (x > 4.5 ? 0.4 : 0));
          cDry.copy(PHUQUOC_COLORS.rock.graniteWarm).lerp(PHUQUOC_COLORS.rock.graniteLight, rockBlend);
          // Darker rock crevices
          if (slope > 0.6) cDry.lerp(PHUQUOC_COLORS.rock.graniteDark, 0.4);
          cRainy.copy(cDry).multiplyScalar(0.82); // Wet glistening granite
        } else {
          // Tropical coastal grass / lawn
          cDry.set(0x6b8f3e);
          if (z < -4) cDry.lerp(new THREE.Color(0x4e6b2c), 0.5); // Richer inland greenery
          cRainy.copy(cDry).multiplyScalar(0.94);
        }
      }

      dryColors[idx * 3] = cDry.r;
      dryColors[idx * 3 + 1] = cDry.g;
      dryColors[idx * 3 + 2] = cDry.b;

      rainyColors[idx * 3] = cRainy.r;
      rainyColors[idx * 3 + 1] = cRainy.g;
      rainyColors[idx * 3 + 2] = cRainy.b;

      // Triangulation
      if (ix < res - 1 && iz < res - 1) {
        const a = idx;
        const b = idx + 1;
        const c = idx + res;
        const d = idx + res + 1;
        topIndices.push(a, c, b);
        topIndices.push(b, c, d);
      }
    }
  }

  const topGeo = new THREE.BufferGeometry();
  topGeo.setAttribute('position', new THREE.BufferAttribute(topPositions, 3));
  topGeo.setAttribute('normal', new THREE.BufferAttribute(topNormals, 3));
  topGeo.setAttribute('color', new THREE.BufferAttribute(dryColors.slice(), 3));
  topGeo.setIndex(topIndices);

  const topMat = new THREE.MeshLambertMaterial({
    vertexColors: true,
  });
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.receiveShadow = true;
  terrainGroup.add(topMesh);

  // 2. Diorama Side Skirts and Pedestal Slab (Cross-section down to BASE_Y = -1.5)
  const skirtPositions: number[] = [];
  const skirtNormals: number[] = [];
  const skirtColors: number[] = [];
  const skirtIndices: number[] = [];

  // Helper to add side wall quad with geology layer coloring
  function addSideSegment(
    p0Top: THREE.Vector3,
    p1Top: THREE.Vector3,
    norm: THREE.Vector3
  ) {
    // 3 vertical subdivisions for geological stratification:
    // Layer 0: Surface to -0.3 (Sand & topsoil)
    // Layer 1: -0.3 to -0.9 (Coral limestone & marine sediment)
    // Layer 2: -0.9 to BASE_Y (-1.5) (Granite bedrock & cream diorama base)
    const yLevels = [
      (p: THREE.Vector3) => p.y,
      () => -0.25,
      () => -0.85,
      () => BASE_Y,
    ];

    const layerColors = [
      new THREE.Color(0xbfa57d), // Sand/topsoil
      new THREE.Color(0x8a7f72), // Marine limestone
      new THREE.Color(0x524b45), // Deep bedrock
      PHUQUOC_COLORS.base,       // Cream diorama pedestal base
    ];

    for (let layer = 0; layer < 3; layer++) {
      const baseIdx = skirtPositions.length / 3;

      const y0_curr = layer === 0 ? p0Top.y : yLevels[layer](p0Top);
      const y0_next = yLevels[layer + 1](p0Top);
      const y1_curr = layer === 0 ? p1Top.y : yLevels[layer](p1Top);
      const y1_next = yLevels[layer + 1](p1Top);

      const colTop = layerColors[layer];
      const colBot = layerColors[layer + 1];

      // 4 vertices of quad
      // v0: p0_curr
      skirtPositions.push(p0Top.x, y0_curr, p0Top.z);
      skirtNormals.push(norm.x, norm.y, norm.z);
      skirtColors.push(colTop.r, colTop.g, colTop.b);

      // v1: p1_curr
      skirtPositions.push(p1Top.x, y1_curr, p1Top.z);
      skirtNormals.push(norm.x, norm.y, norm.z);
      skirtColors.push(colTop.r, colTop.g, colTop.b);

      // v2: p0_next
      skirtPositions.push(p0Top.x, y0_next, p0Top.z);
      skirtNormals.push(norm.x, norm.y, norm.z);
      skirtColors.push(colBot.r, colBot.g, colBot.b);

      // v3: p1_next
      skirtPositions.push(p1Top.x, y1_next, p1Top.z);
      skirtNormals.push(norm.x, norm.y, norm.z);
      skirtColors.push(colBot.r, colBot.g, colBot.b);

      skirtIndices.push(baseIdx, baseIdx + 2, baseIdx + 1);
      skirtIndices.push(baseIdx + 1, baseIdx + 2, baseIdx + 3);
    }
  }

  // North edge (z = -halfD)
  for (let ix = 0; ix < res - 1; ix++) {
    const x0 = -halfW + (ix / (res - 1)) * DIORAMA_WIDTH;
    const x1 = -halfW + ((ix + 1) / (res - 1)) * DIORAMA_WIDTH;
    const p0 = new THREE.Vector3(x0, heights[ix], -halfD);
    const p1 = new THREE.Vector3(x1, heights[ix + 1], -halfD);
    addSideSegment(p1, p0, new THREE.Vector3(0, 0, -1));
  }

  // South edge (z = halfD, front oceanic face)
  for (let ix = 0; ix < res - 1; ix++) {
    const x0 = -halfW + (ix / (res - 1)) * DIORAMA_WIDTH;
    const x1 = -halfW + ((ix + 1) / (res - 1)) * DIORAMA_WIDTH;
    const p0 = new THREE.Vector3(x0, heights[(res - 1) * res + ix], halfD);
    const p1 = new THREE.Vector3(x1, heights[(res - 1) * res + ix + 1], halfD);
    addSideSegment(p0, p1, new THREE.Vector3(0, 0, 1));
  }

  // West edge (x = -halfW)
  for (let iz = 0; iz < res - 1; iz++) {
    const z0 = -halfD + (iz / (res - 1)) * DIORAMA_DEPTH;
    const z1 = -halfD + ((iz + 1) / (res - 1)) * DIORAMA_DEPTH;
    const p0 = new THREE.Vector3(-halfW, heights[iz * res], z0);
    const p1 = new THREE.Vector3(-halfW, heights[(iz + 1) * res], z1);
    addSideSegment(p0, p1, new THREE.Vector3(-1, 0, 0));
  }

  // East edge (x = halfW)
  for (let iz = 0; iz < res - 1; iz++) {
    const z0 = -halfD + (iz / (res - 1)) * DIORAMA_DEPTH;
    const z1 = -halfD + ((iz + 1) / (res - 1)) * DIORAMA_DEPTH;
    const p0 = new THREE.Vector3(halfW, heights[iz * res + res - 1], z0);
    const p1 = new THREE.Vector3(halfW, heights[(iz + 1) * res + res - 1], z1);
    addSideSegment(p1, p0, new THREE.Vector3(1, 0, 0));
  }

  // Bottom Base Slab
  const baseBaseIdx = skirtPositions.length / 3;
  skirtPositions.push(-halfW, BASE_Y, -halfD);
  skirtPositions.push(halfW, BASE_Y, -halfD);
  skirtPositions.push(-halfW, BASE_Y, halfD);
  skirtPositions.push(halfW, BASE_Y, halfD);
  for (let i = 0; i < 4; i++) {
    skirtNormals.push(0, -1, 0);
    skirtColors.push(PHUQUOC_COLORS.base.r, PHUQUOC_COLORS.base.g, PHUQUOC_COLORS.base.b);
  }
  skirtIndices.push(baseBaseIdx, baseBaseIdx + 1, baseBaseIdx + 2);
  skirtIndices.push(baseBaseIdx + 1, baseBaseIdx + 3, baseBaseIdx + 2);

  const skirtGeo = new THREE.BufferGeometry();
  skirtGeo.setAttribute('position', new THREE.Float32BufferAttribute(skirtPositions, 3));
  skirtGeo.setAttribute('normal', new THREE.Float32BufferAttribute(skirtNormals, 3));
  skirtGeo.setAttribute('color', new THREE.Float32BufferAttribute(skirtColors, 3));
  skirtGeo.setIndex(skirtIndices);

  const skirtMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
  terrainGroup.add(skirtMesh);

  // 3. Granite Coastal Boulders (InstancedMesh along headland and shore)
  const boulderCount = 45;
  const boulderGeo = new THREE.DodecahedronGeometry(0.35, 1);
  // Squash slightly and add noise for natural granite boulders
  const bPos = boulderGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    bPos.setY(i, bPos.getY(i) * 0.75);
    const px = bPos.getX(i);
    const py = bPos.getY(i);
    const pz = bPos.getZ(i);
    const bump = 1 + 0.15 * SimplexNoise2D(px * 4, pz * 4);
    bPos.setXYZ(i, px * bump, py * bump, pz * bump);
  }
  boulderGeo.computeVertexNormals();

  const boulderMat = new THREE.MeshLambertMaterial({
    color: PHUQUOC_COLORS.rock.graniteWarm,
  });
  const boulderMesh = new THREE.InstancedMesh(boulderGeo, boulderMat, boulderCount);
  boulderMesh.castShadow = true;
  boulderMesh.receiveShadow = true;

  const rng = new SeededRandom(SEED + 101);
  const dummy = new THREE.Object3D();
  let placedBoulders = 0;

  for (let i = 0; i < boulderCount * 4 && placedBoulders < boulderCount; i++) {
    // Coastal rocks: central dividing spit (x around 0), west headland (x < -6.8), or east headland (x > 6.0)
    let bx: number, bz: number;
    const r = rng.next();
    if (r < 0.40) {
      // Central rock spit dividing the two coves
      bx = rng.range(-1.2, 1.2);
      bz = rng.range(0.8, 3.2);
    } else if (r < 0.70) {
      // East headland
      bx = rng.range(6.2, 8.8);
      bz = rng.range(-1.0, 5.5);
    } else {
      // West headland
      bx = rng.range(-9.0, -6.8);
      bz = rng.range(0.5, 5.0);
    }

    const by = sampleHeight(bx, bz);
    const scale = rng.range(0.6, 1.7);
    dummy.position.set(bx, by + scale * 0.15, bz);
    dummy.rotation.set(rng.range(0, 0.4), rng.range(0, Math.PI * 2), rng.range(0, 0.4));
    dummy.scale.set(scale * rng.range(0.8, 1.2), scale * 0.8, scale * rng.range(0.8, 1.2));
    dummy.updateMatrix();
    boulderMesh.setMatrixAt(placedBoulders, dummy.matrix);

    const bColor = PHUQUOC_COLORS.rock.graniteLight.clone().lerp(
      PHUQUOC_COLORS.rock.graniteDark,
      rng.range(0, 0.5)
    );
    boulderMesh.setColorAt(placedBoulders, bColor);
    placedBoulders++;
  }
  boulderMesh.instanceMatrix.needsUpdate = true;
  if (boulderMesh.instanceColor) boulderMesh.instanceColor.needsUpdate = true;
  terrainGroup.add(boulderMesh);

  return {
    group: terrainGroup,
    getHeightAt: sampleHeight,
    getNormalAt: sampleNormal,
    getSlopeAt: sampleSlope,
    updateSeason(season: PhuQuocSeason, t: number) {
      const colorAttr = topGeo.attributes.color as THREE.BufferAttribute;
      const targetColors = season === 'rainy' ? rainyColors : dryColors;
      const fromColors = season === 'rainy' ? dryColors : rainyColors;

      for (let i = 0; i < topVertCount * 3; i++) {
        colorAttr.array[i] = fromColors[i] + (targetColors[i] - fromColors[i]) * t;
      }
      colorAttr.needsUpdate = true;
    },
    dispose() {
      topGeo.dispose();
      topMat.dispose();
      skirtGeo.dispose();
      skirtMat.dispose();
      boulderGeo.dispose();
      boulderMat.dispose();
      terrainGroup.clear();
      parentGroup.remove(terrainGroup);
    },
  };
}
