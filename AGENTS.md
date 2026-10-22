# Hướng dẫn cho agent

Áp dụng cho toàn bộ repository và mọi chủ đề hiện có hoặc được thêm sau này. Đọc file này trước khi thiết kế hoặc sửa cảnh.

## Ưu tiên yêu cầu và ảnh tham chiếu

- Yêu cầu mới nhất của người dùng và ảnh tham chiếu do người dùng cung cấp quyết định hướng thiết kế.
- Phân tích bố cục, tỷ lệ, cao độ, đường bờ, vật liệu và camera của ảnh trước khi chỉnh hình học. Không suy diễn rằng mọi cảnh phải là một hòn đảo.
- Mẫu Chillax Garden do người dùng cung cấp là miniature landscape diorama: đế gần chữ nhật bo góc, núi ở hậu cảnh, glamping ở trung cảnh và suối mở rộng ra tiền cảnh.
- Website tham chiếu: https://chillaxdiorama.netlify.app/. Nếu không truy cập hoặc render được, dùng ảnh đã có và nói rõ phạm vi đã xác minh; không tự nhận đã quan sát website.

## Hình dáng và bố cục của mọi chủ đề

- Phân biệt ba thành phần: đế trưng bày, đường bao địa hình và đường bờ đất–nước. Chúng có thể có hình dạng khác nhau.
- Đế trưng bày được phép gần chữ nhật bo góc khi phù hợp bố cục, ảnh tham chiếu hoặc yêu cầu người dùng. Không áp đặt đế tròn, oval hay bất đối xứng cho mọi cảnh.
- Đường bờ, sườn núi, thềm đất và dòng suối phải có cấu trúc tự nhiên, phù hợp nội dung; bo góc đế không thay thế việc thiết kế địa hình.
- Mỗi chủ đề có bố cục riêng. Không dùng chung một công thức bán kính hoặc một silhouette cho tất cả chủ đề.
- Thiết kế các khối lớn và khoảng trống trước khi thêm chi tiết. Chuyển tiếp đường bao mềm, lồi/lõm có chủ đích; không tạo gai bằng nhiễu tần số cao.
- Garden: giữ chiều sâu núi → thềm glamping → sườn dốc tự nhiên → bờ suối và hồ nông tiền cảnh. Dùng lối đi lót đá men theo địa hình, không có bia bắn cung và hai tuyến cầu thang ngoài trời; cây không che kín dome, cabin hoặc dòng suối.
- Sunset Beach (beach): giữ bản sắc bãi cát cong, mũi đá, cụm dừa và biển nông chuyển sâu. Phân biệt bờ đảo với biên trưng bày của vùng biển; không ép cả vùng biển thành chiếc đĩa tròn.
- Chủ đề mới phải xác định điểm nhấn, tiền cảnh, trung cảnh, hậu cảnh và hình dáng đế phù hợp trước khi dựng chi tiết.
- Cây mọc thành cụm có tầng cao thấp; chừa đường nhìn và khoảng trống quanh điểm nhấn. Đế có tỷ lệ gọn và bóng tiếp xúc phù hợp.

## Dữ liệu và hình học

- Khai báo riêng biên đế/cảnh, vùng đất, vùng nước và bounds tính toán theo nhu cầu từng chủ đề. Các hệ thống dùng chung dữ liệu biên liên quan; không ép mọi hệ thống dùng một footprint duy nhất.
- Heightfield hoặc render target nội bộ được phép là hình chữ nhật. Miền lấy mẫu phải bao phủ mesh; không clamp phần địa hình mở rộng vào cạnh miền cũ gây kéo phẳng.
- Mặt trên, thành bên, đáy và mặt cắt nước phải nối đúng các biên tương ứng, không có lỗ, phần thừa hoặc skirt ngoài thiết kế.
- Khi mặt nước có mặt cắt trưng bày, mặt nước và skirt phải chia sẻ biên chính xác. Không giữ/bỏ nguyên ô lưới theo tâm làm cách duy nhất để cắt đường bao cong.
- Kiểm tra winding: mặt trên hướng lên, đáy hướng xuống, thành bên hướng ra ngoài. Normals phải nhất quán với hướng tam giác.
- Không dùng DoubleSide, transparency, shader discard, sương hoặc vật trang trí làm cách duy nhất để che hình học sai. Vật liệu hai mặt vẫn được phép khi bản chất vật thể cần nó.
- Tessellation phải giữ được vách núi, lòng suối và đường bờ; không thay lưới đủ chi tiết bằng lưới xuyên tâm thưa gây tam giác dài hoặc mất địa hình.
- Nước phải có độ trong và chuyển sắc theo độ sâu phù hợp chủ đề; với mẫu Garden, giữ khả năng thấy sỏi đáy và cá.
- Toàn bộ cảnh tiếp tục được tạo bằng procedural code, không thêm model, texture bên ngoài hoặc nhân vật người nếu chưa được yêu cầu.

## Vật thể và camera

- Kiểm tra toàn bộ footprint vật thể, không chỉ tọa độ tâm.
- Công trình, cây và đồ vật phải nằm trong vùng hợp lệ, đúng tỷ lệ và tiếp xúc terrain sau mọi thay đổi địa hình.
- Nước, cá và thuyền phải tuân theo vùng nước và mực nước hiện tại.
- Camera mặc định phải hiển thị trọn cảnh, đế và các điểm chính, có khoảng trống cho UI ở cả desktop và mobile.
- Cập nhật camera và xử lý dữ liệu camera đã lưu khi thay đổi đáng kể hình dáng hoặc bố cục cảnh.

## Tính nhất quán của thời tiết và mùa

- Mọi hệ thống trong cảnh (nước, thảm thực vật, tàu thuyền, sinh vật, ánh sáng, hạt mưa/tuyết) phải dùng chung trạng thái thời tiết và mùa hiệu dụng; không để các hệ thống chạy các giá trị gió, mưa hoặc mùa rời rạc.
- Shader và logic đối tượng (thuyền thúng, ghe nhỏ, cá, cây cối...) phải đồng bộ công thức sóng, chuyển động và phản ứng môi trường. Độ cao sóng và độ dốc sóng trên CPU và GPU phải đồng nhất tuyệt đối để vật thể nổi ăn khớp hoàn hảo với waterline, không bị chìm, bay lơ lửng hay hở nước vào khoang.
- Garden ở trạng thái đông hoàn chỉnh phải đóng băng toàn bộ vùng nước: hồ, mép bờ, lòng suối, thượng nguồn và suối dốc/thác; không giữ dải nước lỏng ở giữa. Độ sâu và dòng chảy chỉ quyết định thứ tự đóng băng trong giai đoạn chuyển tiếp. Băng giữ cao độ địa phương theo terrain, có vật liệu/vết nứt/tuyết procedural; khi kín phải dừng hoàn toàn sóng, ripple, bọt và normal nước lỏng. Click băng không tạo ripple hoặc kích hoạt cá; cá phải nằm dưới băng và giảm hoạt động. Đóng/tan băng liên tục qua dt, kể cả khi đảo mùa, CPU và shader phải khớp tide ngay từ khởi tạo.
- Mưa phải tác động tới vật liệu đất/cát/đá và bề mặt ngoài trời: độ ẩm, độ nhám, phản xạ, khả năng giữ/thoát nước và vũng tích lũy theo vật liệu cùng địa hình thật. Không đọng trên dốc lớn, cỏ, trong nhà/sàn có mái, ngoài miền terrain hoặc chồng lên biển; chặn hạt mưa ở mái và mặt đất. Vũng nông có biên tự nhiên, viền ẩm và gợn theo cường độ/thời gian mưa. Khi tạnh, gợn dừng, vũng rút và nền khô chậm hơn. Lượng nước/độ ẩm là trạng thái tích lũy liên tục qua dt, không reset hoặc bật/tắt theo tên mùa khi đổi/đảo thời tiết.
- Mưa biển tác động đồng thời và hài hòa lên độ cao sóng swell, bọt sóng vỡ tự nhiên (không dùng dải contour song song cứng), độ đục (turbidity), độ nhám tán xạ bề mặt và độ chao đảo của phương tiện nổi. Gió hiệu dụng tăng vừa phải theo mưa, không biến cảnh thành bão quá mức.
- Giữ vững bản sắc và khí hậu từng chủ đề: Chillax Garden là thung lũng suối ôn đới có chu kỳ 4 mùa với băng tuyết mùa đông; Sunset Beach (beach) là biển đảo nhiệt đới chỉ có mùa khô và mùa mưa, không áp đặt tuyết hoặc đóng băng vào vùng biển nhiệt đới.
- Thao tác tương tác của người dùng (slider điều khiển, click tạo sóng) phải tương thích với trạng thái vật lý thực tế: trên mặt băng đóng kín không tạo sóng nước lỏng; ở vùng nước hở vẫn tương tác bình thường; slider gió kết hợp mượt mà với preset thời tiết theo biên độ rõ ràng.
- Đảo chiều chuyển mùa giữa chừng (reversal giữa dry và rainy) phải tiếp tục mượt mà từ giá trị hiện tại theo thời gian thực qua dt, không khởi động lại từ đầu hoặc gây bước nhảy màu/ánh sáng đột ngột; toàn bộ cảnh (mưa, vật liệu, bầu trời, ánh sáng, nước) dùng chung một hệ số tiến độ liên tục.
- Vùng băng hiển thị trên shader và vùng chặn tương tác trên CPU phải đồng nhất tuyệt đối: dùng cùng mực nước địa phương theo tọa độ z và tide hiện tại, cùng địa hình và quy tắc đánh giá băng; phân biệt rõ băng chuyển tiếp và băng đủ kín để chặn tương tác; không dùng mực nước hồ tiền cảnh cho thượng nguồn hay suối dốc.

- Vegetation của mọi chủ đề phải dùng cùng trạng thái thời tiết hiệu dụng và tiến độ mùa liên tục với nước, mưa và ánh sáng. Phản ứng theo loài: thân, cành, tán, tàu lá, cỏ, hoa và dương xỉ có độ mềm riêng; gốc cố định trên terrain, uốn phân tầng theo một trường gió có pha và độ trễ riêng, không xoay/dịch nguyên cụm quanh tâm.
- Vật liệu ướt, độ ẩm lưu lại, đổi màu, rụng/phục hồi lá và tuyết bám mặt trên phải chuyển tiếp qua dt, kể cả khi đảo chiều mùa. Cây thường xanh giữ bản sắc; tuyết làm chuyển động nặng hơn. Shader displacement phải có bounds và bóng đổ phù hợp, tránh rebuild geometry/cập nhật màu toàn bộ mỗi frame khi không đổi.
- Khi có WebGL, kiểm chứng vegetation bằng hình ảnh cùng camera ở gió yếu/mạnh và các mùa của từng chủ đề; xác minh shader/uniform thực sự tác động từng nhóm, gốc đứng yên, biên độ giới hạn, reversal liên tục và không NaN. Nếu không chạy được WebGL, báo rõ chưa xác minh chuyển động/hình ảnh.

## Kiểm tra và review

- Chạy build và các kiểm tra logic phù hợp với thay đổi. Với thay đổi chỉ ở tài liệu, đọc lại nội dung và chạy git diff --check; không bắt buộc chạy build ứng dụng.
- Khi sửa hình học, kiểm tra winding, đường bao khép kín không tự cắt, các mối nối mesh, placement, vùng nước và bounds.
- Khi có WebGL, quan sát từng chủ đề bị ảnh hưởng ở góc mặc định, từ trên xuống và các mặt bên; kiểm tra mất mặt, vật thể lơ lửng, khe nước, mép răng cưa và tam giác kéo dài. So sánh render với ảnh tham chiếu nếu có.
- Báo riêng kết quả build, kiểm tra logic và xác minh hình ảnh. Nếu không render được WebGL, ghi rõ chưa xác minh hình ảnh; không dùng build/test đạt để kết luận cảnh đẹp hoặc giống mẫu.
- Mỗi lần review phải nêu phát hiện cụ thể, phạm vi đã kiểm tra và kèm prompt xử lý có thể sao chép. Phân biệt lỗi đã tái hiện với nhận xét hoặc rủi ro chưa xác minh.

## Quy trình commit

- Sau khi hoàn thành thay đổi và các kiểm tra phù hợp đạt, tự động tạo local commit với thông điệp mô tả thay đổi.
- Chỉ stage và commit các file thuộc tác vụ; không gộp thay đổi có sẵn của người dùng.
- Không push hoặc deploy nếu người dùng chưa yêu cầu rõ.
- Nếu kiểm tra thất bại, báo nguyên nhân; không tuyên bố hoàn tất.
