import * as THREE from 'three';

export interface CameraFitOptions {
  paddingX?: number;
  paddingY?: number;
  minFrustumHeight?: number;
  excludeKeywords?: string[];
}

/**
 * Sets orthographic camera projection bounds symmetrically based on frustum height and aspect ratio.
 */
export function setCameraProjection(
  camera: THREE.OrthographicCamera,
  frustumH: number,
  aspect: number
): void {
  camera.left = (-frustumH * aspect) / 2;
  camera.right = (frustumH * aspect) / 2;
  camera.top = frustumH / 2;
  camera.bottom = -frustumH / 2;
  camera.updateProjectionMatrix();
}

/**
 * Calculates the required base frustum height for an orthographic camera to comfortably fit the bounds of an Object3D/Scene.
 * Ensures world matrices are updated prior to calculating bounds.
 */
export function calculateBaseFrustumHeight(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  sceneOrGroup: THREE.Object3D,
  options: CameraFitOptions = {}
): number {
  const parent = renderer.domElement.parentElement;
  const w = parent ? parent.clientWidth : renderer.domElement.width;
  const h = parent ? parent.clientHeight : renderer.domElement.height;
  const aspect = w > 0 && h > 0 ? w / h : 1.0;

  const isPortraitMobile = aspect < 0.8;
  const paddingX = options.paddingX ?? (isPortraitMobile ? 1.06 : 1.16);
  const paddingY = options.paddingY ?? (isPortraitMobile ? 1.15 : 1.28);
  const minFrustumHeight = options.minFrustumHeight ?? (isPortraitMobile ? 21.0 : 23.5);
  const excludeKeywords = options.excludeKeywords ?? ['shadow', 'helper', 'rain', 'particle', 'sky'];

  // Update world matrices before calculating bounding box
  sceneOrGroup.updateMatrixWorld(true);

  const box = new THREE.Box3();
  let meshCount = 0;

  sceneOrGroup.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
      const mesh = obj as THREE.Mesh;
      const name = (mesh.name || '').toLowerCase();
      for (const kw of excludeKeywords) {
        if (name.includes(kw)) return;
      }
      if (!mesh.geometry) return;
      if (!mesh.visible) return;

      mesh.geometry.computeBoundingBox();
      if (mesh.geometry.boundingBox) {
        if ((mesh as THREE.InstancedMesh).isInstancedMesh) {
          const instMesh = mesh as THREE.InstancedMesh;
          const dummyMatrix = new THREE.Matrix4();
          for (let i = 0; i < instMesh.count; i++) {
            instMesh.getMatrixAt(i, dummyMatrix);
            const mBox = mesh.geometry.boundingBox.clone().applyMatrix4(dummyMatrix).applyMatrix4(mesh.matrixWorld);
            box.union(mBox);
          }
        } else {
          const mBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
          box.union(mBox);
        }
        meshCount++;
      }
    }
  });

  if (meshCount === 0 || box.isEmpty()) {
    box.set(new THREE.Vector3(-10.2, -0.75, -8.2), new THREE.Vector3(10.2, 5.2, 8.2));
  }

  camera.updateMatrixWorld();
  const invCamMat = camera.matrixWorldInverse;

  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    new THREE.Vector3(box.max.x, box.max.y, box.max.z),
  ];

  let minViewX = Infinity;
  let maxViewX = -Infinity;
  let minViewY = Infinity;
  let maxViewY = -Infinity;

  for (const c of corners) {
    c.applyMatrix4(invCamMat);
    if (c.x < minViewX) minViewX = c.x;
    if (c.x > maxViewX) maxViewX = c.x;
    if (c.y < minViewY) minViewY = c.y;
    if (c.y > maxViewY) maxViewY = c.y;
  }

  const viewWidth = maxViewX - minViewX;
  const viewHeight = maxViewY - minViewY;

  const reqHeightFromY = viewHeight * paddingY;
  const reqHeightFromX = (viewWidth * paddingX) / aspect;
  return Math.max(reqHeightFromY, reqHeightFromX, minFrustumHeight);
}

/**
 * Fits orthographic camera precisely to content bounding box.
 * Automatically excludes contact shadows, helpers, and weather particles.
 */
export function fitOrthographicCameraToBounds(
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  options: CameraFitOptions = {}
): void {
  const parent = renderer.domElement.parentElement;
  if (!parent) return;

  const w = parent.clientWidth;
  const h = parent.clientHeight;
  if (w <= 0 || h <= 0) return;
  const aspect = w / h;

  const frustumH = calculateBaseFrustumHeight(camera, renderer, scene, options);
  setCameraProjection(camera, frustumH, aspect);
  renderer.setSize(w, h);
}
