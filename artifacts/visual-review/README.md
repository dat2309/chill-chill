# Miniature landscape review — 2026-10-21

## Phạm vi tham chiếu

Đã mở và quan sát WebGL của https://chillaxdiorama.netlify.app/ bằng Chrome headless. Công cụ đọc web ban đầu không truy cập được trang. Không nhận được ảnh đính kèm riêng trong lượt này; so sánh dựa trên website render được và mô tả của người dùng.

Website có đế gần chữ nhật, núi hậu cảnh, ba dome trên thềm bên trái, cabin, hai tuyến thang và nước mở rộng về tiền cảnh. Cảnh sửa giữ cấu trúc này, chừa khoảng trống quanh công trình và dùng cây procedural. Không tuyên bố trùng khớp ảnh chưa nhận được.

## Thay đổi và phát hiện đã tái hiện

- Hai biên trưng bày cũ dùng bán kính với các thùy như đảo. Garden chuyển sang đế 20×16 bo góc; Phú Quốc dùng mặt cắt biển 20×16,8 bo góc khác. Đường suối và đường bờ biển được tính riêng, không lấy hình đế làm bờ đất–nước.
- Mặt cắt nước Garden trước đây dừng ở z=8 trong khi địa hình kéo dài qua đó. Biên trước của đế mới nằm đúng z=8; hàng đỉnh mặt nước và đỉnh mặt cắt dùng cùng tọa độ. Sóng tắt ở mép cắt; chân mặt cắt không vượt mặt nước lúc triều thấp.
- Nước Garden từng có alpha 0,72–0,95. Giảm còn 0,20–0,46 theo độ sâu, giảm phản xạ chói; Phú Quốc giữ nước sâu đậm hơn nước ven cát.
- Giãn ba dome khỏi cabin, mở rộng mép thềm, bố trí hai tuyến thang độc lập, gom thông theo cụm và kiểm tra biên theo bán kính tán cây lớn.
- Làm mềm chuyển tiếp chân núi Garden để tránh vách thẳng ngang ở ranh giới phân vùng.
- Cây phi lao Phú Quốc từng là nón quá cao; đổi sang tán thuôn thấp hơn, gom cụm, tăng ánh sáng bù hoàng hôn; giảm tán dừa che công trình và làm mềm chuyển tiếp cát–cỏ–đá để loại ranh giới răng cưa màu sắc. Các cụm hoa giấy trước đây được đặt cao ngẫu nhiên; nay tiếp xúc đất theo kích thước cụm.
- Camera góc trên từng bị cắt đế. Fit lại theo hướng quan sát và viewport; bỏ camera bố cục cũ ở cả hai đường lưu trữ, giữ mùa và thời gian.
- AGENTS.md đã có nội dung đúng yêu cầu trước khi bắt đầu. Giữ nguyên thay đổi có sẵn đó và không stage vào commit tác vụ.

## Build và logic

- `npm run build`: đạt; Vite vẫn cảnh báo chunk Three.js lớn hơn 500 kB.
- `npm test`: đạt 20 kiểm tra suối, 46 kiểm tra Phú Quốc/trạng thái, 108 kiểm tra vòng đời, cùng `check-geometry`.
- Mỗi terrain: 71.424 tam giác mặt trên hướng lên, 7.680 tam giác thành/mép đế hướng ra ngoài, 256 tam giác đáy hướng xuống; không có tam giác suy biến trong mesh terrain chính.
- Hai biên đế kín, lồi và không tự cắt; kiểm tra seam và winding nước Garden. Bộ kiểm tra Phú Quốc hiện có kiểm tra đỉnh chung giữa nước và mặt cắt.
- `git diff --check`: đạt.

## Xác minh hình ảnh

Ảnh Chrome WebGL/SwiftShader, desktop 1440×1100 và mobile 390×844; các ảnh đầu bị chụp khi tải hoặc viewport sai đã được bỏ và chụp lại. Đây là kiểm tra hình ảnh, không phải benchmark hiệu năng GPU.

| Chủ đề | Mặc định | Trên xuống | Mặt bên |
| --- | --- | --- | --- |
| Garden | [Ảnh](garden-default.png) | [Ảnh](garden-top.png) | [Ảnh](garden-side.png) |
| Phú Quốc | [Ảnh](phuquoc-default.png) | [Ảnh](phuquoc-top.png) | [Ảnh](phuquoc-side.png) |

[Garden mobile](garden-mobile.png) và [Phú Quốc mobile](phuquoc-mobile.png): toàn bộ đế nằm trong khung hình, có khoảng trống trên/dưới cho UI. UI header có chữ nhỏ chen nhau ở chiều rộng này; không sửa UI trong tác vụ hình học.

Nhận xét và giới hạn: Garden có khoảng trống rõ quanh ba dome/cabin, hai thang và đáy sỏi nhìn được. Phú Quốc giữ bờ cát cong, dừa và biển chuyển sâu. Mặt bên thể hiện thành đế và chênh cao; góc trên dùng để kiểm tra bố cục và biên nước. Chưa xác minh mọi tổ hợp mùa, giờ, mức triều hoặc mọi thiết bị GPU; ảnh tĩnh không xác minh được chuyển động đàn cá. Tỷ lệ, phong cách cây và bảng màu vẫn là diễn giải procedural của website, không phải bản sao ảnh mẫu.

Prompt review có thể sao chép:

> Mở Garden và Phú Quốc ở góc mặc định, trên xuống và mặt bên; đối chiếu artifacts/visual-review. Kiểm tra ba dome/cabin không giao nhau, hai thang tiếp đất, tán cây chừa đường nhìn, mặt cắt nước khép với đế và đáy, không mất mặt hoặc có khe khi đổi triều. Đối chiếu bố cục với website Chillax và ảnh gốc nếu được cung cấp; tách lỗi tái hiện khỏi nhận xét thẩm mỹ. Không thêm tính năng, chạy build/test và tạo local commit riêng; không push/deploy.
