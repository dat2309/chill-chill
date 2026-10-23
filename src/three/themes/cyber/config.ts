import * as T from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';
export const CYBER_METADATA: ThemeMetadata<'cyber'> = { id: 'cyber', name: 'Hẻm Cyberpunk', tagline: 'Một ngõ nhỏ sau cơn mưa neon.', eyebrow: 'CYBER ALLEY · SAIGON–TOKYO', description: 'Biển sáng, quán mì, dây điện và ánh neon lưu lại trong vũng nước.', badges: ['Mưa neon', 'Sau mưa', 'Phản chiếu procedural'], seasons: [{ id: 'rain', label: '🌧️', icon: '🌧️', name: 'Mưa neon' }, { id: 'after', label: '🌆', icon: '🌆', name: 'Sau mưa' }], defaultTime: 21, defaultSeason: 'rain', previewGradient: 'linear-gradient(#14182e,#694364,#1b707f)', howItMade: [{ icon: '💡', title: 'Ánh đèn trong ngõ', content: 'Ký hiệu tự tạo, emissive và halo mềm tại biển; không render lại cảnh để phản chiếu. Halo tự tắt sau 2 giây đầu nếu FPS thấp, hoặc khi chọn chất lượng thấp.' }, { icon: '🌧️', title: 'Mặt đường sau mưa', content: 'Độ ẩm và vũng tích lũy liên tục; mưa bị chặn bởi mái thật. Nền khô chậm, hơi nước tăng sau mưa.' }] };
export const CYBER_CAMERA_PRESET: ThemeCameraPreset = { position: new T.Vector3(17, 24, 28), target: new T.Vector3(0, 2.2, 0), baseFrustumHeight: 26 };
export const BUILDINGS = Array.from({ length: 8 }, (_, i) => ({ x: i < 4 ? -4.6 : 4.6, z: -6.3 + (i % 4) * 4.15, h: 7.6 - (i % 4) * .8 + (i % 2) * .35 }));
export const BASINS = [{ x: .3, z: -5, rx: 1.15, rz: 1.4 }, { x: -.5, z: -1, rx: 1.3, rz: 1.6 }, { x: .5, z: 3.2, rx: 1.1, rz: 1.35 }, { x: -.3, z: 6.7, rx: 1.05, rz: 1.0 }];
export function groundHeight(x: number, z: number) { let y = .08; for (const b of BASINS) {
    const r = ((x - b.x) / b.rx) ** 2 + ((z - b.z) / b.rz) ** 2;
    y -= .055 * Math.exp(-r * 2);
} return y; }
export function roofHeight(x: number, z: number) { for (const b of BUILDINGS)
    if (Math.abs(x - b.x) < 1.7 && Math.abs(z - b.z) < 1.7)
        return b.h + .22; if (x < -1.4 && x > -3.4 && z > 4.9 && z < 8.1)
    return 2.2; return groundHeight(x, z); }
