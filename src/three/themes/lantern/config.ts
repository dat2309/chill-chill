import * as THREE from 'three';
import { ThemeMetadata, ThemeCameraPreset } from '../../core/types';
export const LANTERN_METADATA: ThemeMetadata<'lantern'> = {
    id: 'lantern', name: 'Hội An đêm', tagline: 'Đèn phố soi dòng Hoài.', eyebrow: 'LANTERN TOWN · PHỐ CỔ VEN SÔNG', description: 'Nhà vàng, cầu gỗ mái ngói và lồng đèn soi xuống sông Hoài.', badges: ['Phố cổ', 'Sông Hoài', 'Đèn hoa đăng'], seasons: [{
            id: 'night', label: '🌃', icon: '🌃', name: 'Đêm thường'
        }, {
            id: 'festival', label: '🌕', icon: '🌕', name: 'Đêm rằm'
        }], defaultTime: 19.5, defaultSeason: 'night', previewGradient: 'linear-gradient(150deg,#151c44,#71426e 60%,#e5a153)', howItMade: [{
            icon: '🏮', title: 'Phố lồng đèn procedural', content: 'Nhà, ngói, cầu, thuyền và đèn được dựng từ hình học; lồng đèn cùng loại dùng instancing.'
        }, {
            icon: '🌊', title: 'Ánh đèn trên dòng Hoài', content: 'Sóng dùng trường gió chung, phản chiếu đèn được tính trên shader nước; không render lại cảnh.'
        }, {
            icon: '🌧️', title: 'Mưa và hoa đăng', content: 'Độ ẩm lưu lại sau mưa; hoa đăng trôi theo dòng và nhấp nhô theo cùng mặt sóng.'
        }]
};
export const LANTERN_CAMERA_PRESET: ThemeCameraPreset = {
    position: new THREE.Vector3(17, 17, 24), target: new THREE.Vector3(0, .9, -.1), baseFrustumHeight: 23, minPolarAngle: .25, maxPolarAngle: 1.35
};
export const RIVER = {
    minX: -10.25, maxX: 10.25, minZ: -.8, maxZ: 4.4, bed: -.48
};
export const HOUSE_SPOTS = [-8.1, -5.4, -2.7, 0, 2.7, 5.4, 8.1].map((x, i) => ({
    x, z: -4.2 + (i % 2) * .16, w: 2.35, d: 2.7, h: 2.5 + (i % 3) * .22
}));
export const LANTERN_COLORS = [0xe75045, 0xf28b38, 0xffcf62, 0x54b68e, 0xb57bd8, 0xffe8ba];
export function waterLevel(tide: string) {
    return tide === 'low' ? -.08 : .04;
}
export function isRiver(x: number, z: number) {
    return x > RIVER.minX && x < RIVER.maxX && z > RIVER.minZ && z < RIVER.maxZ && !(Math.abs(x + 5.4) < 1.20);
}
