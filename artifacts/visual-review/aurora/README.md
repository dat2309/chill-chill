# Cabin cực quang — visual review

Ngày 2026-10-23. Code/ảnh thuộc commit thêm Aurora (`git log -- src/three/themes/aurora`).

- Build: `npm run build` đạt; cảnh báo chunk Three.js >500 kB có sẵn.
- Logic: toàn bộ `npm test` đạt (18 suite). Aurora 23 kiểm tra: ray mesh world từ hai mặt mái tới đáy tuyết (gap0.0049), chân cabin/lều, lớp tuyết đất ngoài hồ250.70 đơn vị diện tích, 77.73% đỉnh lá hướng lên mang snow exposure cao, băng kín ở hai tide, không tương tác nước lỏng, reversal/FPS, migration/dispose. 149,618 tam giác.
- WebGL: Chrome SwiftShader 1200×900/600×1000, 77 draw calls toàn cảnh; ribbon cực quang đo riêng đúng1 draw call. Băng khác liquid-control383,434 channel >12. Không lỗi shader, geometry77→0; portrait chứa bounds. Các ảnh two states/default/top/side/close/reversal/wind và UI desktop/mobile lưu cùng thư mục. Liquid-control chỉ là đối chứng trong harness, không phải trạng thái được cung cấp trong theme.
- Lỗi render phát hiện và sửa: lớp tuyết bị răng cưa quanh hồ do chọn nguyên tam giác theo mask; thay bằng lớp bám liên tục giao với băng qua depth. Tăng các phiến lá kim tại đúng gốc nhánh, giữ khoảng hở giữa tầng cành. Làm ribbon liền hơn và phân bố sao bằng seed ổn định.
- Hồi quy WebGL Garden/Beach:8/8 đạt (`weather-regression.json`), gồm băng hoàn toàn bất biến theo thời gian/gió ở high/low tide, liquid control có chuyển động và puddle Beach tích lũy/rút dần.
- Giới hạn: chưa đo FPS trên GPU phần cứng/thiết bị thật.

Prompt kiểm lại: “Mở check-aurora-webgl.html và ?theme=aurora; so sánh clear/blizzard cùng camera, snow roof/branch/ground cận cảnh, biên băng side/top, ribbon1 draw call và không tạo ripple trên băng.”
