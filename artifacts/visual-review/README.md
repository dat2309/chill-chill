# Miniature landscape visual review — 2026-10-23

## Phạm vi tham chiếu

Đã quan sát đối chiếu trực quan WebGL render từ diorama tham chiếu (https://chillaxdiorama.netlify.app/) và bộ quy chuẩn trong AGENTS.md.
Các sửa đổi tập trung vào chiều sâu diorama 3 lớp, hồ nước mở rộng ở tiền cảnh, đáy sỏi đa sắc, thảm thực vật phân tầng tự nhiên, lối đi lót đá ven bờ, ánh sáng hoàng hôn bãi biển, và giao diện tương thích mobile.

## Cải thiện thị giác và bố cục cảnh

1. **Chillax Garden: Mở rộng suối thành hồ nông tiền cảnh & lối đi lót đá tự nhiên**
   - Lòng suối mở rộng dần từ hẻm núi hậu cảnh (`halfW` hẹp ở z < 0) thành hồ nông rộng thoáng ở tiền cảnh (bán rộng tới 4.8m tại mép cắt z = 8). Bỏ hẳn cảm giác mương/rãnh hẹp nhân tạo.
   - Bờ phải nâng cao với các đồi thoai thoải ôm trọn vùng nước; thềm glamping bên trái giữ độ cao tách biệt với lối đi lót đá uốn lượn tự nhiên men theo địa hình nối xuống mép nước (không còn bậc thang cứng và bia bắn cung).
   - Đáy hồ phủ lớp sỏi và đá sông procedurally đa sắc nhìn rõ qua lớp nước trong suốt.
   - Tuyết mùa đông Garden phủ rõ rệt trên các đỉnh cao (>80% diện tích) và sườn dốc cao (>60% diện tích) với đường viền tuyết chuyển tiếp mềm mại.
   - Tối ưu ngân sách tam giác Garden về mức 366.872 tam giác (dưới ngưỡng 400.000).

2. **Sunset Beach: Bãi cát cong nhiệt đới & Mặt cắt biển trưng bày**
   - Bản sắc bờ biển nhiệt đới: bờ cát hình lưỡi liềm uốn cong tự nhiên, mũi đá hoa cương, cụm dừa phân tầng và biển nông ngọc bích chuyển xanh ngọc lục bảo sâu.
   - Mặt cắt biển (water skirt) phía trước được tối sẫm có chiều sâu gradient mà không đen kịt (luminance ~0.04 daytime); ban đêm độ sáng mặt biển hạ xuống thấp hơn nền đất liền (~0.02 vs ~0.16) tạo cảm giác biển đêm tĩnh lặng, chân thực.
   - Thuyền thúng và ghe nhỏ nổi ăn khớp chuẩn xác với waterline, khoang thuyền rỗng và có cavity discard ngăn nước biển tràn vào bên trong.
   - Bỏ toàn bộ các cụm hoa giấy tròn/bụi rậm giống nấm, chỉ giữ lại thảm dừa, phi lao và ghềnh đá granite tự nhiên.

3. **Góc nhìn camera mặc định**
   - Camera Garden: `[16.0, 15.2, 27.5]` hướng về `[-0.35, 0.65, 0.15]`, phân định rõ 3 lớp tiền cảnh (hồ sỏi, ván SUP), trung cảnh (glamping dome, cabin, đống lửa, đường đá), hậu cảnh (núi tuyết và rặng thông).
   - Camera Sunset Beach: `[25.0, 21.0, 27.0]` hướng về `[-0.5, 0.45, 0.4]`, bắt trọn góc hoàng hôn phía Tây rực rỡ với cầu tàu gỗ và bãi biển.
   - Phiên bản lưu trữ `CURRENT_STORAGE_VERSION = 4` bảo đảm góc nhìn mới có hiệu lực ngay, hỗ trợ migration tương thích ngược từ dữ liệu lưu cũ.

4. **Tối ưu hóa giao diện người dùng (UI & Mobile Responsive)**
   - Khống chế kích thước biểu tượng SVG đổi theme ở 18–20px cố định, chống méo/dãn icon.
   - Nút chuyển theme thu gọn thành badge trang nhã, không chiếm diện tích tiêu đề.
   - Trên màn hình mobile (390px): ẩn phụ đề dài tránh va chạm với thanh trượt giờ; thanh điều khiển phía dưới được tối ưu padding/flex để hiển thị đầy đủ 100% chức năng mà không bị cắt hoặc tràn màn hình.
   - Tối ưu frustum padding camera mobile để diorama hiển thị lớn và rõ nét, giảm khoảng viền trắng dư thừa.

## Kết quả kiểm tra kỹ thuật

- `npm run build`: Đạt 100%, 0 lỗi TypeScript hay Rollup bundle.
- `npm test`: Đạt toàn bộ 13 test suites:
  - `check-stream`: 67/67 passed (profile suối, hồ nông tiền cảnh, đóng băng mùa đông Garden).
  - `check-beach`: 145/145 passed (sóng biển, thuyền thúng/ghe nhỏ, thủy triều, sky gradient hoàng hôn, winding và clearance bungalow).
  - `check-beach-4states`: 4/4 passed (kiểm tra 4 trạng thái nắng/mưa x ngày/đêm của Sunset Beach).
  - `check-lifecycle`: 111/111 passed (chuyển đổi theme, giải phóng tài nguyên WebGL, khôi phục tương thích dữ liệu cũ).
  - `check-geometry`: Winding mặt trên, mặt đáy và thành bên nhất quán; seam khép kín đạt chuẩn.
  - `check-vegetation`: Liên kết thời tiết, displacement bounds và uniform gió/mưa.
  - `check-surface-weather`: Vật liệu ướt bề mặt và tích lũy vũng nước.
  - `check-object-quality`: Chất lượng hình học công trình, tiếp xúc nền móng và tỷ lệ.
  - `check-landscape-shape`: Bố cục hình học và đường bao phi đối xứng diorama.
  - `check-terrain-transitions`: Độ chuyển tiếp mượt mà của sườn địa hình và pha vật liệu.
  - `check-terrain-snow`: Độ phủ tuyết mùa đông (đỉnh núi 84.3% >= 80%, sườn cao 60.6% >= 40%, contour smooth 0.152 < 0.20).
  - `check-garden-meadow-color`: Chuyển sắc màu đồng cỏ 4 mùa liên tục.
  - `check-triangle-budget`: Tổng số tam giác Garden 366.872 <= 400.000 budget.
- `git diff --check`: Đạt, không có lỗi whitespace hay conflict.

## Xác minh hình ảnh trực quan (Commit `d7faa8e`)

Tất cả các ảnh visual review được lưu tại thư mục `artifacts/visual-review/`:

| Chủ đề | Mặc định (Default) | Trên xuống (Top) | Mặt bên (Side) | Mobile (390×844) |
| --- | --- | --- | --- | --- |
| **Chillax Garden** | [garden-default.png](garden-default.png) | [garden-top.png](garden-top.png) | [garden-side.png](garden-side.png) | [garden-mobile.png](garden-mobile.png) |
| **Sunset Beach** | [beach-default.png](beach-default.png) | [beach-top.png](beach-top.png) | [beach-side.png](beach-side.png) | [beach-mobile.png](beach-mobile.png) |

Bộ ảnh kiểm chứng 4 trạng thái Sunset Beach:
- [beach-sunny-day.png](beach-sunny-day.png): Ban ngày trời nắng, mặt nước ngọc bích, skirt sẫm màu có độ sâu tự nhiên.
- [beach-rainy-day.png](beach-rainy-day.png): Ban ngày mùa mưa, mặt nước gợn sóng tăng, phản xạ ánh sáng dịu.
- [beach-sunny-night.png](beach-sunny-night.png): Ban đêm trời quang, mặt nước tối hơn nền đất liền, đèn lồng bungalow phản chiếu ấm áp.
- [beach-rainy-night.png](beach-rainy-night.png): Ban đêm mùa mưa, không bị leak ánh sáng ban ngày, biển tối tĩnh lặng.

Bộ ảnh so sánh tuyết mùa đông Garden:
- [garden-winter-snow-before.png](garden-winter-snow-before.png): Trước khi tăng độ phủ tuyết trên đỉnh và sườn dốc cao.
- [garden-winter-snow-after.png](garden-winter-snow-after.png): Sau khi cải tiến shader/snow curve, tuyết nổi bật tự nhiên trên các đỉnh núi cao.

Prompt review có thể sao chép:

> Mở hai chủ đề Chillax Garden và Sunset Beach ở các góc nhìn mặc định, trên xuống, mặt bên và mobile (390px); đối chiếu với artifacts/visual-review.
> Kiểm tra: hồ nước mở rộng ở tiền cảnh Garden cùng sỏi đáy đa sắc; lối đi lót đá tự nhiên men theo bờ suối; tuyết mùa đông phủ trắng đỉnh và sườn cao; bờ cát Sunset Beach cong tự nhiên; mặt cắt nước sẫm màu có chiều sâu; biển ban đêm tối hơn đất liền; không còn khối bụi tròn giống nấm.
> Chạy `npm test` và `npm run build`. Tạo local commit riêng, không push/deploy.


## Bổ sung Hội An đêm — 2026-10-23

Code commit `c01f7fc`: thêm theme `lantern`, storage v5 (giữ state và camera v4), hai trạng thái đêm thường/đêm rằm và mưa nhẹ độc lập. [Bộ ảnh, số đo, phạm vi kiểm chứng và giới hạn](lantern/README.md) được ghi riêng để giữ nguyên lịch sử review Garden/Beach phía trên.

## Chợ nổi — 2026-10-23

Xem [Market review](market/README.md): 15 suite đạt, 13 kiểm tra Market; ảnh WebGL và ứng dụng desktop/mobile, số đo và giới hạn trong thư mục.

## Sapa — 2026-10-23

Xem [Sapa review](sapa/README.md): 16 suite, 29 kiểm tra Sapa; ảnh hai mùa, side/top/close, reversal, gió và giao diện mobile.

## Hẻm Cyberpunk — 2026-10-23

Xem [Cyber review](cyber/README.md): 17 suite, 18 kiểm tra riêng; ảnh mưa/sau mưa và số đo halo/độ ẩm/WebGL.
