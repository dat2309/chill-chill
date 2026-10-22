import * as THREE from 'three';
import { WATER_LEVEL, DIORAMA_DEPTH } from './constants';
import { rng, SeededRandom, simplexNoise2D } from './noise';
import {
  STREAM_BOUNDS,
  getStreamCenter,
  getStreamHalfWidth,
  getWaterSurfaceHeight,
  getWaterDepth,
  isInWater,
  BASE_WATER_LEVEL,
} from './streamProfile';

export interface FishSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, waterLevel: number, freezeProgress?: number): void;
  reactToRipple(x: number, z: number): void;
  dispose(): void;
}

interface FishInstanceData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  wanderAngle: number;
  baseSpeed: number;
  rippleFleeBoost: THREE.Vector3;
  seedOffset: number;
}

/**
 * Builds a procedural BufferGeometry template for a koi fish:
 * - Body: tapered ellipsoid formed by cross-section rings
 * - Tail fin: triangle fan extending from rear (~0.04 width)
 * - Dorsal fin: triangle on top
 * - Pectoral fins: paired triangles on sides
 * - Vertex colors: warm koi gold/orange on back, sides, light cream belly, darker fins
 */
function buildFishGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Color constants for koi fish
  const cBack = new THREE.Color(0xe64a10);    // Warm rich orange-gold back
  const cSide = new THREE.Color(0xf59320);    // Golden-orange side
  const cBelly = new THREE.Color(0xfff2df);   // Light warm cream belly
  const cNose = new THREE.Color(0xffab60);    // Soft nose
  const cFinBase = new THREE.Color(0xcc3700); // Darker fin base
  const cFinTip = new THREE.Color(0xf58025);  // Slightly translucent fin edge

  // Helper to push a vertex with position and color
  function addVertex(x: number, y: number, z: number, color: THREE.Color): number {
    positions.push(x, y, z);
    colors.push(color.r, color.g, color.b);
    return (positions.length / 3) - 1;
  }

  // Ring configurations along X axis (nose at +0.075, rear at -0.060)
  // Each ring has 8 vertices around an ellipse in the YZ plane
  const ringX = [0.050, 0.015, -0.020, -0.055];
  const ringRx = [0.009, 0.016, 0.011, 0.004]; // lateral radius (Z)
  const ringRy = [0.008, 0.013, 0.010, 0.006]; // vertical radius (Y)
  const ringStarts: number[] = [];

  // Vertex 0: Nose tip
  const noseIdx = addVertex(0.075, 0.0, 0.0, cNose);

  // Generate 4 cross-sectional rings
  for (let r = 0; r < ringX.length; r++) {
    const rx = ringRx[r];
    const ry = ringRy[r];
    const x = ringX[r];
    const startIndex = positions.length / 3;
    ringStarts.push(startIndex);

    for (let j = 0; j < 8; j++) {
      const angle = (j / 8) * Math.PI * 2;
      const z = Math.sin(angle) * rx;
      const y = Math.cos(angle) * ry;

      // Color interpolation: top (j=0) -> back, sides (j=2, 6) -> side, bottom (j=4) -> belly
      const vertColor = new THREE.Color();
      const normY = y / ry; // 1 at top, -1 at bottom
      if (normY >= 0) {
        vertColor.copy(cSide).lerp(cBack, normY);
      } else {
        vertColor.copy(cSide).lerp(cBelly, -normY);
      }
      addVertex(x, y, z, vertColor);
    }
  }

  // Connect nose to Ring 0
  const r0 = ringStarts[0];
  for (let j = 0; j < 8; j++) {
    const next = (j + 1) % 8;
    indices.push(noseIdx, r0 + j, r0 + next);
  }

  // Connect adjacent rings
  for (let r = 0; r < ringStarts.length - 1; r++) {
    const curr = ringStarts[r];
    const next = ringStarts[r + 1];
    for (let j = 0; j < 8; j++) {
      const jNext = (j + 1) % 8;
      const c1 = curr + j;
      const c2 = curr + jNext;
      const n1 = next + j;
      const n2 = next + jNext;

      indices.push(c1, c2, n2);
      indices.push(c1, n2, n1);
    }
  }

  // Tail peduncle base cap
  const tailBaseIdx = addVertex(-0.065, 0.0, 0.0, cFinBase);
  const rLast = ringStarts[ringStarts.length - 1];
  for (let j = 0; j < 8; j++) {
    const next = (j + 1) % 8;
    indices.push(rLast + j, tailBaseIdx, rLast + next);
  }

  // Helper for adding double-sided triangles
  function addDoubleSidedTriangle(
    p1: [number, number, number], c1: THREE.Color,
    p2: [number, number, number], c2: THREE.Color,
    p3: [number, number, number], c3: THREE.Color
  ) {
    const i1 = addVertex(p1[0], p1[1], p1[2], c1);
    const i2 = addVertex(p2[0], p2[1], p2[2], c2);
    const i3 = addVertex(p3[0], p3[1], p3[2], c3);
    // Front face
    indices.push(i1, i2, i3);
    // Back face
    indices.push(i1, i3, i2);
  }

  // Tail Fin: extending from rear, total height/width ~0.04
  const tbTop: [number, number, number] = [-0.062, 0.005, 0.0];
  const tbBot: [number, number, number] = [-0.062, -0.005, 0.0];
  const ttTop: [number, number, number] = [-0.105, 0.020, 0.0];
  const ttMid: [number, number, number] = [-0.095, 0.0, 0.0];
  const ttBot: [number, number, number] = [-0.105, -0.020, 0.0];

  addDoubleSidedTriangle(tbTop, cFinBase, ttTop, cFinTip, ttMid, cFinTip);
  addDoubleSidedTriangle(tbTop, cFinBase, ttMid, cFinTip, tbBot, cFinBase);
  addDoubleSidedTriangle(tbBot, cFinBase, ttMid, cFinTip, ttBot, cFinTip);

  // Dorsal Fin: small triangle on top
  const dfFront: [number, number, number] = [0.005, 0.013, 0.0];
  const dfBack: [number, number, number] = [-0.035, 0.009, 0.0];
  const dfTip: [number, number, number] = [-0.020, 0.026, 0.0];
  addDoubleSidedTriangle(dfFront, cFinBase, dfTip, cFinTip, dfBack, cFinBase);

  // Right Pectoral Fin: small triangle on side
  const pfR1: [number, number, number] = [0.018, -0.003, 0.014];
  const pfR2: [number, number, number] = [0.002, -0.005, 0.015];
  const pfRTip: [number, number, number] = [-0.004, -0.010, 0.032];
  addDoubleSidedTriangle(pfR1, cFinBase, pfRTip, cFinTip, pfR2, cFinBase);

  // Left Pectoral Fin: small triangle on other side
  const pfL1: [number, number, number] = [0.018, -0.003, -0.014];
  const pfL2: [number, number, number] = [0.002, -0.005, -0.015];
  const pfLTip: [number, number, number] = [-0.004, -0.010, -0.032];
  addDoubleSidedTriangle(pfL1, cFinBase, pfL2, cFinBase, pfLTip, cFinTip);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export function createFish(
  scene: THREE.Scene,
  getHeightAt: (x: number, z: number) => number,
  isInStream: (x: number, z: number) => boolean
): FishSystem {
  const NUM_FISH = 12;
  const group = new THREE.Group();
  group.name = 'fish_system';

  const fishGeometry = buildFishGeometry();

  // Distinct phase offsets per instance for the GPU tail bending shader
  const phases = new Float32Array(NUM_FISH);
  const fishRng = new SeededRandom(777);
  for (let i = 0; i < NUM_FISH; i++) {
    phases[i] = fishRng.range(0, Math.PI * 2);
  }
  fishGeometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));

  // Shared uniforms for tail animation
  const fishUniforms = {
    uTime: { value: 0 },
  };

  const fishMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.35,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  fishMaterial.customProgramCacheKey = () => 'fish_tail_shader_v1';

  // Injected vertex shader for bending the rear body and tail fin
  fishMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = fishUniforms.uTime;
    shader.vertexShader = `
      attribute float aPhase;
      uniform float uTime;
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      // Tail starts bending behind mid-body (x < 0.01) toward tail tip (x ~ -0.105)
      float bend = clamp((0.01 - position.x) / 0.11, 0.0, 1.0);
      bend = bend * bend;
      float wiggle = sin(uTime * 10.0 + aPhase) * 0.025 * bend;
      transformed.z += wiggle;
      `
    );
  };

  const instancedMesh = new THREE.InstancedMesh(fishGeometry, fishMaterial, NUM_FISH);
  instancedMesh.castShadow = true;
  instancedMesh.receiveShadow = false;

  // Curated koi instance color tints: variations from platinum white, orange, deep gold to reddish
  const koiPalette = [
    new THREE.Color(1.02, 0.92, 0.75), // Golden Kohaku
    new THREE.Color(1.15, 0.75, 0.55), // Scarlet Koi
    new THREE.Color(0.98, 0.98, 0.92), // Platinum White
    new THREE.Color(1.05, 0.85, 0.50), // Yamabuki Gold
    new THREE.Color(1.10, 0.65, 0.45), // Deep Tangerine
    new THREE.Color(1.00, 0.88, 0.68), // Soft Apricot
    new THREE.Color(1.18, 0.70, 0.50), // Ruby Red
    new THREE.Color(0.95, 0.92, 0.88), // Pale Calico
    new THREE.Color(1.08, 0.82, 0.55), // Warm Amber
    new THREE.Color(1.00, 0.90, 0.70), // Sunburst Gold
    new THREE.Color(1.12, 0.68, 0.48), // Flame Koi
    new THREE.Color(1.04, 0.86, 0.60), // Honey Koi
  ];

  for (let i = 0; i < NUM_FISH; i++) {
    instancedMesh.setColorAt(i, koiPalette[i % koiPalette.length]);
  }
  if (instancedMesh.instanceColor) {
    instancedMesh.instanceColor.needsUpdate = true;
  }

  group.add(instancedMesh);
  scene.add(group);

  // Initialize fish states
  const fishes: FishInstanceData[] = [];
  const dummy = new THREE.Object3D();

  // Fish swim in calm deep waters from lower cascades through the wide foreground basin
  const streamMinZ = 0.2;
  const streamMaxZ = (DIORAMA_DEPTH / 2) - 0.7;

  for (let i = 0; i < NUM_FISH; i++) {
    let posZ = fishRng.range(streamMinZ, streamMaxZ);
    let posX = getStreamCenter(posZ) + fishRng.range(-0.8, 0.8);

    for (let attempt = 0; attempt < 50; attempt++) {
      if (isInWater(posX, posZ, 0) && getWaterDepth(posX, posZ, 0) > 0.08) {
        break;
      }
      posZ = fishRng.range(streamMinZ, streamMaxZ);
      const halfW = getStreamHalfWidth(posZ);
      posX = getStreamCenter(posZ) + fishRng.range(-halfW * 0.6, halfW * 0.6);
    }

    const groundH = getHeightAt(posX, posZ);
    const localWaterH = getWaterSurfaceHeight(posZ, 0);
    const posY = THREE.MathUtils.clamp((groundH + localWaterH) * 0.5, groundH + 0.04, localWaterH - 0.03);

    const angle = fishRng.range(0, Math.PI * 2);
    const baseSpeed = fishRng.range(0.32, 0.55);
    const velX = Math.cos(angle) * baseSpeed;
    const velZ = Math.sin(angle) * baseSpeed;

    const fishData: FishInstanceData = {
      position: new THREE.Vector3(posX, posY, posZ),
      velocity: new THREE.Vector3(velX, 0, velZ),
      phase: phases[i],
      wanderAngle: angle,
      baseSpeed,
      rippleFleeBoost: new THREE.Vector3(0, 0, 0),
      seedOffset: i * 17.3 + 5.1,
    };

    fishes.push(fishData);

    // Initial transform
    dummy.position.copy(fishData.position);
    const yaw = Math.atan2(-velZ, velX);
    dummy.rotation.set(0, yaw, 0, 'YXZ');
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;

  let currentFreezeProgress = 0.0;

  return {
    group,

    update(dt: number, elapsed: number, waterLevel: number, freezeProgress: number = 0): void {
      currentFreezeProgress = THREE.MathUtils.clamp(freezeProgress, 0.0, 1.0);
      // Clamp delta time to avoid large physics steps
      const safeDt = Math.min(dt, 0.06);
      fishUniforms.uTime.value += Math.max(0, safeDt) * (1 - currentFreezeProgress * .65);
      const tideOffset = waterLevel - BASE_WATER_LEVEL;

      // Group center calculation for loose schooling cohesion
      const groupCenter = new THREE.Vector3();
      for (let i = 0; i < NUM_FISH; i++) {
        groupCenter.add(fishes[i].position);
      }
      groupCenter.multiplyScalar(1 / NUM_FISH);

      const forward = new THREE.Vector3();
      const steer = new THREE.Vector3();

      for (let i = 0; i < NUM_FISH; i++) {
        const fish = fishes[i];
        steer.set(0, 0, 0);

        // 1. Schooling: Loose cohesion towards group center
        const toGroup = groupCenter.clone().sub(fish.position);
        toGroup.y = 0;
        const distToGroup = toGroup.length();
        if (distToGroup > 0.4) {
          toGroup.normalize();
          steer.addScaledVector(toGroup, 0.25);
        }

        // Personal space: Separation from other fish
        for (let j = 0; j < NUM_FISH; j++) {
          if (i === j) continue;
          const other = fishes[j];
          const sepVec = fish.position.clone().sub(other.position);
          sepVec.y = 0;
          const dist = sepVec.length();
          const personalSpace = 0.38;
          if (dist < personalSpace && dist > 0.0001) {
            sepVec.normalize();
            const strength = (personalSpace - dist) / personalSpace;
            steer.addScaledVector(sepVec, strength * 1.8);
          }
        }

        // 2. Wandering: Smooth continuous noise variation
        const noiseWander = simplexNoise2D(fish.seedOffset + elapsed * 0.45, 0.5);
        fish.wanderAngle += noiseWander * safeDt * 1.6;
        const wanderDir = new THREE.Vector3(Math.cos(fish.wanderAngle), 0, Math.sin(fish.wanderAngle));
        steer.addScaledVector(wanderDir, 0.45);

        // 3. Stream Bank & Shallow Water Avoidance
        const speedXZ = Math.hypot(fish.velocity.x, fish.velocity.z);
        if (speedXZ > 0.001) {
          forward.set(fish.velocity.x / speedXZ, 0, fish.velocity.z / speedXZ);
        } else {
          forward.set(1, 0, 0);
        }

        const probeDist = 0.45;
        const probeAheadX = fish.position.x + forward.x * probeDist;
        const probeAheadZ = fish.position.z + forward.z * probeDist;

        // Sample left and right 45-degree probes
        const cos45 = 0.7071;
        const sin45 = 0.7071;
        const leftDirX = forward.x * cos45 - forward.z * sin45;
        const leftDirZ = forward.x * sin45 + forward.z * cos45;
        const rightDirX = forward.x * cos45 + forward.z * sin45;
        const rightDirZ = -forward.x * sin45 + forward.z * cos45;

        const probeLeftX = fish.position.x + leftDirX * probeDist;
        const probeLeftZ = fish.position.z + leftDirZ * probeDist;
        const probeRightX = fish.position.x + rightDirX * probeDist;
        const probeRightZ = fish.position.z + rightDirZ * probeDist;

        let localWaterLevel = getWaterSurfaceHeight(fish.position.z, tideOffset);
        const aheadInWater = isInWater(probeAheadX, probeAheadZ, tideOffset);
        const aheadWaterH = getWaterSurfaceHeight(probeAheadZ, tideOffset);
        const aheadDepth = aheadWaterH - getHeightAt(probeAheadX, probeAheadZ);

        if (!aheadInWater || aheadDepth < 0.04) {
          // Ahead is blocked by bank or shallow water
          const leftWaterH = getWaterSurfaceHeight(probeLeftZ, tideOffset);
          const leftOk = isInWater(probeLeftX, probeLeftZ, tideOffset) && (leftWaterH - getHeightAt(probeLeftX, probeLeftZ) >= 0.04);
          const rightWaterH = getWaterSurfaceHeight(probeRightZ, tideOffset);
          const rightOk = isInWater(probeRightX, probeRightZ, tideOffset) && (rightWaterH - getHeightAt(probeRightX, probeRightZ) >= 0.04);

          if (leftOk && !rightOk) {
            steer.x += leftDirX * 2.5;
            steer.z += leftDirZ * 2.5;
          } else if (rightOk && !leftOk) {
            steer.x += rightDirX * 2.5;
            steer.z += rightDirZ * 2.5;
          } else {
            // Both sides blocked or neutral: steer towards curved stream center line
            const curCenter = getStreamCenter(fish.position.z);
            steer.x += (curCenter - fish.position.x) * 3.5;
          }
        }

        // diorama stream Z boundaries
        if (fish.position.z < streamMinZ + 0.1) {
          steer.z += 2.8;
        } else if (fish.position.z > streamMaxZ - 0.1) {
          steer.z -= 2.8;
        }

        // Strong recovery if fish ever wanders outside stream
        if (!isInWater(fish.position.x, fish.position.z, tideOffset)) {
          const curCenter = getStreamCenter(fish.position.z);
          steer.x += (curCenter - fish.position.x) * 4.5;
        }

        // 4. Ripple flee decay
        fish.rippleFleeBoost.multiplyScalar(Math.exp(-safeDt * 3.0));
        steer.add(fish.rippleFleeBoost);

        // Apply steering force to velocity
        fish.velocity.x += steer.x * safeDt;
        fish.velocity.z += steer.z * safeDt;

        // 5. Speed regulation: normal speed ~0.3-0.6 units/sec, temporary burst up to ~1.1 on ripple
        // Fish become more sluggish in cold/winter water
        const winterSpeedFactor = 1.0 - currentFreezeProgress * 0.55;
        const fleeMagnitude = fish.rippleFleeBoost.length() * (1.0 - currentFreezeProgress * 0.6);
        const minAllowedSpeed = 0.28 * winterSpeedFactor;
        const maxAllowedSpeed = Math.min(1.2 * winterSpeedFactor, (fish.baseSpeed + fleeMagnitude * 0.8) * winterSpeedFactor);
        const currentSpeedXZ = Math.hypot(fish.velocity.x, fish.velocity.z);

        if (currentSpeedXZ > 0.0001) {
          const targetSpeed = THREE.MathUtils.clamp(currentSpeedXZ, minAllowedSpeed, maxAllowedSpeed);
          fish.velocity.x = (fish.velocity.x / currentSpeedXZ) * targetSpeed;
          fish.velocity.z = (fish.velocity.z / currentSpeedXZ) * targetSpeed;
        } else {
          fish.velocity.set(fish.baseSpeed * winterSpeedFactor, 0, 0);
        }

        // Advance position in horizontal plane
        fish.position.x += fish.velocity.x * safeDt;
        fish.position.z += fish.velocity.z * safeDt;

        // 6. Depth management: stay between terrain height and localWaterLevel - 0.03
        // In winter, fish stay deeper below the ice and never poke through the ice surface
        let terrainHeight = getHeightAt(fish.position.x, fish.position.z);
        localWaterLevel = getWaterSurfaceHeight(fish.position.z, tideOffset);
        // A fish body must fit below the surface, including its pitch and dorsal fin.
        // Recover toward the deeper channel if a falling tide strands its previous position.
        const bodyClearance = .065 + currentFreezeProgress * .045;
        if (localWaterLevel - terrainHeight < bodyClearance + .035) {
          fish.position.x = getStreamCenter(fish.position.z);
          terrainHeight = getHeightAt(fish.position.x, fish.position.z);
        }
        const safeMinY = terrainHeight + 0.03;
        const safeMaxY = localWaterLevel - bodyClearance;

        let targetY: number;
        if (safeMaxY > safeMinY) {
          // Gentle vertical bobbing with phase (calmer in winter)
          const bobAmplitude = 0.012 * (1.0 - currentFreezeProgress * 0.5);
          const bobOffset = Math.sin(elapsed * 2.2 + fish.phase) * bobAmplitude;
          targetY = THREE.MathUtils.clamp(
            (safeMinY + safeMaxY) * 0.5 + bobOffset,
            safeMinY,
            safeMaxY
          );
        } else {
          targetY = (terrainHeight + safeMaxY) * 0.5;
        }

        fish.velocity.y = (targetY - fish.position.y) * 3.5;
        fish.position.y += fish.velocity.y * safeDt;
        const physicalMaxY = localWaterLevel - bodyClearance;
        fish.position.y = Math.min(physicalMaxY, Math.max(terrainHeight + .025, fish.position.y));

        // 7. Update InstancedMesh transform matrix
        const headingDirX = fish.velocity.x;
        const headingDirZ = fish.velocity.z;
        const curSpeed = Math.hypot(headingDirX, headingDirZ);

        if (curSpeed > 0.001) {
          const yaw = Math.atan2(-headingDirZ, headingDirX);
          const pitch = THREE.MathUtils.clamp(
            -Math.atan2(fish.velocity.y, curSpeed) * 0.4,
            -0.45,
            0.45
          );
          dummy.rotation.set(0, yaw, pitch, 'YXZ');
        }

        dummy.position.copy(fish.position);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
    },

    reactToRipple(x: number, z: number): void {
      if (currentFreezeProgress >= .94) return;
      const RIPPLE_RADIUS = 2.4;
      // In winter, fish are more sluggish under cold water, but still respond to disturbances in open water
      const fleeSuppression = 1.0 - currentFreezeProgress * 0.55;
      for (let i = 0; i < NUM_FISH; i++) {
        const fish = fishes[i];
        const dx = fish.position.x - x;
        const dz = fish.position.z - z;
        const dist = Math.hypot(dx, dz);

        if (dist < RIPPLE_RADIUS) {
          const fleeStrength = (1.0 - dist / RIPPLE_RADIUS) * 2.2 * fleeSuppression;
          const safeDist = dist > 0.0001 ? dist : 0.0001;
          const dirX = dx / safeDist;
          const dirZ = dz / safeDist;

          // Add sudden impulse away from ripple source
          fish.rippleFleeBoost.x += dirX * fleeStrength;
          fish.rippleFleeBoost.z += dirZ * fleeStrength;

          // Align velocity immediately towards flee direction
          fish.velocity.x += dirX * fleeStrength * 0.6;
          fish.velocity.z += dirZ * fleeStrength * 0.6;

          // Subtle startle dive
          fish.position.y -= 0.02 * (1.0 - dist / RIPPLE_RADIUS);
        }
      }
    },

    dispose(): void {
      scene.remove(group);
      fishGeometry.dispose();
      fishMaterial.dispose();
    },
  };
}
