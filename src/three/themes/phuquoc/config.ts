import * as THREE from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';

export const PHUQUOC_METADATA: ThemeMetadata<'phuquoc'> = {
  id: 'phuquoc',
  name: 'Phu Quoc Sunset Bay',
  tagline: 'Emerald Waters & Sunset Palms',
  eyebrow: 'TROPICAL BAY & EMERALD WATERS',
  description: 'A tranquil tropical bay on Phu Quoc island with curved white sand, thatched roof bungalows, wooden jetty, and vibrant sunset skies.',
  badges: ['Phu Quoc Bay', 'Sunset Pier', 'Coral Cove'],
  seasons: [
    { id: 'dry', label: '☀️', icon: '☀️', name: 'Mùa khô (Dry)' },
    { id: 'rainy', label: '🌧️', icon: '🌧️', name: 'Mùa mưa (Rainy)' },
  ],
  defaultTime: 17.75, // 17:45 Sunset
  defaultSeason: 'dry',
  previewGradient: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 45%, #20b2aa 100%)',
  howItMade: [
    {
      icon: '🏝️',
      title: 'Shoreline & Coastal Terrain',
      content: 'The coastal bay is shaped by an analytical crescent shoreline with a parabolic seabed dropping into clear turquoise waters. Granite headlands and coconut palms are distributed using procedural slope and sand proximity masks.',
    },
    {
      icon: '🌊',
      title: 'Tropical Ocean & Marine Shader',
      content: 'The sea shader implements exponential Beer–Lambert absorption specifically tuned for tropical waters (absorbing red wavelengths first to reveal emerald greens and deep teals). Schlick Fresnel reflections capture the evening rose-violet sunset horizon.',
    },
    {
      icon: '🛶',
      title: 'Traditional Boats',
      content: 'Features a Vietnamese woven bamboo coracle (thuyền thúng) and coastal wooden fishing skiff (ghe nhỏ) floating with buoyant physics and natural wave pitch/roll.',
    },
    {
      icon: '🛖',
      title: 'Thatched Bungalows & Pier',
      content: 'Eco-resort bungalows on stilts with thatched palm frond roofs and bamboo lattice walls. A heavy-timber wooden jetty extends out into the emerald sea with pilings anchored to the seabed.',
    },
    {
      icon: '🌴',
      title: 'Tropical Vegetation',
      content: 'Procedural coconut palms with curved segmented trunks and arching fronds, coastal whistling pines (phi lao), and cascading pink bougainvillea (hoa giấy) blooming over granite crags.',
    },
    {
      icon: '🌧️',
      title: 'Tropical Weather System',
      content: 'Simulates the monsoon rainy season with procedural raindrop particles, wind-tossed palm canopies, and wet sand/thatch darkening with a smooth 1.8s seasonal transition.',
    },
    {
      icon: '🌅',
      title: 'Sunset Atmosphere',
      content: 'Golden hour at 17:45 with radiant pink, peach, and lavender sky gradients, specular sunset glint across the water surface, and warm glowing lanterns in the bungalows.',
    },
  ],
};

export const PHUQUOC_CAMERA_PRESET: ThemeCameraPreset = {
  position: new THREE.Vector3(25.0, 21.0, 27.0),
  target: new THREE.Vector3(0.0, 0.45, 0.6),
  baseFrustumHeight: 25.0,
  minPolarAngle: Math.PI * 0.16,
  maxPolarAngle: Math.PI * 0.44,
};
