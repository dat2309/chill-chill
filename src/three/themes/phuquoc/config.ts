import * as THREE from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';

export const PHUQUOC_METADATA: ThemeMetadata<'phuquoc'> = {
  id: 'phuquoc',
  name: 'Sunset Beach',
  tagline: 'A fictional coastal retreat inspired by Ông Lang.',
  eyebrow: 'A FICTIONAL COASTAL RETREAT INSPIRED BY ÔNG LANG',
  description: 'A peaceful coastal diorama inspired by the natural shores of Ông Lang, featuring curved sandy shorelines interspersed with coastal rocks, thatched bungalows, a wooden jetty, and glowing western sunsets over the Gulf of Thailand.',
  badges: ['Ông Lang Inspiration', 'Western Sunset', 'Coastal Rocks & Palms'],
  seasons: [
    { id: 'dry', label: '☀️', icon: '☀️', name: 'Mùa khô (Dry)' },
    { id: 'rainy', label: '🌧️', icon: '🌧️', name: 'Mùa mưa (Rainy)' },
  ],
  defaultTime: 17.75, // 17:45 experiential sunset preset
  defaultSeason: 'dry',
  previewGradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 45%, #20b2aa 100%)',
  howItMade: [
    {
      icon: '🏝️',
      title: 'Ông Lang Coastline & Beach Profile',
      content: 'Modeled after the alternating sand coves and coastal rock outcroppings typical of Ông Lang beach. The mathematical elevation profile transitions smoothly from submerged seabed through the swash zone to the upper beach terrace with zero step discontinuities.',
    },
    {
      icon: '🌊',
      title: 'Tropical Ocean & Physical Beer–Lambert Absorption',
      content: 'The ocean surface implements true exponential Beer–Lambert light absorption (exp(-depth * coeff)), selectively absorbing long red wavelengths first while allowing emerald-teal tones to penetrate. Schlick Fresnel reflection calculates sky color bounce with a fixed-seabed cut skirt.',
    },
    {
      icon: '🛶',
      title: 'Traditional Coastal Boats',
      content: 'Includes a Vietnamese circular woven-bamboo coracle (thuyền thúng) with pitch coating and a wooden coastal skiff (ghe nhỏ) with red trim and traditional painted bow eyes, floating with buoyancy and gentle swell rocking.',
    },
    {
      icon: '🛖',
      title: 'Thatched Bungalows & Jetty',
      content: 'Fictional resort architecture featuring thatched-roof bungalows raised on wooden stilts above high-tide level, woven bamboo walls, evening lanterns with cached emissive glow, and a rustic wooden pier whose pilings embed into the seabed.',
    },
    {
      icon: '🌴',
      title: 'Tropical Coastal Flora',
      content: 'Procedural curved coconut palms leaning seaward with pinnate frond crowns, coastal whistling pines (phi lao) on the low rear knolls, and pink bougainvillea (hoa giấy) blooming over coastal rock clusters.',
    },
    {
      icon: '🌧️',
      title: 'Two Seasons & Variable Weather',
      content: 'The Dry season features clear skies and calm waters. The Rainy season simulates monsoon conditions with slender falling rain streaks, wave chop, darkened damp thatch, and smooth 1.8s transitions with reduced-motion support.',
    },
    {
      icon: '🌅',
      title: 'Western Sunset & Dynamic Sky Gradient',
      content: 'With the sea facing West (-X), 17:30–18:15 features a vivid tropical sunset with a tripartite sky gradient (zenith purple-blue, mid magenta-pink, horizon pink-orange) synchronized with uSunsetSkyColor for ocean reflections, zero premature night-darkening at 17:45, and a soft pale-pink horizon band retained during monsoon rain.',
    },
  ],
};

// Coordinate convention:
// +X = East (inland low hills), -X = West (sea & sunset)
// +Z = North, -Z = South, +Y = Up
export const PHUQUOC_CAMERA_PRESET: ThemeCameraPreset = {
  position: new THREE.Vector3(25.0, 21.0, 27.0),
  target: new THREE.Vector3(-0.5, 0.45, 0.4),
  baseFrustumHeight: 25.0,
  minPolarAngle: Math.PI * 0.16,
  maxPolarAngle: Math.PI * 0.44,
};
