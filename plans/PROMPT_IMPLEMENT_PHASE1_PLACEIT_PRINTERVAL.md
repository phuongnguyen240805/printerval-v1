# PROMPT THỰC HIỆN — PHASE 1 PLACEIT × PRINTERVAL

> Dán toàn bộ nội dung mục **PROMPT** bên dưới vào Cursor, Claude Code hoặc coding agent **sau khi đã mở đúng repository Printerval**. Đính kèm ảnh giao diện Create Your Own, modal Choose Images và hai ảnh bộ lọc/lưới mockup Placeit trong cuộc hội thoại nếu agent chưa nhìn thấy.

---

## PROMPT

Bạn là Senior Frontend Engineer (React/TypeScript), Cloudflare Workers Engineer và chuyên gia tích hợp microfrontend/iframe. Hãy **triển khai Phase 1** của luồng đưa thư viện mockup Placeit vào **modal Choose Images đang tồn tại** trên trang Create Your Own của dự án Printerval. Không xây trang mới, không viết lại toàn bộ editor, không phỏng đoán tên file khi chưa tìm trong source.

### 1. Ngữ cảnh

- Printerval: `https://printerval.gofiber-phuongnguyen.workers.dev/create-your-own`
- Nguồn Placeit được yêu cầu đánh giá tích hợp: `https://placeit.net/mockups/print-on-demand`
- Khi click **icon danh mục/khung bố cục đang tô xanh trên sidebar trái** của trang Create Your Own, modal `Choose Images` hiện tại sẽ mở.
- Ảnh nguồn đã cho thấy vùng nội dung cần giữ: **Filters phía trái, thanh lọc Template Type/Style/Gender/Age/Ethnicity, Sort by, lưới item ảnh/video và pagination cuối danh sách**.
- Hiện modal Printerval đang có sidebar Home & Living/Fashion/Kids & Babies/... cùng Find Products và mock cards. Cần bỏ **chỉ phần nội dung này trong modal**, giữ khung modal và UI trang chính.

### 2. Yêu cầu tuyệt đối

1. **KHÔNG** triển khai SSO, OAuth/OIDC, chia sẻ/copy cookie, session injection, browser automation auto-login, đăng nhập thay người dùng, tải tài sản trả phí, thanh toán hay đồng bộ canvas Placeit.
2. **KHÔNG** vượt `X-Frame-Options`, CSP `frame-ancestors`, HTTP 403/429, CAPTCHA, anti-bot hoặc dùng proxy nhằm vô hiệu hóa giới hạn truy cập của nguồn.
3. Placeit hiện không có API công khai theo Help Center. Reverse proxy và thay đổi HTML/branding bên thứ ba chỉ được bật nếu có quyền/điều khoản tích hợp tương ứng. Không mặc định quyền dùng tài sản thương mại đồng nghĩa với quyền nhúng lại website hoặc che nguồn.
4. Không dùng ảnh mock data giả để tuyên bố Placeit live đã hoạt động. Nếu không thể nhúng hợp lệ, phải deliver **frontend shell hoàn chỉnh + lỗi có thông tin + báo cáo blocker**.
5. Tuyệt đối không ảnh hưởng canvas, undo/redo, upload, download, header, toolbar, các modal khác, navigation và state hiện có. Không xóa code khác của người dùng.
6. **Không chỉ mô tả giải pháp**: khi repo/permissions cho phép, hãy sửa code, build/test và cung cấp diff/patch kèm báo cáo bằng chứng. Nếu thiếu repository hoặc quyền nhúng, nêu rõ phần nào có thể làm và điểm nào đang bị chặn.

### 3. Thực hiện theo quy trình

**Bước A — Đọc codebase trước khi sửa**

- Xác định framework/router, entrypoint trang Create Your Own, modal Choose Images, icon event handler, CSS module, state editor, Worker entrypoint/Wrangler và cơ chế deploy.
- Ghi rõ danh sách file dự kiến sửa, lý do và phần không được đụng tới; ưu tiên component + CSS module mới, tránh global CSS.
- Kiểm tra working tree đang có thay đổi chưa commit; không reset hoặc overwrite.

**Bước B — Kiểm tra điều kiện tích hợp Placeit**

- Thử URL Placeit ở chế độ guest qua trình duyệt; ghi nhận có yêu cầu login ngay khi vào hay không.
- Kiểm tra iframe trực tiếp trong môi trường test, Console và response headers `X-Frame-Options`, `Content-Security-Policy`, CSP `frame-src` của trang cha, redirect và trạng thái network.
- Kiểm tra DOM/Network thực của Filters, toolbar, gallery, pagination; xác định khả năng render động và dependencies.
- Xác minh quyền được nhúng hoặc sử dụng authorized reverse proxy/white-label. Chưa có quyền thì không bật reverse proxy thực tới Placeit.
- Lập **Integration Decision**: `DIRECT_IFRAME_SUPPORTED`, `AUTHORIZED_PROXY_POSSIBLE`, hoặc `BLOCKED_WITH_REASON`, kèm bằng chứng thực tế; không suy đoán.

**Bước C — Sửa phần modal Printerval**

- Giữ modal Choose Images hiện hữu: title, nút X, backdrop, radius, shadow, z-index và logic open/close.
- Khi click đúng icon sidebar, mở modal; không điều hướng và URL trên thanh địa chỉ vẫn `/create-your-own`.
- Xóa sidebar danh mục Printerval cũ **trong modal này** và vùng Find Products/mock cards; không tác động sidebar ngoài modal.
- Thêm component vùng thư viện nhúng, có lazy load, loading/skeleton, timeout, error và retry; tách logic nguồn để đổi integration mode.
- Nội dung mục tiêu nếu tích hợp hợp lệ: Filters trái; Template Type, Style, Gender, Age, Ethnicity; Sort; gallery image/video; pagination ở cuối. Giữ hành vi cuộn và dropdown hoạt động.
- Responsive desktop/tablet/mobile; tránh overflow ngang và double scroll; nút đóng không bị che.
- Giữ focus/keyboard và state canvas khi đóng/mở modal.

**Bước D — Triển khai phương thức kết nối theo điều kiện**

- Nếu iframe Placeit trực tiếp được cho phép: dùng iframe cross-origin có chính sách sandbox hợp lý; lưu ý CSS Printerval **không thể ẩn DOM Placeit** ở bên trong iframe khác origin. Nếu yêu cầu ẩn header/footer không thể làm hợp lệ thì ghi blocker, không cắt pixel cho giả giống thành công.
- Nếu có văn bản/điều khoản cho phép proxy và thay đổi giao diện: đề xuất Cloudflare Worker integration gateway **trên origin riêng** để script bên thứ ba không có cùng origin với Printerval. Dùng iframe trỏ tới gateway; browser address bar vẫn là `/create-your-own`.
- Chỉ khi được phép: audit DOM thật, dùng CSS/HTML rewriting **scoped** để giữ vùng Filters + toolbar + gallery + pagination, ẩn những phần không thuộc nội dung và được phép ẩn. Không xóa attribution phải giữ theo license.
- Worker không biến thành open proxy; allowlist upstream, validate redirect, giới hạn method, kiểm soát cache, timeout, lỗi và logs. Không forward Printerval cookies/tokens. Không xóa CSP/XFO của upstream để né chính sách từ chối nhúng.
- Không giả định chỉ rewrite HTML là đủ; phân tích đường dẫn CSS/JS, images/video/fonts, lazyload, internal API, SPA routing, query string, pagination và click item. Báo rõ các chức năng chưa thể hỗ trợ.
- Trên `workers.dev`, xác minh cơ chế route: không giả định một Worker thứ hai có thể gắn zone route vào một path trên hostname hiện tại. Nếu cần dùng cùng host, cấu hình routing trong Worker hiện có/Service Binding; ưu tiên origin riêng cho mã bên thứ ba.

**Bước E — CSS/layout**

- Không sửa/ẩn `header`, `footer`, `nav` toàn cục.
- Dựa vào DOM thực tế để lập map selectors có mục đích và phương án fallback; không hardcode `nth-child` hoặc cắt đến số pixel của một ảnh chụp.
- Scroll tới đáy vẫn xem được pagination; dropdown lọc, checkbox, media preview và pagination không bị che.
- Không làm mất các trạng thái loading/empty/error của nguồn.

**Bước F — Kiểm thử và bàn giao**

- Chạy lint/typecheck/build/test thực tế của repo nếu có; báo đúng output và mọi lỗi còn tồn tại.
- Kiểm tra click icon → modal mở → filter → scroll → pagination → đóng → mở lại; bảo toàn canvas.
- Kiểm tra desktop + mobile; Console/Network không có lỗi blocking không được xử lý.
- Kiểm tra 403/CSP/timeout: phải hiển thị thông báo lỗi rõ; **không** tự động giả mạo login hoặc dùng biện pháp vượt chính sách bảo vệ.
- Không gọi Phase 1 là tích hợp thành công nếu chỉ có vỏ modal hoặc iframe bị browser block.

### 4. Tiêu chí nghiệm thu (Definition of Done)

- [ ] Modal mở từ đúng icon trên Create Your Own và giữ nguyên URL.
- [ ] Sidebar Home & Living/Fashion… cũ của Printerval bên trong modal đã bị loại bỏ.
- [ ] Header, canvas, toolbar, undo/redo và modal khác của Printerval không bị ảnh hưởng.
- [ ] Vùng thư viện chiếm toàn body của modal; đủ chỗ cho Filters, top filters, Sort, gallery, pagination (khi tích hợp nguồn hợp lệ).
- [ ] Scroll, dropdown, pagination có thể tương tác và không bị cắt.
- [ ] Có trạng thái loading, blocked/error, timeout và retry phù hợp.
- [ ] Không có SSO, cookie sharing hoặc auto-login.
- [ ] Quyền nhúng/proxy được xác minh, không né CSP/anti-bot.
- [ ] Có ảnh trước/sau, danh sách files thay đổi và kết quả kiểm thử cụ thể.
- [ ] Có giải pháp bật/tắt/rollback integration; không deploy production khi chưa được phép.

### 5. Định dạng báo cáo cuối bắt buộc

Hãy xuất theo thứ tự:

1. **Repository audit:** framework, đường dẫn file thật, component và Worker hiện tại.
2. **Integration feasibility:** iframe test, security headers, guest behavior, licensing check và status GO/BLOCKED kèm bằng chứng.
3. **Thay đổi thực hiện:** file thêm/sửa và mô tả chính xác chức năng.
4. **Demo/UI:** trạng thái desktop/mobile; source live hay placeholder phải ghi rõ.
5. **Tests:** lệnh đã chạy và PASS/FAIL; lỗi chưa giải quyết.
6. **Diff/patch:** cung cấp unified diff hoặc `.patch` nếu có thể; phải tương thích working tree thực tế, không viết patch đoán theo source cũ.
7. **Blockers & next steps:** mô tả cụ thể và điều kiện để hoàn tất, không tự động chuyển sang Phase 2.

**Điểm dừng:** Sau khi hoàn thành Phase 1 hoặc có blocker đủ bằng chứng, dừng. Không tự triển khai đăng nhập, payment, export, chỉnh sửa mẫu Placeit hay đồng bộ canvas.

---

**Tài liệu yêu cầu đầy đủ:** [`PHASE1_PLACEIT_PRINTERVAL_SPEC_CHECKLIST.md`](./PHASE1_PLACEIT_PRINTERVAL_SPEC_CHECKLIST.md).

**Nguồn tham khảo:**
- https://help.placeit.net/hc/en-us/articles/37799704596377-Do-you-have-an-API
- https://help.placeit.net/hc/en-us/articles/51329441745049-Placeit-License-FAQs
- https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/
- https://developers.cloudflare.com/workers/configuration/routing/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
