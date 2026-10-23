import * as T from 'three';
export function createAurora(parent: T.Group) {
    const g = new T.PlaneGeometry(21, 3.2, 128, 8);
    g.translate(0, 7.3, -7.6);
    const uniforms = { uTime: { value: 0 }, uStorm: { value: 0 } };
    const material = new T.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, vertexShader: `uniform float uTime;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.y+=sin(p.x*.38+uTime*.10)*.55;p.z+=sin(p.x*.5+uTime*.08)*.35;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`, fragmentShader: `uniform float uTime,uStorm;varying vec2 vUv;void main(){float arch=.42+.16*sin(vUv.x*8.+uTime*.10);float band=smoothstep(.02,.30,vUv.y)*exp(-pow((vUv.y-arch)*2.0,2.));float curtain=.85+.10*sin(vUv.x*170.+sin(vUv.x*13.+uTime*.12)*3.)+.05*cos(vUv.x*279.);float edge=smoothstep(0.,.15,vUv.x)*smoothstep(1.,.85,vUv.x)*smoothstep(0.,.15,vUv.y)*smoothstep(1.,.8,vUv.y);vec3 c=mix(vec3(.10,.85,.48),vec3(.52,.24,.78),smoothstep(.45,.9,vUv.y));gl_FragColor=vec4(c,band*curtain*edge*.65*(1.-uStorm*.92));}` });
    const mesh = new T.Mesh(g, material);
    mesh.name = 'aurora-ribbon';
    g.computeBoundingBox();
    g.boundingBox!.expandByScalar(.65);
    g.computeBoundingSphere();
    g.boundingSphere!.radius += .65;
    parent.add(mesh);
    const data = new Float32Array(180 * 3);
    let seed = 4917;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 180; i++) {
        data[i * 3] = random() * 21 - 10.5;
        data[i * 3 + 1] = 6 + random() * 4;
        data[i * 3 + 2] = -7.9 + random() * .2;
    }
    const starsGeo = new T.BufferGeometry();
    starsGeo.setAttribute('position', new T.BufferAttribute(data, 3));
    const starsMat = new T.PointsMaterial({ color: 0xe1ecff, size: .035, transparent: true, opacity: .8, depthWrite: false });
    const stars = new T.Points(starsGeo, starsMat);
    stars.name = 'sky-stars';
    parent.add(stars);
    return { mesh, uniforms, update(time: number, storm: number) { uniforms.uTime.value = time; uniforms.uStorm.value = storm; starsMat.opacity = .8 * (1 - storm * .95); } };
}
