import * as T from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';
export const MARKET_METADATA: ThemeMetadata<'market'> = { id: 'market', name: 'Chợ nổi miền Tây', tagline: 'Sớm mai trên dòng Cửu Long.', eyebrow: 'CHỢ NỔI · MEKONG MORNING', description: 'Ngã ba sông phù sa, ghe hàng và những mái nhà ven nước.', badges: ['20 ghe hàng', 'Sương sớm', 'Cây bẹo'], seasons: [{ id: 'dawn', label: '🌅', icon: '🌅', name: 'Sáng sớm sương' }, { id: 'noon', label: '☀️', icon: '☀️', name: 'Trưa nắng' }], defaultTime: 6.5, defaultSeason: 'dawn', previewGradient: 'linear-gradient(#e3a793,#c9bfa3,#728f86)', howItMade: [{ icon: '🛶', title: 'Ghe hàng procedural', content: 'Thân ghe có vỏ và khoang thật; hàng hóa dùng instancing, chuyển động theo các luồng tách biệt.' }, { icon: '🌊', title: 'Dòng phù sa', content: 'CPU và shader dùng chung trường sóng; bóng phản chiếu và vệt ghe tính trực tiếp trên mặt nước.' }] };
export const MARKET_CAMERA_PRESET: ThemeCameraPreset = { position: new T.Vector3(19, 20, 26), target: new T.Vector3(0, .6, 0), baseFrustumHeight: 25 };
export function bankEdge(x: number) { return -5.4 + .50 * Math.sin(x * .27) + .23 * Math.cos(x * .63); }
export function isRiver(x: number, z: number) { return Math.abs(x) < 11.5 && Math.abs(z) < 8 && z > bankEdge(x); }
export const BOAT_COUNT = 20;
/** Four concentric lanes. Equal angular velocities preserve neighbour spacing exactly. */
export function boatPosition(i: number, time: number, out: T.Vector3) { const lane = Math.floor(i / 5), a = i % 5 * Math.PI * 2 / 5 + lane * .41 + time * .011; return out.set((3.3 + lane * 2.05) * Math.cos(a), 0, 1.1 + (1.35 + lane * 1.32) * Math.sin(a)); }
