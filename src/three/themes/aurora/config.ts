import * as T from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';
export const AURORA_METADATA: ThemeMetadata<'aurora'> = { id: 'aurora', name: 'Cabin cực quang', tagline: 'Một ô cửa ấm dưới trời phương Bắc.', eyebrow: 'AURORA CABIN · NORTHERN LIGHTS', description: 'Cabin gỗ, hồ băng và rừng thông dưới cực quang hoặc bão tuyết.', badges: ['Hồ băng', 'Cực quang', 'Bão tuyết'], seasons: [{ id: 'clear', label: '🌌', icon: '🌌', name: 'Đêm cực quang' }, { id: 'blizzard', label: '❄️', icon: '❄️', name: 'Bão tuyết' }], defaultTime: 21, defaultSeason: 'clear', previewGradient: 'linear-gradient(#121c37,#397c70,#afb4d3)', howItMade: [{ icon: '🌌', title: 'Dải sáng phương Bắc', content: 'Một ribbon shader procedural, một draw call, chuyển động chậm; sao và phản chiếu trên băng không cần texture.' }, { icon: '❄️', title: 'Mùa đông phương Bắc', content: 'Dùng quy tắc freezeProgress chung với Garden; hồ luôn kín băng. Tuyết bám mái thật và mặt trên cành thông, gió tăng mượt trong bão.' }] };
export const AURORA_CAMERA_PRESET: ThemeCameraPreset = { position: new T.Vector3(20, 20, 28), target: new T.Vector3(0, 2, 0), baseFrustumHeight: 26 };
export function lakeRadius(x: number, z: number) { const u = x / 7.6, v = (z - 2.6) / 3.5, a = Math.atan2(v, u); return Math.hypot(u, v) / (1 + .065 * Math.sin(a * 3) + .035 * Math.cos(a * 5)); }
export function terrainHeight(x: number, z: number) { const hills = .42 + .65 * Math.exp(-((x + 5) ** 2 + (z + 4) ** 2) / 18) + .45 * Math.exp(-((x - 6) ** 2 + (z + 5) ** 2) / 14); const shore = T.MathUtils.smoothstep(lakeRadius(x, z), .82, 1.13); return T.MathUtils.lerp(-.30, hills, shore); }
export function roofHeight(x: number, z: number) {
    if (Math.abs(x + 4) < 1.9 && Math.abs(z + 3.8) < 1.7)
        return CABIN_FLOOR + 1.76 + Math.max(0, 1.1 - Math.abs(x + 4) * 1.1 / 1.9) + .15;
    if (Math.abs(x - 3.5) < 1.15 && Math.abs(z + 3.4) < 1.2)
        return TENT_FLOOR + Math.max(0, 1.15 - Math.abs(x - 3.5)) + .1;
    return terrainHeight(x, z) + .035;
}
export const CABIN_FLOOR = Math.max(...[-5.6, -2.4].flatMap(x => [-5.1, -2.5].map(z => terrainHeight(x, z)))) + .16;
export const TENT_FLOOR = Math.max(...[2.5, 4.5].flatMap(x => [-4.4, -2.4].map(z => terrainHeight(x, z)))) + .16;
