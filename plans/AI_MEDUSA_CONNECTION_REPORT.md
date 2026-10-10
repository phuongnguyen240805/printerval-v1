# Báo cáo kết nối AI Agent với Medusa

Ngày kiểm tra: 10/10/2026.

## Đã triển khai

Cập nhật khôi phục UI chi tiết: sản phẩm Claude import CSV có metadata cấp sản phẩm `null`, nhưng biến thể chứa `parent_url` và thông tin người bán. Adapter trước đây nhận nhầm thành `official`, mở trang chi tiết rút gọn. Đã bổ sung nhận diện Marketplace từ metadata biến thể, giữ component/CSS chi tiết ban đầu và dữ liệu API. Đồng thời đọc avatar camelCase và rating dạng chuỗi đúng với CSV. Gọi API thật đã nhận Claude là Marketplace; trình duyệt xác nhận UI bộ lọc, 115 ưu đãi, thông tin người bán và phân trang tại cả đường dẫn `/tai-khoan-ai/goi/gamsgo-market-claude`. 17 tests qua, ESLint không lỗi. Ảnh: `plans/evidence-ai-medusa/restored-detail-ui.jpg`. Giá vẫn phụ thuộc cấu hình region/price hiện tại của backend, ngoài phạm vi sửa UI này.

- Danh sách AI Agent gọi `/api/ai-catalog`; server gọi `/store/regions` và toàn bộ các trang `/store/products` trên Medusa.
- Cấu hình, service, adapter, kiểu dữ liệu, định dạng giá và query hook tập trung trong `src/shared/features/ai-catalog/`. Endpoint API chỉ điều phối GET và trả lỗi đã lọc.
- Trang chi tiết lấy sản phẩm theo handle/ID từ API, bỏ giới hạn các đường dẫn mock được build sẵn. Giá và biến thể lấy từ backend; không tự quy đổi tiền tệ hoặc tạo giá khi thiếu dữ liệu.
- Giữ cấu trúc layout/CSS hiện có. Không thay đổi các luồng Medusa khác. Checkout vẫn là bản xem trước.
- `.env` đã đặt `MEDUSA_AI_BACKEND_URL` tới backend người dùng cung cấp. Hướng dẫn các biến cấu hình tại `src/shared/features/ai-catalog/README.md`.

## Kiểm chứng

- Jest: 5 suites, 27 tests đều qua, gồm adapter/service, render danh sách 18 sản phẩm từ response giả lập, mở rộng danh sách, link handle, lỗi API, bộ lọc và checkout.
- ESLint các file tích hợp: 0 lỗi; 7 cảnh báo sử dụng thẻ ảnh theo quy tắc Next.js.
- Production build thành công. Cấu hình dự án bỏ qua kiểm tra TypeScript trong build; chạy TypeScript riêng bị chặn bởi lỗi cú pháp có sẵn tại `src/server/api/routers/bought-together.ts:28`, không thuộc thay đổi này.
- Gọi API thật: backend mới trả HTTP 400 với thông báo `A valid publishable key is required to proceed with the request` khi dùng publishable key hiện có trong repo. Endpoint frontend chuyển thành HTTP 503, mã `AI_CATALOG_ACCESS`.
- Kiểm tra trình duyệt tại `http://localhost:3002/tai-khoan-ai`: hiển thị lỗi và nút Thử lại; thao tác Thử lại gọi lại API, không render dữ liệu mock. Ảnh: `plans/evidence-ai-medusa/api-access-error.jpg`.

## Phần còn chờ cấu hình

Cập nhật sau khi người dùng thay key: `/store/regions` đã trả dữ liệu thành công (region EUR). `/store/products` trả HTTP 400: `Publishable key needs to have a sales channel configured`. Key mới hợp lệ nhưng chưa có Sales Channel. Service và giao diện đã bổ sung mã lỗi riêng `AI_CATALOG_CHANNEL`; 11 kiểm thử module AI catalog đều qua.

Cập nhật sau khi gắn Sales Channel: frontend API trả thành công với `products: []`. Gọi trực tiếp `/store/products?limit=100` không có collection/region filter cũng trả `count: 0`. Đây là danh sách rỗng từ Medusa, không phải bộ lọc frontend. Công cụ export tại `tools/gamsgo-crawler/src/gamsgo/medusa.ts` tạo sản phẩm với `status: 'draft'` và yêu cầu cấu hình Sales Channel tại store đích. Chưa kiểm chứng trạng thái hiện tại của 18 gói trong Admin; cần kiểm tra Published và gán sản phẩm vào cùng channel của key. Giao diện đã phân biệt backend rỗng với lọc không có kết quả.

Chưa xác nhận được 18 gói thật và schema metadata của chúng do backend từ chối key. Cần đặt `MEDUSA_AI_PUBLISHABLE_KEY` bằng publishable key thuộc backend mới, gắn với Sales Channel có các sản phẩm đã publish, rồi khởi động lại môi trường phát triển. Không cần Admin secret.

Sau khi có key hợp lệ, cần kiểm tra response thật, số lượng sản phẩm, hình ảnh, giá/tiền tệ, metadata và trang chi tiết. Kiểm thử với fixture 18 sản phẩm không thay thế bước xác minh này.
