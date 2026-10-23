# Chợ nổi — visual review

Ngày: 2026-10-23. Commit theme ban đầu: `417217e`; các sửa tích hợp sau được ghi trong `integration-review.md` ở thư mục cha.

- Build: `npm run build` đạt; cảnh báo chunk Three.js >500 kB có sẵn.
- Logic: toàn bộ `npm test` đạt (18 suite); Market 18 phép kiểm tra, 78,198 tam giác hình học. Quét 601 thời điểm trong 60 giây bằng hull world/kiểm tra separating axis: 0 chồng lấn, 0 footprint ra khỏi sông. Bubble chọn bằng ray thật và tự tắt sau 2 giây; kiểm tra reversal, FPS, migration, dispose.
- WebGL: Chrome/SwiftShader, 1200×900 và 600×1000. 77,742 tam giác render, 238 draw calls; 829,780 channel đổi >12 giữa hai trạng thái. Không lỗi shader; geometry 219→0 sau dispose. Portrait chứa bounds.
- Đã xem toàn cảnh, top và mobile thực tế: nước phù sa, ghe có khoang, hàng và mái che; bờ nhà có khoảng nước phía trước. Sương oval cứng và vân nước quá đều đã được sửa bằng shader fade và giảm tương phản. Ảnh close/side/reversal/wind lưu cùng thư mục.
- Giới hạn: FPS SwiftShader không đại diện GPU thiết bị thật. Chưa đo tốc độ GPU phần cứng.

Prompt kiểm lại: “Mở check-market-webgl.html và ứng dụng ?theme=market, so sánh dawn/noon cùng camera, top/side và portrait; kiểm tra thân ghe, khoảng cách, bubble 2 giây và tài nguyên sau dispose.”

Lượt tích hợp cuối: thêm hai nhánh sông, bờ có thể tích và cắt nước đúng vùng hở; dừa nước có rachis/tàu lá nối thật, đặt ngoài footprint nhà. Ray xiên vào canopy chọn đúng ghe theo đối chứng raycast mesh; quét trọn chu kỳ đường đi cũng không chồng hull.
