# Sapa — visual review

Ngày 2026-10-23. Code và ảnh thuộc commit thêm Sapa (`git log -- src/three/themes/sapa`).

- Build: `npm run build` đạt; cảnh báo chunk Three.js >500 kB có sẵn.
- Logic: toàn bộ `npm test` đạt (16 suite). Sapa: 29 kiểm tra; 8 thửa với nước thấp hơn cả bốn bờ, cột world chạm terrain, hai mặt cắt winding hướng ngoài, màu/uniform lúa, reversal/FPS, migration và dispose. 43,542 tam giác.
- WebGL: Chrome SwiftShader, 1200×900/600×1000: 102 draw calls; 794,103 channel đổi >12 giữa hai mùa cùng camera. Không lỗi shader, geometry 102→0, portrait chứa bounds.
- Đã xem ảnh first/second/side/close: mùa nước đổ thấy nước và hàng mạ; mùa vàng lúa cao, vàng và ánh sáng ấm. Lỗi winding mặt cắt và khe sau thửa cao nhất đã được render phát hiện rồi sửa. Chừa lúa quanh trâu để thấy hình dáng; khép phần đầu hồi mái.
- Ảnh ứng dụng thật desktop/mobile lưu cùng thư mục. FPS SwiftShader không đại diện GPU phần cứng; chưa đo trên thiết bị thật.

Prompt kiểm lại: “Mở check-sapa-webgl.html và ứng dụng ?theme=sapa; so sánh hai mùa, kiểm nước từng thửa/bờ, cột nhà, mặt cắt side/top và gốc lúa khi đổi gió.”
