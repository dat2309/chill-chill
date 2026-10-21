# Miniature landscape visual review — 2026-10-21

## Phạm vi tham chiếu

Đã quan sát đối chiếu trực quan WebGL render từ diorama tham chiếu (https://chillaxdiorama.netlify.app/) và bộ quy chuẩn trong AGENTS.md.
Các sửa đổi tập trung vào chiều sâu diorama 3 lớp, hồ nước mở rộng ở tiền cảnh, đáy sỏi đa sắc, tán cây phân tầng tự nhiên, ánh sáng hoàng hôn và giao diện tương thích mobile.

## Cải thiện thị giác và bố cục cảnh

1. **Chillax Garden: Mở rộng suối thành hồ nông tiền cảnh**
   - Lòng suối mở rộng dần từ hẻm núi hậu cảnh (`halfW` hẹp ở z < 0) thành hồ nông rộng thoáng ở tiền cảnh (bán rộng tới 4.8m tại mép cắt z = 8). Bỏ hẳn cảm giác mương/rãnh hẹp nhân tạo.
   - Bờ phải nâng cao với các đồi thoai thoải ôm trọn vùng nước; thềm glamping bên trái giữ độ cao tách biệt với hai tuyến cầu thang đá nối xuống mép nước.
   - Đáy hồ phủ lớp sỏi và đá sông procedurally đa sắc (tăng từ 220 lên 480 viên sỏi đa tỷ lệ, 9 mã màu đá tự nhiên) nhìn rõ qua lớp nước trong suốt.

2. **Góc nhìn camera mặc định**
   - Camera Garden hạ thấp và xoay gần chính diện hơn (`[16.0, 15.2, 27.5]` hướng về `[-0.35, 0.65, 0.15]`), phân định rõ rệt 3 lớp cảnh quan:
     - **Tiền cảnh:** Hồ nước nông với sỏi đáy, ván chèo SUP beached bên bờ.
     - **Trung cảnh:** Thềm glamping với 3 geodesic dome, đống lửa trại, bàn picnic và cabin chữ A có cửa sổ ấm áp.
     - **Hậu cảnh:** Dãy núi thông mọc theo cụm rặng tự nhiên.
   - Nâng cấp phiên bản lưu trữ `CURRENT_STORAGE_VERSION = 4` để camera mặc định mới có hiệu lực ngay cho người dùng mà không bị ghi đè bởi góc nhìn cũ trong cache.

3. **Cải tạo tán cây và thảm thực vật**
   - **Cây thông Garden:** Gom thành 4 cụm rặng núi cao với góc nghiêng, kích thước và sắc độ lá xanh kim biến thiên tự nhiên; loại bỏ hoàn toàn cảm giác thông xếp hàng đều.
   - **Cây lá rộng Garden:** Nâng cấp từ quả cầu khối đa giác đơn giản lên 11 chùm tán (puffs) đan xen có trật tự tầng lớp, lighting mềm (`flatShading: false`) và chuyển sắc độ từ chân tán lên ngọn đón nắng.
   - **Dừa Phú Quốc:** Cấu trúc tán 16 tàu lá chia 3 tầng rõ rệt (tầng ngọn vươn cao, tầng giữa xòe ngang, tầng dưới rủ cong với độ uốn cong tự nhiên ở chóp lá và thon nhọn ở phiến).
   - **Hoa giấy Phú Quốc:** Đổi từ hồng huỳnh quang gắt (`0xe91e63`) sang sắc hồng tự nhiên của hoa biển (`0xc94966`), ép dẹt cụm hoa ôm sát mặt đất và chân đá.
   - **Ánh sáng hoàng hôn Phú Quốc:** Tăng ánh sáng phản xạ biển ấm (`hemiLight.groundColor = 0x2b756c`, `ambientLight = 0.72`) giúp thấy rõ thềm cát vàng ngập nước, rạn đá nông và thuyền thúng mà không làm cháy sáng toàn cảnh.

4. **Tối ưu hóa giao diện người dùng (UI & Mobile Responsive)**
   - Khống chế kích thước biểu tượng SVG đổi theme ở 18–20px cố định, chống méo/dãn icon.
   - Nút chuyển theme thu gọn thành badge trang nhã, không chiếm diện tích tiêu đề.
   - Trên màn hình mobile (390px): ẩn phụ đề dài tránh va chạm với thanh trượt giờ; thanh điều khiển phía dưới được tối ưu padding/flex để hiển thị đầy đủ 100% chức năng mà không bị cắt hoặc tràn màn hình.
   - Tối ưu frustum padding camera mobile để diorama hiển thị lớn và rõ nét, giảm khoảng viền trắng dư thừa.

## Kết quả kiểm tra kỹ thuật

- `npm run build`: Đạt 100%, 0 lỗi TypeScript hay Rollup.
- `npm test`: Đạt toàn bộ kiểm tra:
  - `check-stream`: 20/20 passed.
  - `check-phuquoc`: 50/50 passed (bổ sung test độ sáng đêm mưa không lệch quá ngưỡng nhỏ và đêm luôn tối hơn ngày; test độ mượt đổi màu bầu trời tối đa <= 16/255 mỗi 0.05h; test 0 tán lá dừa nào giao footprint mái bungalow).
  - `check-lifecycle`: 108/108 passed.
  - `check-geometry`: 71.424 tam giác mặt trên, 7.680 tam giác thành bên, 256 tam giác đáy; winding và seam đạt chuẩn.
- `git diff --check`: Đạt, không có lỗi whitespace hay conflict.

## Xác minh hình ảnh trực quan (Commit `17e601c`)

Tất cả 8 ảnh visual review được chụp trực tiếp từ bản build thực tế (`npm run preview`) bằng Chrome WebGL headless (Angle/SwiftShader, cờ `--ignore-gpu-blocklist --enable-webgl --use-gl=angle`) tại 1440×1100 (desktop) và 390×844 (mobile):

| Chủ đề | Mặc định (Default) | Trên xuống (Top) | Mặt bên (Side) | Mobile (390×844) |
| --- | --- | --- | --- | --- |
| **Chillax Garden** | [garden-default.png](garden-default.png) | [garden-top.png](garden-top.png) | [garden-side.png](garden-side.png) | [garden-mobile.png](garden-mobile.png) |
| **Phú Quốc Sunset Bay** | [phuquoc-default.png](phuquoc-default.png) | [phuquoc-top.png](phuquoc-top.png) | [phuquoc-side.png](phuquoc-side.png) | [phuquoc-mobile.png](phuquoc-mobile.png) |

Chi tiết kiểm chứng trực quan trên từng ảnh:
- **garden-default.png**: Hồ nước mở rộng ở tiền cảnh với đáy sỏi procedurally đa sắc nhìn rõ qua nước; thềm glamping bên trái tách biệt với cụm 3 dome, cabin A-frame, đống lửa và bàn picnic; dãy núi thông hậu cảnh phân tầng tự nhiên.
- **garden-top.png**: Bố cục diorama rõ ràng, đường bao hồ nước tự nhiên, hai tuyến cầu thang đá nối từ thềm glamping xuống bờ hồ không bị che khuất.
- **garden-side.png**: Thấy rõ mặt cắt địa chất với các lớp đất đá và đáy phẳng bo góc (bevel), không có khe hở hay tam giác vỡ.
- **garden-mobile.png**: Viewport 390×844 hiển thị trọn vẹn diorama với padding tối ưu; thanh trượt giờ và bottom bar hiển thị vừa vặn, không đè lấn nhau.
- **phuquoc-default.png**: Bầu trời gradient hoàng hôn chuyển từ tím xanh ở đỉnh sang hồng tím ở giữa và hồng cam ở chân trời; mặt nước phản chiếu sắc hoàng hôn; bungalow và cụm dừa hài hòa, không tán nào đè lên mái.
- **phuquoc-top.png**: Xác nhận 0 tán dừa nào xâm phạm footprint mái tranh bungalow; bãi cát cong, mũi đá và thuyền thúng bố trí tự nhiên.
- **phuquoc-side.png**: Mặt nước và thành nước khớp nối liền mạch, không răng cưa hay khe hở.
- **phuquoc-mobile.png**: Giao diện mobile 390×844 gọn gàng, nút Full và các công cụ điều khiển mùa/giờ hoạt động hoàn hảo.

Prompt review có thể sao chép:

> Mở hai chủ đề Garden và Phú Quốc ở các góc nhìn mặc định, trên xuống, mặt bên và mobile (390px); đối chiếu với artifacts/visual-review.
> Kiểm tra: hồ nước mở rộng ở tiền cảnh Garden cùng sỏi đáy đa sắc; 3 lớp tiền-trung-hậu cảnh; tán cây mềm mại; dừa Phú Quốc 3 tầng rủ tự nhiên; hoa giấy sắc hồng biển dịu; cát vàng và đá ngập nước nhìn rõ; toolbar mobile 390px vừa vặn không tràn.
> Chạy `npm test` và `npm run build`. Tạo local commit riêng, không push/deploy.
