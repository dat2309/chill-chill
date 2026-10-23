import * as T from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';
export const SAPA_METADATA: ThemeMetadata<'sapa'> = { id: 'sapa', name: 'Sapa ruộng bậc thang', tagline: 'Mùa vàng trên những đường mây.', eyebrow: 'SAPA · TERRACED VALLEY', description: 'Những thửa ruộng ôm sườn núi, nhà sàn và suối nhỏ miền cao.', badges: ['Ruộng bậc thang', 'Mùa nước đổ', 'Mùa vàng'], seasons: [{ id: 'flooded', label: '🌱', icon: '🌱', name: 'Mùa nước đổ' }, { id: 'ripe', label: '🌾', icon: '🌾', name: 'Mùa lúa chín' }], defaultTime: 16, defaultSeason: 'flooded', previewGradient: 'linear-gradient(#c6d3db,#91b29c,#dfbd55)', howItMade: [{ icon: '🌾', title: 'Các đường đồng mức', content: 'Mỗi thửa có đáy phẳng, bờ riêng và mực nước riêng, kết nối bằng sườn đất có cấu trúc.' }, { icon: '🍃', title: 'Mùa lúa và gió', content: 'Lúa instanced uốn từ gốc bằng shader; màu và độ cao chuyển mượt giữa hai mùa.' }] };
export const SAPA_CAMERA_PRESET: ThemeCameraPreset = { position: new T.Vector3(19, 22, 26), target: new T.Vector3(0, 1.8, 0), baseFrustumHeight: 24 };
export const TERRACES = Array.from({ length: 8 }, (_, i) => ({ id: i, z: -6.5 + i * 1.72, y: 4.7 - i * .57, berm: 4.7 - i * .57 + .17, water: 4.7 - i * .57 + .065 }));
export function contour(x: number, i: number) { return TERRACES[i].z + .42 * Math.sin(x * .28 + i * .26) + .18 * Math.cos(x * .59 - i * .2); }
export function terraceAt(x: number, z: number) {
    for (let i = 0; i < 8; i++)
        if (z >= contour(x, i) && z < contour(x, i) + 1.38)
            return i;
    return -1;
}
export function terrainHeight(x: number, z: number) {
    if (z < contour(x, 0))
        return 4.87;
    for (let i = 0; i < 8; i++) {
        const d = z - contour(x, i);
        if (d >= 0 && d < 1.38)
            return TERRACES[i].y;
        if (i < 7 && d >= 1.38 && z < contour(x, i + 1)) {
            const a = contour(x, i) + 1.38, b = contour(x, i + 1), u = T.MathUtils.clamp((z - a) / (b - a), 0, 1);
            return T.MathUtils.lerp(TERRACES[i].y, TERRACES[i + 1].y, u * u * (3 - 2 * u));
        }
    }
    return .71;
}
