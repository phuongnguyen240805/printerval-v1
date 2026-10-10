# GamsGo AI Public Catalog Crawler (Playwright + CDP)

**Mục tiêu:** `https://www.gamsgo.com/vi?category_id=ai`.

Dự án này phát triển từ `cdp-reverse-mona`: giữ nguyên crawler blog MONA cũ trong `src/`, đồng thời bổ sung crawler riêng ở `src/gamsgo/`. Không sử dụng session/cookie/login, không vượt CAPTCHA hoặc kiểm soát truy cập. Các file `.session` có trong bản ZIP người dùng cung cấp **không được đưa vào bản bàn giao**.

## 1. Dữ liệu được crawl

- Trang danh mục AI: tên, link chi tiết, giá hiển thị, loại tiền, mô tả tóm tắt, highlights, badge, ảnh sản phẩm.
- Các liên kết điều hướng nhóm AI (`aiNavigation`) được lưu riêng, không trộn với card thực sự của danh mục.
- Các tin rao Marketplace hiển thị trên trang danh mục (`marketplaceOffers`) được tách riêng.
- Trang chi tiết `/vi/details/<slug>` (và tùy chọn các trang `/vi/accounts/<slug>` từ menu AI): title, intro, meta description, nội dung hiển thị, headings + sections, FAQ, hình ảnh, link media, JSON-LD, thông tin gói/tùy chọn hiển thị trong UI, breadcrumb.
- HTML render dành cho đối chiếu giao diện: `html/*.html`.
- Metadata mạng `network.jsonl` chỉ ghi yêu cầu Document/Fetch/XHR cùng domain, không ghi cookie hay Authorization. Mặc định **không** lưu response body; chế độ `--api-bodies` chỉ lưu JSON trên public product/catalog endpoint và lọc các trường nhạy cảm.

**Giới hạn:** Giá tại danh mục không nhất thiết là giá của một SKU trên trang chi tiết; trang chi tiết có thể chỉ hiển thị `--` trước khi chọn gói. Trình crawl không tự mua hàng, không mở checkout và không tự đăng nhập. Chỉ nhận dữ liệu công khai mà phiên khách có thể xem.

## 2. Cài đặt & chạy trên Windows 11 (PowerShell)

Yêu cầu Node.js **20+** và Internet trên máy chạy:

```powershell
cd "$env:USERPROFILE\Downloads\cdp-reverse-mona"
npm install
npm run install:browsers
```

**Kiểm tra local không cần Internet (fixture có sẵn):**

```powershell
npm run test:gamsgo
```

**Chạy thử live 5 sản phẩm AI:**

```powershell
npm run crawl:gamsgo:test
```

Kết quả ở `output/gamsgo-ai-test/`.

**Crawl toàn bộ các card thuộc danh mục AI:**

```powershell
npm run crawl:gamsgo
```

**Crawl thêm các liên kết AI ở menu** (bao gồm trang danh mục tài khoản Marketplace công khai):

```powershell
npm run crawl:gamsgo:all-ai
```

**Chạy lại từ đầu và không giữ checkpoint:**

```powershell
npm run crawl:gamsgo:fresh
```

**Chạy tùy chỉnh:**

```powershell
npx tsx src/gamsgo/index.ts --config config.gamsgo.json --limit 10 --concurrency 1 --delay 1200 --output output/gamsgo-custom --no-resume
```

Mặc định crawler chạy Chrome headless, không chiếm màn hình/profile Chrome người dùng. Có thể chỉ định Chromium đã cài bằng biến môi trường `GAMSGO_CHROMIUM_PATH` nếu không dùng Playwright bundled browser. Không cấu hình `storageState`, cookies hoặc mật khẩu.

## 3. Đầu ra

```text
output/gamsgo-ai/
  crawler-meta.json     # metadata định dạng output
  catalog.json          # card sản phẩm, AI menu, marketplace offers
  urls.json             # danh sách URL trang chi tiết sẽ được crawl
  products.jsonl        # một product detail / dòng
  products.json         # JSON array (tổng hợp từ JSONL)
  completed.jsonl       # checkpoint để resume
  network.jsonl         # metadata mạng công khai, nếu bật
  errors.jsonl          # log lỗi theo URL, nếu có
  progress.json         # trạng thái sau mỗi lần thử detail
  summary.json          # kết quả và cấu hình crawl
  html/*.html           # HTML render cho trang category/chi tiết
```

`products.jsonl` / `products.json` không được tạo nếu chưa crawl thành công trang chi tiết. Nếu trang bị hạn chế truy cập, lỗi xuất hiện rõ ở `summary.json`/`errors.jsonl`, không tự tạo mock rồi báo là crawl thành công.

## 4. Kiểm thử offline, dữ liệu tham chiếu

- `fixtures/gamsgo/category-ai.html`: **HTML thử nghiệm do chúng tôi dựng**, dựa trên cấu trúc trang và thông tin công khai quan sát được; không phải bản HTML lấy bằng trình duyệt từ GamsGo.
- `fixtures/gamsgo/details/*.html`: 2+ HTML chi tiết **thử nghiệm**, phục vụ kiểm tra bộ extractor; không phải bản tải xuống nguyên bản.
- `fixtures/gamsgo/public-web-reference.json`: 9 thẻ sản phẩm AI và 25 liên kết AI đã xác minh bằng đọc trang công khai. Giá được quan sát ở locale `VI | JPY`, không phải giá cố định tại Việt Nam.
- `output/gamsgo-fixture/`: kết quả kiểm thử offline nếu chạy `npm run test:gamsgo`.
- `RUN_REPORT.md`: tình trạng kiểm thử thực tế của bản bàn giao.

Nhập trang HTML thực đã lưu sẵn theo chế độ offline:

```powershell
npx tsx src/gamsgo/index.ts --config config.gamsgo.json --offline-html path/to/catalog.html --offline-details path/to/details --output output/gamsgo-import --no-resume
```

Trong `--offline-details`, tên HTML phải khớp slug ví dụ `chatgpt.html`, `gemini.html`.

## 5. Cơ chế chống rủi ro

- Chỉ dùng origin `www.gamsgo.com`, giới hạn các trang chi tiết hợp lệ; không fetch URL tùy ý.
- Mặc định kiểm tra `robots.txt`, delay tối thiểu 350 ms, 1 worker, có xử lý HTTP 403/429 và không bypass anti-bot.
- Ghi lại dữ liệu nguyên trạng theo thời gian lấy và nguồn; không tự suy diễn giá theo SKU/tỷ giá.
- Để tiếp tục crawl đang dở: chạy lại lệnh cũ, `resume=true` mặc định; `--no-resume` sẽ xóa folder output của lần chạy đó.
- Sản phẩm Marketplace trong AI menu được crawl nếu bật `--include-ai-menu`, nhưng crawler không click checkout hay các action có tính giao dịch.

## 6. Crawler MONA cũ

Module MONA cũ vẫn giữ dưới `src/index.ts` với cấu hình `config.mona.json`. Xem `README_MONA_ORIGINAL.md` và `npm run crawl:mona` nếu vẫn cần crawl blog.
