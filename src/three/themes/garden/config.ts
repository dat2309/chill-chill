import * as THREE from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';

export const GARDEN_METADATA: ThemeMetadata<'garden'> = {
  id: 'garden',
  name: 'Chillax Garden & Stream',
  tagline: 'Where the garden meets the stream',
  eyebrow: 'GLAMPING AND STREAM, IN MINIATURE',
  description: 'An alpine glamping retreat beside a flowing mountain stream, generated 100% from mathematics without external 3D models.',
  badges: ['Chillax Garden', 'Highland Stream', 'Valley Cove'],
  seasons: [
    { id: 'spring', label: '🌸', icon: '🌸', name: 'Spring' },
    { id: 'summer', label: '☀️', icon: '☀️', name: 'Summer' },
    { id: 'autumn', label: '🍂', icon: '🍂', name: 'Autumn' },
    { id: 'winter', label: '❄️', icon: '❄️', name: 'Winter' },
  ],
  defaultTime: 16.5, // 16:30
  defaultSeason: 'spring',
  previewGradient: 'linear-gradient(135deg, #8bc34a 0%, #4a7c59 50%, #2e583d 100%)',
  howItMade: [
    {
      icon: '🏔️',
      title: 'Terrain',
      content: 'The terrain is a 240×240 heightfield generated with multi-octave simplex noise (FBM), ridged multifractal for mountain ridges, and Voronoi patterns for rock textures. The diorama is a floating island with visible geological cross-section layers colored via vertex colors — no external textures are used.',
    },
    {
      icon: '💧',
      title: 'Water & Ripples',
      content: "Water uses a custom GLSL shader implementing Beer–Lambert light absorption for depth-dependent color, Schlick's Fresnel approximation for reflections, and animated surface normals. Ripples are simulated on the GPU using a ping-pong render target running the 2D wave equation each frame, with an analytical fallback.",
    },
    {
      icon: '🐟',
      title: 'Fish',
      content: '12 procedural fish are generated from mathematical body curves with oscillating tail vertices. They follow a simplified Boids algorithm for loose schooling, with boundary avoidance and ripple reactions.',
    },
    {
      icon: '🏕️',
      title: 'Architecture',
      content: 'Geodesic domes are constructed from subdivided icosahedra (detail level 2), hemisphered and framed on individual stilts. The A-frame cabin, furniture, campfire, and all props are built entirely from basic THREE.js geometries combined procedurally.',
    },
    {
      icon: '🌲',
      title: 'Vegetation',
      content: 'Over 4,500 plant instances use THREE.InstancedMesh for high performance. Tree canopies are noise-deformed icospheres. Placement uses density maps based on elevation, slope, and proximity to water, with exclusion zones around buildings.',
    },
    {
      icon: '☀️',
      title: 'Lighting',
      content: 'The sun orbits based on a 0–24h slider, with color temperature shifting from warm golden (dawn/dusk) to neutral daylight to cool blue moonlight. Tent and cabin interiors glow at night via emissive materials and point lights.',
    },
    {
      icon: '🍂',
      title: 'Seasons',
      content: 'Four seasons smoothly interpolate vegetation colors, flower density, and snow coverage using per-instance color updates on InstancedMesh.',
    },
  ],
};

export const GARDEN_CAMERA_PRESET: ThemeCameraPreset = {
  position: new THREE.Vector3(16.0, 15.2, 27.5),
  target: new THREE.Vector3(-0.35, 0.65, 0.15),
  baseFrustumHeight: 24.5,
  minPolarAngle: Math.PI * 0.14,
  maxPolarAngle: Math.PI * 0.46,
};
