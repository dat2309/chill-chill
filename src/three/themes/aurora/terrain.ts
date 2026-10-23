import * as T from 'three';
import { createClippedTerrainGrid } from '../../core/clippedTerrainGrid';
import { material } from '../../core/miniature';
import { terrainHeight, lakeRadius } from './config';
export function createTerrain(parent: T.Group) {
    const shape = new T.Shape();
    shape.moveTo(-10, -8);
    shape.lineTo(10, -8);
    shape.quadraticCurveTo(11, -8, 11, -7);
    shape.lineTo(11, 7);
    shape.quadraticCurveTo(11, 8, 10, 8);
    shape.lineTo(-10, 8);
    shape.quadraticCurveTo(-11, 8, -11, 7);
    shape.lineTo(-11, -7);
    shape.quadraticCurveTo(-11, -8, -10, -8);
    const outline = shape.getPoints(6), grid = createClippedTerrainGrid(outline, 132, 96), p: number[] = [];
    for (const point of grid.points)
        p.push(point.x, terrainHeight(point.x, point.y), point.y);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setIndex(grid.triangles);
    g.computeVertexNormals();
    const ground = new T.Mesh(g, material(0x8b9297));
    ground.name = 'aurora-ground';
    ground.receiveShadow = true;
    parent.add(ground);
    const snowPositions: number[] = [], snowIndex: number[] = [];
    for (const point of grid.points)
        snowPositions.push(point.x, terrainHeight(point.x, point.y) + .035, point.y);
    for (let i = 0; i < grid.triangles.length; i += 3) {
        const ids = grid.triangles.slice(i, i + 3), a = new T.Vector3().fromArray(p, ids[0] * 3), b = new T.Vector3().fromArray(p, ids[1] * 3), c = new T.Vector3().fromArray(p, ids[2] * 3);
        const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
        snowIndex.push(...ids);
    }
    const sg = new T.BufferGeometry();
    sg.setAttribute('position', new T.Float32BufferAttribute(snowPositions, 3));
    sg.setIndex(snowIndex);
    sg.computeVertexNormals();
    const snow = new T.Mesh(sg, material(0xdce7e9, .96));
    snow.name = 'ground-snow-cover';
    snow.receiveShadow = true;
    parent.add(snow);
    const side: number[] = [], idx: number[] = [];
    for (const v of grid.boundary)
        side.push(v.x, -.9, v.y, v.x, terrainHeight(v.x, v.y), v.y);
    for (let i = 0; i < grid.boundary.length; i++) {
        const a = i * 2, b = ((i + 1) % grid.boundary.length) * 2;
        idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
    const wall = new T.BufferGeometry();
    wall.setAttribute('position', new T.Float32BufferAttribute(side, 3));
    wall.setIndex(idx);
    wall.computeVertexNormals();
    parent.add(new T.Mesh(wall, material(0x83909e)));
    const base = new T.ShapeGeometry(shape, 6);
    base.rotateX(Math.PI / 2);
    base.translate(0, -.9, 0);
    parent.add(new T.Mesh(base, material(0x566674)));
    return { ground, snow };
}
