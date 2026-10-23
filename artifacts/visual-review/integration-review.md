# Review tích hợp các theme — 2026-10-23

Commit tích hợp và ảnh cuối: `df9fb82`.

Thứ tự triển khai: Hội An (đã có) → Chợ nổi → Sapa → Cyberpunk → Cabin cực quang. Không push/deploy. Tất cả asset là procedural geometry/shader, không thêm model/texture ngoài.

| Theme | Commit thêm theme | Test riêng cuối | Tam giác render | Draw calls |
|---|---|---:|---:|---:|
| Chợ nổi | `417217e` | 18 | 77,742 | 238 |
| Sapa | `8829c1a` | 30 | 43,532 | 102 |
| Cyberpunk | `081617d` | 18 | 52,692 | 237 |
| Cabin cực quang | `ee31fd8` | 23 | 149,618 | 77 |

Build: `npm run build` thật đạt. Cảnh báo chunk Three.js lớn hơn500kB có sẵn; các theme vẫn được lazy-load riêng.

Logic: toàn bộ `npm test` thật đạt,18 suite.89 kiểm tra riêng cho4 theme mới; lifecycle115/115. Storage version9, migration bảo toàn state/camera các phiên bản trước; theme loader hỗ trợ override từng phần và dispose qua coordinator hiện có.

Visual: Chrome WebGL/SwiftShader, landscape1200×900, portrait600×1000; ứng dụng desktop1440×1000/mobile390×844. Hai trạng thái, reversal, gió mạnh→thấp, top/side/close nằm trong từng thư mục. Cả4 harness không báo lỗi shader; mỗi theme giải phóng geometry về0, portrait chứa bounds. Aurora ribbon đo riêng1 draw call; ice/liquid-control đổi383,434 channel >12. Hồi quy Garden/Beach8/8 đạt.

Các lỗi cụ thể tìm và sửa trong review:

- Market: sương oval và vân nước quá đều; đã đổi fade shader và hạ tương phản. Ray xiên vào mái ghe bị trượt do chọn trên mặt phẳng nước: regression thất bại trước sửa, nay dùng các proxy hull/canopy/pole riêng và đối chứng raycast mesh. SceneManager chạy object click trước quyết định vùng nước; pointermove vẫn chỉ xử lý nước. Hai nhánh sông sau bờ, thể tích đất và cắt nước chia sẻ đúng vùng hở; bỏ phần cắt nước đồng phẳng với thành đất. Dừa nước có rachis/tàu lá nối thật và đặt ngoài footprint nhà. Quét60 giây và trọn chu kỳ không chồng hull.
- Sapa: mặt cắt bên quay vào trong và khe sau thửa cao nhất, đã sửa winding và vai đất. Vai sau còn chồng mặt trên box nền: regression raycast hai surface thất bại trước sửa; thay box bằng mặt cắt đứng đúng mép đế, giữ mặt trên duy nhất. Khép đầu hồi, chừa lúa quanh trâu.
- Cyber: vật thể quá tối, đã chỉnh ánh sáng môi trường và thêm cửa sổ mặt đầu. Hơi nước thoát ra mép mái; mưa thực sự dừng ở mái. Neon là emissive/halo procedural trong lượt render chính, không dùng full-screen postprocessing; halo tắt ở quality low hoặc FPS hai giây đầu<28. Phản chiếu là shader gần đúng, không render scene lần hai.
- Aurora: mask tuyết bỏ nguyên tam giác tạo mép răng cưa quanh hồ, đã thay lớp bám terrain liên tục và giao bằng depth. Lá kim dày hơn tại đúng gốc nhánh, giữ khoảng trống; cực quang liền và sao seeded. Tuyết mái đo world gap0.0049; tuyết đất ngoài hồ250.70 đơn vị diện tích; 77.73% đỉnh lá hướng lên có snow exposure cao. Giữ nguyên băng kín Garden bằng cùng quy tắc freezing được trích ra module chung.

Phạm vi chưa xác minh: FPS trên GPU phần cứng và thiết bị mobile thật. SwiftShader chỉ chứng minh shader/render chạy và cho phép review ảnh, không đại diện tốc độ thiết bị.

Prompt tái kiểm: “Chạy npm test và npm run build, mở lần lượt check-market/sapa/cyber/aurora-webgl.html cùng ứng dụng thật; chọn hai trạng thái tường minh, đối chiếu default/top/side/close/portrait. Kiểm hull/canopy click, bờ–cắt nước, vai sau Sapa, wetness/halo Cyber và snow/ice/Aurora1 draw call; xem metrics và dispose. Giữ nguyên object Garden/Beach đã đạt.”
