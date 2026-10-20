import * as THREE from 'three';

export interface CameraFitOptions {
  paddingX?: number;
  paddingY?: number;
  minFrustumHeight?: number;
  excludeKeywords?: string[];
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

  const paddingX = options.paddingX ?? 1.16;
  const paddingY = options.paddingY ?? 1.28;
  const minFrustumHeight = options.minFrustumHeight ?? 23.5;
  const excludeKeywords = options.excludeKeywords ?? ['shadow', 'helper', 'rain', 'particle'];

  const box = new THREE.Box3();
  let meshCount = 0;

  scene.traverse((obj) => {
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
        const mBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
        box.union(mBox);
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
  const frustumH = Math.max(reqHeightFromY, reqHeightFromX, minFrustumHeight);

  camera.left = (-frustumH * aspect) / 2;
  camera.right = (frustumH * aspect) / 2;
  camera.top = frustumH / 2;
  camera.bottom = -frustumH / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}
