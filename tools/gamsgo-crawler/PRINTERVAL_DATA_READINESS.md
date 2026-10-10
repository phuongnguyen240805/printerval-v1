# Kiểm tra dữ liệu Printerval

`coverage-report.json` chỉ báo `complete: true` khi crawl đầy đủ và
`printerval-ui-report.json` báo `ready: true`. Báo cáo UI liệt kê URL và các
trường thiếu: logo/ảnh, tên, mô tả, tính năng, giá và tiền tệ, lựa chọn gói,
người bán, đánh giá, bảo hành, giao hàng, thời hạn và loại tài khoản.
Không tự tạo đánh giá, tỷ giá hoặc nội dung thay thế. UI hiện định dạng VND;
giá ngoại tệ cần thay đổi UI hoặc chọn VND trên nguồn trước khi crawl.
Kiểm tra URL ảnh không đồng nghĩa với tải và xác minh toàn bộ ảnh.

## Dùng phiên trình duyệt qua CDP

Khi có một trình duyệt người dùng mở bằng CDP tại localhost:9222 và đã truy
cập được GamsGo, có thể dùng đúng context đó thay vì tạo phiên trắng:

```powershell
rtk proxy npm run crawl:gamsgo -- --cdp http://127.0.0.1:9222 --reuse-cdp-context --no-resume --limit 0 --listing-pages 1000 --variants 2000 --output output/gamsgo-full-session
```

Tool chỉ đóng tab do nó tạo, giữ các tab sẵn có; không xuất cookie hoặc header
xác thực. Chế độ này không đảm bảo khắc phục HTTP 403. Nếu vẫn bị từ chối
hoặc yêu cầu xác minh, tool dừng với báo cáo chưa hoàn tất.

```powershell
rtk proxy npm run audit:gamsgo -- --input output/gamsgo-full-session
```

`medusa-products.json` vẫn là payload draft đạt điều kiện kỹ thuật Medusa;
chỉ import để sử dụng trên Printerval sau khi báo cáo tổng hợp hoàn tất.
Các trường nguồn không cung cấp cần quyết định fallback trên UI rõ ràng.

## Giữ robots, lấy gói con từ API

`config.gamsgo.live.json` bật `respectRobots` và `marketplaceApiOnly`.
Các trang cha công khai vẫn được kiểm tra robots. Gói con lấy từ API
`mapi.gamsgo2.com/index/planList` mà bộ lọc và phân trang trên website sử dụng.
Tool không mở các đường dẫn `/vi/shop/` trong chế độ này.

```powershell
rtk proxy npm run crawl:gamsgo -- --config config.gamsgo.live.json --cdp http://127.0.0.1:53468 --reuse-cdp-context --marketplace-api-only --concurrency 2 --limit 0 --listing-pages 1000 --variants 2000 --output output/gamsgo-full-live
```

Cổng CDP có thể thay đổi khi khởi động lại Chrome. Dữ liệu được tiếp tục từ
JSONL; bản ghi cũ hoặc thiếu bằng chứng không được coi là đã hoàn tất.

- `products.jsonl`: lưu từng bản ghi ngay trong lúc chạy, có thể có nhiều phiên bản cùng URL.
- `products.json`: bản mới nhất theo URL, được tổng hợp khi lượt chạy kết thúc.
- `catalog.json`: danh mục và liên kết sản phẩm nguồn.
- `network.jsonl`: các phản hồi API công khai đã lọc trường nhạy cảm.
- `medusa-products.json`: payload draft có giá xác định và nguồn được kiểm tra.
- `medusa-preview.json`: dữ liệu chưa đủ điều kiện xuất chính thức.
- `coverage-report.json`, `printerval-ui-report.json`: kết quả kiểm tra cuối lượt chạy.

Gói con có `sourceScope: public-marketplace-api`, `pagesVisited: 0` và
`evidence: public-api`. Giá này là giá API danh sách, không phải báo giá checkout.
Kho, đánh giá, người bán được giữ nguyên kể cả giá trị 0. Mô tả riêng của shop,
thư viện ảnh và các tùy chọn chỉ có trong trang chi tiết không được giả lập.
Nội dung trang cha được giữ riêng để hiển thị phần giới thiệu của Printerval.

Test offline chỉ xác nhận logic, không chứng minh lần crawl live đã đầy đủ.
Chỉ sử dụng báo cáo thuộc lần chạy hiện tại để đánh giá kết quả.
