# Hội An đêm — kiểm chứng hình ảnh

- Code commit: `c01f7fc`.
- Ngày: **2026-10-23**, Asia/Ho_Chi_Minh.
- Route ứng dụng: `/?theme=lantern&camera=default`.
- Harness: `scripts/check-lantern-webgl.html`; camera preset `[17,17,24]`, target `[0,.9,-.1]`.
- Renderer: Chrome headless, ANGLE SwiftShader WebGL; ảnh canvas đã ghép đúng CSS sky gradient. Ảnh `app-*` chụp trực tiếp ứng dụng React/SceneManager.

## Build

`npm run build` đạt, không lỗi TypeScript/Vite. Vẫn có cảnh báo bundle Three.js >500 kB đã tồn tại.

## Logic và tài nguyên

`npm test` đạt toàn bộ suite hiện có, gồm **185 kiểm tra Hội An** và **113 kiểm tra lifecycle**.
Các phép đo dùng geometry/instance matrix thực tế: điểm đỡ, miền tương tác, hướng nghiêng thuyền theo normal sóng, transform cavity cuối, camera fit aspect 1,33 / 0,6, reversal, FPS-independent blend, đường đi silhouette 60 giây và migration v4→v5.

| Đo trực tiếp WebGL | Kết quả |
| --- | --- |
| Tam giác/khung, cả hai trạng thái | 110.874 / ngân sách 400.000 |
| Draw call/khung | 55 |
| Lồng đèn treo | 52, thân 1 draw call; thân/caps/dây treo/halo tổng 4 batch |
| Kênh pixel thay đổi >12 giữa hai trạng thái, cùng camera và pha sóng | 157.897 |
| Geometry GPU trước → sau dispose | 54 → 0 |
| Texture GPU trước → sau dispose | 1 → 0 |
| CSS nền sau dispose | Được dọn |
| Click nước | Tăng đúng 1 instance hoa đăng thực sự hiển thị |
| Shader/runtime errors | 0 |

Mặt nước dùng chung GLSL swell với Beach, thêm phản chiếu đèn trong một pass; không có render target phản chiếu hay render lại toàn cảnh. Mưa dùng cùng cường độ hiệu dụng cho streaks, gợn nước, độ ẩm đường và halo đèn. Vật liệu còn ẩm sau khi tạnh.

## Quan sát hình ảnh

| Ảnh | Phạm vi |
| --- | --- |
| [night.png](night.png) | Đêm thường, 19:30, high tide |
| [festival.png](festival.png) | Đêm rằm cùng camera và pha sóng: trăng lớn, hoa đăng dày |
| [festival-click.png](festival-click.png) | Thả thêm hoa đăng |
| [rain.png](rain.png) | Mưa nhẹ, đường ướt, halo nhỏ hơn |
| [after-rain.png](after-rain.png) | Hết mưa, độ ẩm còn lại |
| [portrait.png](portrait.png) | Camera fit 600×1000, aspect 0,6 |
| [top.png](top.png) | Bờ đá, cầu, mái và khoang thuyền nhìn trên xuống |
| [side.png](side.png) | Điểm đỡ cầu, deck cong, mái và lớp đất trưng bày |
| [app-night.png](app-night.png) | Ứng dụng thật, desktop |
| [app-festival-rain.png](app-festival-rain.png) | Chọn đêm rằm và mưa qua UI thật |
| [app-mobile.png](app-mobile.png) | 390×844; toàn cảnh và các nút đều nằm trong viewport |

Đã rà silhouette nhà mái ngói, tiếp xúc cột–deck–mái của cầu, gable khép kín, chỗ treo đèn, đường trống ven sông và cả hai trạng thái ở cùng camera. Sửa lỗi resize thật (desktop → portrait) sau khi regression test tái hiện clipping; giữ góc orbit và zoom. Đổi Hội An → Garden → Hội An qua modal thành công, state đêm rằm/mưa được giữ riêng. Kiểm tra hồi quy GPU Garden/Beach đạt 8/8: băng kín hai tide, nước lỏng còn chuyển động, puddle tích lũy/rút và không lỗi shader.

**Chưa xác minh:** FPS trên GPU/thiết bị di động thật. SwiftShader không đại diện cho hiệu năng thiết bị người dùng. Không có model/texture ngoài; các PNG ở đây chỉ là bằng chứng render.

Prompt review:

> Mở `/?theme=lantern&camera=default`, so sánh đêm thường/đêm rằm, bật/tắt mưa, click vùng sông hở để thả một hoa đăng. Rà mái–tường–cột, khoang thuyền, phản chiếu đèn; đổi sang Garden rồi quay lại. Thu từ desktop xuống 390px và kiểm tra toàn cảnh lẫn toolbar. Chạy `npm test`, `npm run build` và `scripts/check-lantern-webgl.html`; không push/deploy.
