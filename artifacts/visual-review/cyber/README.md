# Cyberpunk — visual review

Ngày 2026-10-23. Commit theme: `081617d`.

- Build: `npm run build` đạt; cảnh báo chunk Three.js >500 kB có sẵn.
- Logic: toàn bộ `npm test` đạt (17 suite). Cyber 18 kiểm tra: tích lũy/giữ/rút vũng và độ ẩm, reversal, FPS, actual rain vertices trên mái, vị trí vũng, nhịp emissive đo từ material, halo auto-off ở20FPS/quality low, migration và dispose.
- WebGL: 52,692 tam giác, 237 draw calls lúc mưa; 619,625 channel đổi >12 giữa hai trạng thái cùng camera. Không lỗi shader, geometry237→0, portrait chứa bounds. Đã xem first/second/close/top; thêm ảnh side, gió, reversal và UI desktop/mobile.
- Lỗi phát hiện: vật thể quá tối ở trạng thái mưa. Đã tăng ánh sáng môi trường lên vật thể, thêm cửa sổ mặt đầu ngõ và chỉnh luồng hơi nước thoát qua mép mái. Quán mì vẫn có mái che, mưa bị chặn ở mái.
- Halo là glow procedural tại biển trong lượt render chính, không dùng full-screen postprocessing bloom. Phản chiếu mặt đường/vũng là shader gần đúng, không render lại scene. Không có ảnh/model/texture ngoài.
- Giới hạn: Chrome SwiftShader; chưa đo FPS GPU phần cứng hoặc chất lượng trên thiết bị thật.

Prompt kiểm lại: “Mở check-cyber-webgl.html và ?theme=cyber; so sánh rain/after cùng camera, top/side/portrait; xem mái che, vũng giữ nước, hơi nước và tắt halo bằng chất lượng thấp.”
