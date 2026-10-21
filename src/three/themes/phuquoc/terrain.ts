import * as THREE from 'three';
import {
  PHUQUOC_COLORS,
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
  PHUQUOC_CENTER,
  PHUQUOC_BOUNDARY_POINTS,
  PHUQUOC_BOUNDARY_SAMPLES,
  isInsidePhuQuocFootprint,
  getPhuQuocBoundaryPoint,
  PHUQUOC_FOOTPRINT_BOUNDS,
} from './footprint';
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
      cRainy.copy(PHUQUOC_COLORS.sand.wet).multiplyScalar(0.90);
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
    // D. Granite Headlands / Coastal Hills
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
      shadowGeo.dispose();
      shadowMat.dispose();
      boulderGeo.dispose();
      boulderMat.dispose();
      terrainGroup.clear();
      parentGroup.remove(terrainGroup);
    },
  };
}
