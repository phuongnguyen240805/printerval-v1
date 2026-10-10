# Kiểm tra crawler GamsGo AI và dữ liệu Medusa

## Kết quả ZIP đầu vào

| Output trong ZIP | Kết quả | Dữ liệu live đầy đủ? |
| --- | --- | --- |
| `output/gamsgo-ai` | 0 sản phẩm, 0 trang chi tiết; HTTP 403 | Không |
| `output/gamsgo-ai-test` | 0 sản phẩm; HTTP 403 | Không |
| `output/gamsgo-fixture` | 9 card, 25 link menu AI, 2 link marketplace; chỉ 2 trang chi tiết do `--limit 2` | Không, fixture |
| `sample-output/offline-test` | Bản mẫu offline | Không |
| `sample-output/reference` | Tham chiếu công khai, chưa có giá/SKU đã chọn | Không |

Hai trang chi tiết trong fixture là ChatGPT và Gemini. Ảnh có URL `/placeholder/`; không phải tập ảnh live đầy đủ. File `products.json` của output live là `[]`, nên chưa có dữ liệu thật để import.

## Những thiếu sót đã sửa

1. Card discovery chỉ nhận `/details/`, bỏ sót `/accounts/` sau Xem tất cả. Đã mở rộng route và discovery menu theo nhóm AI.
2. URL offer thật là `/vi/shop/<id>`; whitelist cũ bỏ sót. [Trang Cursor có các ưu đãi dẫn tới shop](https://www.gamsgo.com/vi/accounts/cursor).
3. Chưa duyệt phân trang/tải thêm hoặc đối chiếu số offer với tổng trên marketplace. Đã bổ sung, có phát hiện URL trùng/lặp và báo giới hạn.
4. `planOptions` chỉ chứa nhãn, thiếu từng tổ hợp thời hạn/loại tài khoản và giá đã chọn. Đã duyệt các nhóm selectable qua DOM và lưu quote riêng, không nhân giá teaser để tạo giá giả.
5. Regex giá bỏ sót `120.318 ₫` và xử lý sai một số dấu thập phân. Đã hỗ trợ tiền tệ trước/sau số, dấu phân cách theo raw price; tiền tệ không rõ bị loại khỏi import.
6. Network body mặc định tắt; regex bỏ nhầm `accounts` và fields chứa `credit`/`card`, JSON array bị cắt ở 120 phần tử. Đã bật thu thập JSON công khai có lọc trường riêng tư; body quá 8 MB có warning rõ ràng.
7. Resume coi trang đã ghi là hoàn tất dù thiếu biến thể, không phục hồi gói con chưa crawl từ cha đã xong. Đã dùng coverage để xác nhận và khôi phục hàng đợi con.
8. Chưa có báo cáo coverage hay export Medusa. Đã xuất JSON/CSV, missing URLs và excluded/preview.
9. Flag `--output` lặp lại không ghi đè flag đầu, reset xóa toàn thư mục. Đã dùng flag cuối và chỉ xóa file output do crawler quản lý.
10. Engine ghi CDP nhưng chỉ `chromium.launch`. Đã thêm kết nối CDP local thật qua `--cdp`, dùng context riêng.

## Kiểm chứng và giới hạn

Typecheck đã qua, 12 assertions fixture cũ và 5 bài kiểm tra mới đã qua. Fixture mới duyệt 5 trang: 2 cha + 3 offer con, marketplace 2 trang phân trang, 7 quote với giá khác nhau. Các kiểm tra bao gồm tiền tệ, giới hạn/trang thiếu, nguồn người bán, SKU ổn định, không nhân giá năm, bảo vệ output và resume.

Live tại máy này vẫn HTTP 403. Các selector trên DOM live chưa được xác nhận; không thể kết luận crawl đủ GamsGo. Tool dừng khi gặp 403/429/challenge; live không đầy đủ trả exit code 2. Kết quả fixture là kiểm thử chương trình, không phải dữ liệu sản phẩm thật.

Thông tin không xuất hiện công khai (tồn kho thật, cấp tài khoản, điều kiện fulfillment, quyền lợi không hiển thị) không được tự điền. Ảnh được giữ bằng URL/metadata; chưa tải hoặc upload lên storage Medusa. Bằng chứng HTML/API được lưu riêng; selector hoặc giới hạn raw content vẫn cần kiểm tra trên một lần crawl live thành công.

## Mô hình Medusa

Một source URL là một product, mỗi quote là một variant. Offer khác người bán giữ product riêng, tránh trộn giá/bảo hành/nguồn cung. `parent_url`, seller và options gốc lưu trong metadata. Option Medusa tên `Lựa chọn`, handle/SKU ổn định theo URL và tổ hợp options.

CSV có một dòng mỗi variant. Giá giữ đơn vị Medusa v2: USD 4.64 là `4.64`, VND 120318 là `120318`, không nhân 100. JSON giữ các trường FAQ, sections, media và metadata rộng hơn CSV. [Định dạng CSV chính thức](https://docs.medusajs.com/user-guide/products/import), [Admin API cho product/variants](https://docs.medusajs.com/resources/commerce-modules/product/guides/manage-with-admin-api).

Product xuất ở trạng thái `draft`; chưa ghi gì vào server Medusa. Category ID, sales channel, shipping profile, inventory/provisioning và subscription billing cần cấu hình theo backend. Crawl lại để đồng bộ cần resolve ID Medusa theo external_id/handle/SKU, không import create mù mỗi lần.
