## Quy tắc bắt buộc: hình dáng tự nhiên cho mọi chủ đề

Mọi chủ đề diorama phải có đường bao cảnh quan được thiết kế riêng, bất đối xứng và phù hợp với nội dung. Quy tắc này áp dụng khi tạo chủ đề mới hoặc chỉnh sửa chủ đề hiện có.

### Hình dáng và bố cục

- Không mặc định dựng cảnh trên khối đất hoặc đế hình chữ nhật với bốn cạnh thẳng.
- Không chỉ bo bốn góc của hình chữ nhật để coi là đã đáp ứng.
- Không dùng cùng một hình tròn hoặc oval cho tất cả chủ đề.
- Thiết kế silhouette tổng thể trước khi thêm cây, công trình và chi tiết.
- Đường bao phải có các vùng lồi/lõm có chủ đích, chuyển tiếp mềm, không tạo nhiễu thành gai nhọn.
- Giữ bản sắc địa hình: thung lũng theo sườn núi và dòng suối; đảo theo đường bờ; các chủ đề khác theo cấu trúc cảnh tương ứng.
- Hình chữ nhật chỉ được dùng làm đường bao nhìn thấy khi người dùng yêu cầu rõ hoặc vật thể được mô phỏng thực sự có hình dạng đó.

### Dữ liệu và hình học

- Mỗi chủ đề khai báo footprint riêng, dùng chung cho dựng terrain, thành bên, đáy, placement, nước, tương tác và bounds.
- Phân biệt footprint ngoài của diorama với vùng đất, vùng nước và bounds tính toán.
- Heightfield hoặc render target nội bộ được phép là hình chữ nhật; hình chữ nhật đó không được lộ ra ngoài chủ đích trong cảnh hoàn thiện.
- Mặt trên, thành bên, đáy và mặt cắt nước phải nối đúng biên, không có lỗ hoặc skirt chữ nhật còn sót.
- Không dùng transparency, shader discard, sương hoặc vật thể trang trí làm cách duy nhất để che hình học sai.
- Đế và bóng tiếp xúc phải phù hợp với đường bao cảnh.

### Vật thể và camera

- Kiểm tra toàn bộ footprint vật thể, không chỉ tọa độ tâm.
- Công trình, cây và đồ vật phải nằm trong vùng hợp lệ, tiếp xúc đúng terrain.
- Nước, cá và thuyền phải tuân theo vùng nước và mực nước hiện tại.
- Camera mặc định phải hiển thị trọn silhouette, đế và các điểm chính, có khoảng trống cho UI.
- Cập nhật camera và xử lý dữ liệu camera cũ khi thay đổi đáng kể hình dáng cảnh.

### Điều kiện hoàn thành

Trước khi coi một chủ đề hoàn tất:

- Kiểm tra đường bao khép kín, không tự cắt và mesh nối kín.
- Kiểm tra placement, vùng nước và bounds.
- Nếu có WebGL, quan sát góc mặc định, từ trên xuống và các mặt bên để tìm cạnh thẳng, lỗ hoặc hình học thừa ngoài chủ đích.
- Báo riêng kết quả build, kiểm tra logic và xác minh hình ảnh; không dùng build thành công thay cho kiểm tra hình dáng.

Khi bắt đầu chủ đề mới, phải đọc và áp dụng quy tắc này ngay từ bước thiết kế địa hình. Không chờ đến giai đoạn hoàn thiện mới sửa đường bao.

## Quy trình commit và kiểm tra

- Sau khi hoàn thành thay đổi và các kiểm tra phù hợp đạt, tự động tạo local commit với thông điệp mô tả thay đổi.
- Chỉ commit các file thuộc tác vụ; không gộp thay đổi có sẵn của người dùng.
- Không push hoặc deploy nếu người dùng chưa yêu cầu rõ.
- Nếu kiểm tra thất bại, báo nguyên nhân; không tuyên bố hoàn tất.

