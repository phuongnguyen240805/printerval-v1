# Báo cáo điều chỉnh và chạy thử GamsGo AI

**Ngày:** 2026-10-09 (Asia/Ho_Chi_Minh).

## Thực hiện

- Đã kiểm tra ZIP MONA v3, tách bộ crawl danh mục/chi tiết GamsGo.
- Đã thêm `config.gamsgo.json`, CLI riêng, chế độ thử nhanh và chế độ mở rộng sang AI navigation.
- Đã xử lý phân biệt card sản phẩm với menu/header/footer; đọc giá/tiền tệ; trích xuất phần chi tiết và metadata.
- Đã thêm `resume`, giới hạn request, xử lý mạng, log lỗi, HTML snapshot; loại file chứa session/cookie ra khỏi ZIP.

## Test và tình trạng truy cập

- TypeScript typecheck: PASS.
- Kiểm thử Playwright trên HTML fixture đã dựng: **12/12 assertions PASS**.
- Test nhận được **9 sản phẩm AI, 25 liên kết AI menu, 2 offers Marketplace**, nhưng các số này là của fixture, không phải kết quả Playwright live.
- Đã trích xuất thành công **2/2 trang chi tiết fixture**: ChatGPT, Gemini.
- Đã thử truy cập website thật bằng Chromium headless tại máy chạy này: thất bại tại `page.goto` với `net::ERR_BLOCKED_BY_ADMINISTRATOR` do hạn chế truy cập từ môi trường thực thi.
- Kết quả live: **0 trang thành công, 1 lỗi truy cập**. Không có dữ liệu live từ Chromium trong artifact này.
- Dữ liệu `fixtures/gamsgo/public-web-reference.json` là tài liệu tham chiếu riêng, được ghi từ nội dung trang công khai qua công cụ đọc web. Nó không phải kết quả Playwright và không gồm toàn bộ trường DOM/HTML/API.

## Bước tiếp trên máy người dùng

1. Chạy `npm install` rồi `npm run install:browsers`.
2. Chạy `npm run test:gamsgo` để xác minh môi trường.
3. Chạy `npm run crawl:gamsgo:test` và xem `output/gamsgo-ai-test/summary.json`.
4. Khi chạy thành công, chạy `npm run crawl:gamsgo` (card AI) hoặc `npm run crawl:gamsgo:all-ai` (mở rộng AI menu).
5. Nếu trả về 403, 429, robots disallow hoặc challenge: dừng crawl, xem xét chính sách/truy cập hợp lệ, không tìm cách vượt qua.
