import * as THREE from 'three';
import {
  BEACH_COLORS,
  PHUQUOC_COLORS,
  BeachSeason,
  PhuQuocSeason,
  SEED,
} from './constants';
import {
  getTerrainHeight,
  getDistanceToShore,
  isOnSand,
  isWetSand,
} from './shoreline';
import {
  BEACH_CENTER,
  PHUQUOC_CENTER,
  BEACH_BOUNDARY_POINTS,
  PHUQUOC_BOUNDARY_POINTS,
  BEACH_BOUNDARY_SAMPLES,
  PHUQUOC_BOUNDARY_SAMPLES,
  isInsideBeachFootprint,
  isInsidePhuQuocFootprint,
  getBeachBoundaryPoint,
  getPhuQuocBoundaryPoint,
  BEACH_FOOTPRINT_BOUNDS,
  PHUQUOC_FOOTPRINT_BOUNDS,
} from './footprint';
import { SeededRandom, SimplexNoise2D } from '../../core/noise';

export interface BeachTerrainSystem {
  group: THREE.Group;
  getHeightAt(x: number, z: number): number;
  getNormalAt(x: number, z: number): THREE.Vector3;
  getSlopeAt(x: number, z: number): number;
  updateSeason(season: BeachSeason | number, t?: number): void;
  dispose(): void;
}
export type PhuQuocTerrainSystem = BeachTerrainSystem;

export function createBeachTerrain(parentGroup: THREE.Group): BeachTerrainSystem {
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'BeachTerrain';
  parentGroup.add(terrainGroup);

  const wallCutoffY = -1.25;
  const baseBottomY = -1.40;
  const bevelRadius = 0.18;

  function sampleHeight(x: number, z: number): number {
    return getTerrainHeight(x, z);
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
    return 1 - Math.min(1.0, Math.max(0.0, n.y)); // 0 = flat, 1 = vertical
  }

  // --- Geometry Construction ---
  const numRings = 140;
  const numSegments = PHUQUOC_BOUNDARY_SAMPLES;
  const topVertCount = 1 + numRings * numSegments;

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const dryColors = new Float32Array(topVertCount * 3);
  const rainyColors = new Float32Array(topVertCount * 3);

  const tempNorm = new THREE.Vector3();
  const cDry = new THREE.Color();
  const cRainy = new THREE.Color();

  function evaluateSurfaceColor(x: number, y: number, z: number, norm: THREE.Vector3): { dry: THREE.Color; rainy: THREE.Color } {
    const slope = 1.0 - Math.max(0.0, norm.y);
    const dist = getDistanceToShore(x, z);

    // A. Seabed (submerged): clear golden sand in shallows transitioning to deeper sediment
    if (dist < 0) {
      const shallowSand = new THREE.Color(0xd0bfa0);
      const deepSand = PHUQUOC_COLORS.sand.deep;
      const shallowBlend = Math.min(1, Math.max(0, 1 + dist * 0.55));
      cDry.copy(deepSand).lerp(shallowSand, shallowBlend);
      cRainy.copy(cDry).multiplyScalar(0.92);
    }
    // B. Wet swash zone
    else if (dist < 0.8) {
      const t = dist / 0.8;
      cDry.copy(PHUQUOC_COLORS.sand.wet).lerp(PHUQUOC_COLORS.sand.dry, t);
      // Rainy season expands wet sand
      cRainy.copy(PHUQUOC_COLORS.sand.wet).multiplyScalar(0.90);
    }
    // Continuous sand → coastal grass → granite transitions. Hard x/zone
    // thresholds produce visible saw teeth on a densely tessellated mesh.
    else {
      const sandVar = 0.04 * SimplexNoise2D(x * 0.4, z * 0.4);
      cDry.copy(PHUQUOC_COLORS.sand.dry).offsetHSL(0, 0, sandVar);
      const grass = new THREE.Color(0x6b8f3e).lerp(
        new THREE.Color(0x4e6b2c), THREE.MathUtils.smoothstep(-z, 3.3, 5.0) * 0.5);
      const grassBlend = THREE.MathUtils.smoothstep(dist, 3.2, 5.8)
        * (1 - THREE.MathUtils.smoothstep(x, 3.3, 5.2));
      cDry.lerp(grass, grassBlend);
      const rockBlend = Math.max(
        THREE.MathUtils.smoothstep(x, 3.5, 5.5),
        THREE.MathUtils.smoothstep(slope, 0.3, 0.65)
      ) * THREE.MathUtils.smoothstep(dist, 0.8, 2.5);
      const rock = PHUQUOC_COLORS.rock.graniteWarm.clone()
        .lerp(PHUQUOC_COLORS.rock.graniteLight, 0.35);
      cDry.lerp(rock, rockBlend);
      cRainy.copy(cDry).multiplyScalar(THREE.MathUtils.lerp(0.88, 0.94, grassBlend));
    }

    return { dry: cDry, rainy: cRainy };
  }

  // 1. Top Surface (Radial Polar Tessellation from PHUQUOC_CENTER to Boundary)
  const cX = PHUQUOC_CENTER.x;
  const cZ = PHUQUOC_CENTER.y;
  const cY = sampleHeight(cX, cZ);
  const cNorm = sampleNormal(cX, cZ);

  positions.push(cX, cY, cZ);
  normals.push(cNorm.x, cNorm.y, cNorm.z);
  const centerColors = evaluateSurfaceColor(cX, cY, cZ, cNorm);
  dryColors[0] = centerColors.dry.r;
  dryColors[1] = centerColors.dry.g;
  dryColors[2] = centerColors.dry.b;
  rainyColors[0] = centerColors.rainy.r;
  rainyColors[1] = centerColors.rainy.g;
  rainyColors[2] = centerColors.rainy.b;
  colors.push(centerColors.dry.r, centerColors.dry.g, centerColors.dry.b);

  for (let ir = 1; ir <= numRings; ir++) {
    const frac = ir / numRings;
    for (let it = 0; it < numSegments; it++) {
      const bPt = PHUQUOC_BOUNDARY_POINTS[it];
      const x = cX + frac * (bPt.x - cX);
      const z = cZ + frac * (bPt.y - cZ);
      const y = sampleHeight(x, z);
      const norm = sampleNormal(x, z);

      positions.push(x, y, z);
      normals.push(norm.x, norm.y, norm.z);

      const vIdx = 1 + (ir - 1) * numSegments + it;
      const vertCols = evaluateSurfaceColor(x, y, z, norm);
      dryColors[vIdx * 3] = vertCols.dry.r;
      dryColors[vIdx * 3 + 1] = vertCols.dry.g;
      dryColors[vIdx * 3 + 2] = vertCols.dry.b;
      rainyColors[vIdx * 3] = vertCols.rainy.r;
      rainyColors[vIdx * 3 + 1] = vertCols.rainy.g;
      rainyColors[vIdx * 3 + 2] = vertCols.rainy.b;

      colors.push(vertCols.dry.r, vertCols.dry.g, vertCols.dry.b);
    }
  }

  // Triangles for Top Surface (strictly +Y normal winding)
  // Center to ring 1: triangle fan
  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    indices.push(0, 1 + nextIt, 1 + it);
  }

  // Ring k to Ring k + 1: quads
  for (let ir = 1; ir < numRings; ir++) {
    const ringCurr = 1 + (ir - 1) * numSegments;
    const ringNext = 1 + ir * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = ringCurr + it;
      const i10 = ringCurr + nextIt;
      const i01 = ringNext + it;
      const i11 = ringNext + nextIt;

      indices.push(i00, i11, i01);
      indices.push(i00, i10, i11);
    }
  }

  // 2. Continuous Organic Side Walls around Natural Boundary
  const nySide = 12;
  const colSoil = new THREE.Color(0xbfa57d);      // Sand & coastal topsoil
  const colLimestone = new THREE.Color(0x8a7f72); // Marine limestone sediment
  const colBedrock = new THREE.Color(0x524b45);   // Deep granite bedrock
  const colBase = PHUQUOC_COLORS.base;            // Cream pedestal

  const boundaryNormals: THREE.Vector2[] = [];
  for (let it = 0; it < numSegments; it++) {
    const prevPt = PHUQUOC_BOUNDARY_POINTS[(it - 1 + numSegments) % numSegments];
    const nextPt = PHUQUOC_BOUNDARY_POINTS[(it + 1) % numSegments];
    const tangent = new THREE.Vector2().subVectors(nextPt, prevPt);
    const norm = new THREE.Vector2(tangent.y, -tangent.x).normalize();
    boundaryNormals.push(norm);
  }

  const sideBaseIdx = positions.length / 3;
  const tempCol = new THREE.Color();

  for (let iy = 0; iy <= nySide; iy++) {
    const ty = iy / nySide;
    for (let it = 0; it < numSegments; it++) {
      const bPt = PHUQUOC_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const yTop = sampleHeight(bPt.x, bPt.y);
      const y = yTop * (1.0 - ty) + wallCutoffY * ty;

      positions.push(bPt.x, y, bPt.y);
      normals.push(norm2d.x, 0, norm2d.y);

      const bSoil = yTop - 0.15 - SimplexNoise2D(it * 0.15, 7.0) * 0.04;
      const bLimestone = (yTop + wallCutoffY) * 0.50 + SimplexNoise2D(it * 0.12, 17.0) * 0.05;

      if (y > bSoil) {
        tempCol.copy(colSoil);
      } else if (y > bLimestone) {
        tempCol.copy(colLimestone);
      } else {
        tempCol.copy(colBedrock);
      }
      colors.push(tempCol.r, tempCol.g, tempCol.b);
    }
  }

  for (let iy = 0; iy < nySide; iy++) {
    const rowCurr = sideBaseIdx + iy * numSegments;
    const rowNext = sideBaseIdx + (iy + 1) * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      indices.push(i00, i10, i11);
      indices.push(i00, i11, i01);
    }
  }

  // 3. Rounded Cream Pedestal Bevel following the natural boundary
  const nBevelSteps = 3;
  const bevelBaseIdx = positions.length / 3;
  for (let ib = 0; ib <= nBevelSteps; ib++) {
    const phi = (ib / nBevelSteps) * (Math.PI * 0.5);
    const y = wallCutoffY - Math.sin(phi) * (wallCutoffY - baseBottomY);
    const outward = bevelRadius * (1.0 - Math.cos(phi));
    const nY = -Math.cos(phi);
    const nOut = Math.sin(phi);

    for (let it = 0; it < numSegments; it++) {
      const bPt = PHUQUOC_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const curX = bPt.x + norm2d.x * outward;
      const curZ = bPt.y + norm2d.y * outward;

      positions.push(curX, y, curZ);
      normals.push(norm2d.x * nOut, nY, norm2d.y * nOut);
      colors.push(colBase.r, colBase.g, colBase.b);
    }
  }

  for (let ib = 0; ib < nBevelSteps; ib++) {
    const rowCurr = bevelBaseIdx + ib * numSegments;
    const rowNext = bevelBaseIdx + (ib + 1) * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      indices.push(i00, i10, i11);
      indices.push(i00, i11, i01);
    }
  }

  // 4. Flat Sealed Bottom Face at baseBottomY (-0.80)
  const bottomCenterIdx = positions.length / 3;
  positions.push(cX, baseBottomY, cZ);
  normals.push(0, -1, 0);
  colors.push(colBase.r, colBase.g, colBase.b);

  const bottomRingIdx = bevelBaseIdx + nBevelSteps * numSegments;
  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    indices.push(bottomCenterIdx, bottomRingIdx + it, bottomRingIdx + nextIt);
  }

  // Assemble Terrain Mesh
  const topGeo = new THREE.BufferGeometry();
  topGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  topGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  topGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  topGeo.setIndex(indices);
  topGeo.computeVertexNormals();
  topGeo.computeBoundingBox();

  const topMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.05,
    flatShading: false,
  });

  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.receiveShadow = true;
  terrainGroup.add(topMesh);

  // 5. Conforming Diorama Contact Shadow Plane
  const shadowRings = 4;
  const shadowPos: number[] = [];
  const shadowAlpha: number[] = [];
  const shadowIdx: number[] = [];

  const shadowBaseY = baseBottomY - 0.01;
  const shadowCenterIdx = 0;
  shadowPos.push(cX, shadowBaseY, cZ);
  shadowAlpha.push(0.35);

  for (let ir = 1; ir <= shadowRings; ir++) {
    const frac = ir / shadowRings;
    const expand = frac * 0.45;
    const ringAlpha = 0.35 * Math.pow(1.0 - frac, 1.5);

    for (let it = 0; it < numSegments; it++) {
      const bPt = PHUQUOC_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const sx = bPt.x + norm2d.x * expand;
      const sz = bPt.y + norm2d.y * expand;

      shadowPos.push(sx, shadowBaseY, sz);
      shadowAlpha.push(ringAlpha);
    }
  }

  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    shadowIdx.push(shadowCenterIdx, 1 + nextIt, 1 + it);
  }

  for (let ir = 1; ir < shadowRings; ir++) {
    const rowCurr = 1 + (ir - 1) * numSegments;
    const rowNext = 1 + ir * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      shadowIdx.push(i00, i11, i01);
      shadowIdx.push(i00, i10, i11);
    }
  }

  const shadowGeo = new THREE.BufferGeometry();
  shadowGeo.setAttribute('position', new THREE.Float32BufferAttribute(shadowPos, 3));
  const shadowColors = new Float32Array(shadowAlpha.length * 3);
  const shadowColorAlpha = new Float32Array(shadowAlpha.length);
  for (let i = 0; i < shadowAlpha.length; i++) {
    shadowColors[i * 3 + 0] = 0.12;
    shadowColors[i * 3 + 1] = 0.10;
    shadowColors[i * 3 + 2] = 0.08;
    shadowColorAlpha[i] = shadowAlpha[i];
  }
  shadowGeo.setAttribute('color', new THREE.Float32BufferAttribute(shadowColors, 3));
  shadowGeo.setAttribute('alpha', new THREE.Float32BufferAttribute(shadowColorAlpha, 1));
  shadowGeo.setIndex(shadowIdx);

  const shadowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(0.08, 0.07, 0.06, vAlpha);
      }
    `,
  });

  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.renderOrder = -1;
  terrainGroup.add(shadowMesh);

  // 6. Granite Coastal Boulders (InstancedMesh along headland and shore, inside footprint)
  const boulderCount = 45;
  const boulderGeo = new THREE.DodecahedronGeometry(0.35, 1);
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

  for (let i = 0; i < boulderCount * 6 && placedBoulders < boulderCount; i++) {
    let bx: number, bz: number;
    const r = rng.next();
    if (r < 0.40) {
      // Central rock spit dividing the two coves
      bx = rng.range(-1.2, 1.2);
      bz = rng.range(0.8, 3.0);
    } else if (r < 0.70) {
      // East headland
      bx = rng.range(5.8, 8.2);
      bz = rng.range(-1.0, 4.8);
    } else {
      // West headland
      bx = rng.range(-8.4, -6.5);
      bz = rng.range(0.5, 4.5);
    }

    if (!isInsidePhuQuocFootprint(bx, bz, 0.45)) continue;

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
  boulderMesh.count = Math.max(1, placedBoulders);
  boulderMesh.instanceMatrix.needsUpdate = true;
  if (boulderMesh.instanceColor) boulderMesh.instanceColor.needsUpdate = true;
  terrainGroup.add(boulderMesh);

  return {
    group: terrainGroup,
    getHeightAt: sampleHeight,
    getNormalAt: sampleNormal,
    getSlopeAt: sampleSlope,
    updateSeason(seasonOrFactor: BeachSeason | number, t?: number) {
      const colorAttr = topGeo.attributes.color as THREE.BufferAttribute;
      let rainFactor: number;
      if (typeof seasonOrFactor === 'number') {
        rainFactor = THREE.MathUtils.clamp(seasonOrFactor, 0.0, 1.0);
      } else if (t !== undefined) {
        rainFactor = seasonOrFactor === 'rainy' ? t : (1.0 - t);
      } else {
        rainFactor = seasonOrFactor === 'rainy' ? 1.0 : 0.0;
      }

      for (let i = 0; i < topVertCount * 3; i++) {
        colorAttr.array[i] = dryColors[i] + (rainyColors[i] - dryColors[i]) * rainFactor;
      }
      colorAttr.needsUpdate = true;
    },
    dispose() {
      topGeo.dispose();
      topMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      boulderGeo.dispose();
      boulderMat.dispose();
      terrainGroup.clear();
      parentGroup.remove(terrainGroup);
    },
  };
}

export const createPhuQuocTerrain = createBeachTerrain;
