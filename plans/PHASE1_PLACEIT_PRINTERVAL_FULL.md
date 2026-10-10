# PHASE 1 — Nhúng thư viện mockup Placeit vào modal Printerval

**Phiên bản:** 1.0  
**Ngày lập:** 09/10/2026  
**Trạng thái:** Đặc tả triển khai, chưa chỉnh sửa/deploy source code  
**Ngôn ngữ triển khai:** Theo stack hiện có của repository, ưu tiên tái sử dụng component và Cloudflare Worker đang có.

## 1. Mục tiêu và phạm vi

### 1.1. Địa chỉ liên quan

- Trang chủ cần giữ nguyên: `https://printerval.gofiber-phuongnguyen.workers.dev/create-your-own`
- Nguồn thư viện muốn tích hợp: `https://placeit.net/mockups/print-on-demand`
- Vị trí kích hoạt: **icon danh mục/khung bố cục đang tô xanh ở sidebar bên trái** của trình tạo thiết kế Printerval, đúng như ảnh người dùng cung cấp.
- Vị trí hiển thị: **trong modal “Choose Images” hiện tại**, tuyệt đối không điều hướng trang chính sang Placeit.

### 1.2. Mục tiêu trải nghiệm

Khi nhấn icon, modal Choose Images của Printerval mở lên. Giữ lại khung modal, overlay, tiêu đề, nút đóng, hành vi responsive và trạng thái canvas phía sau. Bỏ **toàn bộ sidebar danh mục của Printerval nằm bên trong modal** (Home & Living, Fashion, Kids & Babies, Sports & Outdoors và các mục con). Thân modal chỉ dành cho thư viện mockup, đúng phạm vi nội dung trong hai ảnh tham chiếu Placeit:

1. Cột trái **Filters** của Placeit, các checkbox danh mục/tổng số kết quả.
2. Thanh bộ lọc ngang: **Template Type, Style, Gender, Age, Ethnicity**.
3. Phần **Sort by** (mặc định Popular nếu dữ liệu nguồn trả về như vậy).
4. **Lưới media mockup** gồm ảnh/video, tên mẫu và các nhãn tương ứng.
5. **Phân trang** ở cuối lưới (ví dụ 1, 2, 3, …, trang cuối, nút Next); không hardcode số trang hay tổng mẫu từ ảnh chụp.

**Không hiển thị** các khu vực ngoài thư viện như header website nguồn, footer, các banner độc lập và vùng quảng bá khác nếu có **quyền tùy biến**. Không được dùng CSS `header {display:none}` hoặc `footer {display:none}` mang tính toàn cục vì có thể ẩn cả phần tử của Printerval hoặc bộ lọc trong thư viện. Không xóa thông tin cấp phép/attribution nếu giấy phép yêu cầu giữ lại.

### 1.3. Ngoài phạm vi (không triển khai)

- SSO, OAuth/OIDC/SAML, liên kết tài khoản Printerval ↔ Placeit.
- Gán cookie, sao chép session, dùng tài khoản Placeit chung, bot auto-login hoặc đăng nhập bằng HTTP request.
- Thanh toán, checkout, tải file trả phí, lấy file thiết kế đã mua.
- Đồng bộ layer hoặc file thiết kế Placeit với canvas Printerval; upload thiết kế lên Placeit; lưu dự án sang Placeit.
- Bypass CAPTCHA, Cloudflare challenge, HTTP 403, chống bot, `X-Frame-Options`, CSP `frame-ancestors` hoặc cơ chế bảo vệ truy cập khác.
- Clone toàn bộ website hoặc tái phân phối thư viện/template ngoài phạm vi giấy phép.

**Tiêu chí thực tế:** Phase 1 là thư viện duyệt mockup dạng guest nếu nguồn cho phép; không giả định rằng khách có thể chỉnh sửa/xuất template ngay trong modal.

## 2. Giao diện và UX cần giữ đúng ảnh

### 2.1. Modal

- Kế thừa modal Choose Images hiện có; không tạo modal mới chồng lên modal cũ.
- Giữ thiết kế header modal, nút `X`, radius, shadow, overlay và z-index tương thích layout hiện tại.
- Bỏ ô tìm `Find Products` và card sản phẩm mock data **thuộc nội dung Printerval cũ** trong modal này; thay bằng giao diện nội dung nhúng được phép dùng.
- Giữ nguyên header Printerval, navigation, toolbar, canvas, sidebar **ngoài modal**.
- Chiều rộng modal lớn nhưng có `max-width`; chiều cao nằm trong viewport; phần body tự cuộn, tránh tràn xuống ngoài màn hình.
- Nếu thư viện bên trong tự có vùng cuộn, quyết định **một vùng cuộn chính**, hạn chế thanh cuộn lồng nhau; phân trang phải có thể truy cập ở cuối.
- Đóng bằng nút `X`; cân nhắc Escape và nhấp overlay theo hành vi modal cũ; trả focus về icon kích hoạt.
- Khi đóng/mở lại không reset hoặc reload canvas Printerval.

### 2.2. Phạm vi nội dung nguồn (chỉ lấy đến hết pagination)

- **Giữ:** Filters trái; bộ lọc ngang; Sort by; grid ảnh/video; tiêu đề item; phân trang.
- **Ẩn theo vùng (nếu được cấp phép):** header toàn trang nguồn; footer; popup email/newsletter; vùng điều hướng và chiến dịch marketing không thuộc thư viện; sticky bar nguồn gây chồng chéo modal.
- **Không ẩn nhầm:** menu dropdown của các bộ lọc; overlay của media, controls ảnh/video; spinner; toast cần thiết; phân trang; các thông báo lỗi hữu ích.
- **Không dùng:** cắt iframe bằng `overflow:hidden`/vị trí pixel tuyệt đối để chỉ thấy ảnh đầu trang; kiểu cắt đó làm mất dropdown/phân trang khi chiều cao nội dung thay đổi.
- **Không đoán CSS selector:** trước hết audit DOM hiện hành, tìm container chính của Filters + Toolbar + Gallery + Pagination, lập bảng selector và fallback; ưu tiên selector ngữ nghĩa, tránh class hash và `nth-child` dễ đổi.
- Nếu nguồn được render động và HTML ban đầu không có nội dung, cần kiểm tra script/hydration, không kết luận rằng HTMLRewriter một mình là đủ.

### 2.3. Responsive

- Desktop: modal rộng, Filters ở trái, gallery ở phải, giữ mật độ card tương ứng viewport.
- Tablet: giảm số cột card; thanh filter có thể cuộn ngang nhưng không làm tràn modal.
- Mobile: ưu tiên Filters dạng drawer/accordion **nếu được quyền chỉnh UI**, media grid 1–2 cột, nút đóng luôn hiển thị; nếu không thể tùy biến nội dung nguồn hợp lệ, nêu rõ giới hạn.
- Không làm layout chính của Printerval bị dịch chuyển hoặc thay đổi scroll position sau khi đóng.

### 2.4. Trạng thái

- **Idle:** chưa nạp iframe/nội dung cho đến lần mở đầu tiên (lazy-load).
- **Loading:** skeleton/spinner nằm trong modal, vẫn có nút đóng.
- **Ready:** filter, media và phân trang render được.
- **Empty:** thông báo không có kết quả nếu nguồn hỗ trợ.
- **Error/Blocked:** hiển thị thông báo có ích khi iframe/proxy bị chặn; có nút thử lại; không hiện màn hình trắng vô hạn.
- **Timeout:** có giới hạn chờ; phân biệt lỗi network, HTTP lỗi, chính sách frame và lỗi runtime khi có thể.

## 3. Kiến trúc kỹ thuật đề xuất

### 3.1. Frontend React của Printerval

- Tìm đúng component trang Create Your Own, component modal Choose Images và event handler của icon đang tô xanh bằng cách **đọc source thật**, không đoán tên file.
- Giữ lifecycle/open-close modal hiện có; tách nội dung thư viện thành component độc lập để đổi nguồn dữ liệu khi cần.
- Không thay đổi logic editor/canvas, undo/redo, toolbar, upload ảnh, xuất file, các modal khác.
- Dùng feature flag cấu hình các trạng thái `disabled`, `direct-iframe`, `authorized-proxy`. Không báo thành công nếu hiện mock data thay cho Placeit.
- Kiểm soát điều hướng: click phân trang/lọc phải ở bên trong thư viện; không cho iframe tự thay đổi `window.top` ngoài yêu cầu đã phê duyệt. Click card mở trang chi tiết chỉ được xem là tính năng hỗ trợ nếu đã kiểm thử guest và được phép dùng.

### 3.2. Cổng nhúng / Cloudflare Worker

**Lưu ý nguồn bên thứ ba:** Worker reverse proxy một website thương mại rồi lược bỏ nhận diện là phương án yêu cầu sự cho phép từ nhà cung cấp. Placeit xác nhận hiện chưa có API công khai; giấy phép tài sản thành phẩm không đồng nghĩa với quyền cung cấp lại công cụ thiết kế. Vì vậy cần một **cổng kiểm tra quyền sử dụng** trước khi bật proxy live.

Các nhánh triển khai:

1. **Kiểm thử direct iframe** của URL Placeit để thu thập bằng chứng có/không được nhúng (header/console). Nếu nhúng được, CSS parent vẫn **không thể chỉnh DOM iframe cross-origin**; không hứa sẽ ẩn header/footer bằng CSS parent.
2. **Authorized proxy** (chỉ nếu có văn bản/điều khoản cho phép): Worker làm integration gateway. Ưu tiên **Worker trên origin riêng** (ví dụ Worker khác dưới `*.workers.dev`) để cách ly JavaScript nguồn với DOM và localStorage Printerval. Trình duyệt vẫn giữ URL chính `/create-your-own` vì chỉ iframe dùng URL origin tích hợp.
3. **Blocked/fallback:** nếu không có quyền nhúng/proxy hoặc bị hạn chế kỹ thuật, giữ khung modal Printerval cùng trạng thái giải thích, không triển khai thủ thuật vượt quyền; báo blocker và đề xuất thư viện mockup/SDK được cấp phép.

**Không mặc định chọn cùng-origin iframe cho HTML/JavaScript bên thứ ba:** proxy lên cùng origin Printerval có thể cho script nguồn quyền truy cập vào tài nguyên của Printerval. Dùng origin cách ly và `postMessage` có kiểm tra `origin`/message type nếu sau này cần giao tiếp. `sandbox` của iframe được cấu hình tối thiểu theo chức năng; không tự cấp `allow-top-navigation`/quyền popup không cần thiết.

**Nếu được phép proxy**, audit đầy đủ:

- Phân loại tài nguyên: HTML, CSS, JavaScript, image, font, video, API.
- Đường dẫn relative/absolute, `href`, `src`, `srcset`, form actions, navigation, lazy image, query string, URL encoding, redirect `Location`, `base href`, đường dẫn trong JS/CSS runtime.
- Hostname được allowlist (chống open proxy/SSRF); không cho người dùng truyền upstream URL tùy ý.
- Không chuyển tiếp cookie người dùng Printerval hoặc thông tin đăng nhập đến Placeit; không chia sẻ/ghi log access token.
- Dùng fetch timeout, giới hạn retry, giới hạn dung lượng và thông báo lỗi; tránh vòng lặp proxy.
- Dùng cache có kiểm soát cho tài nguyên public theo quyền cho phép, không cache HTML cá nhân hóa/response có cookie.
- Xem xét chính sách CSP và quyền embed do đối tác cung cấp, không xóa các header bảo vệ nhằm vô hiệu hóa chính sách từ chối nhúng.
- HTMLRewriter chỉ là bước chỉnh HTML; chưa tự động sửa được toàn bộ fetch/XHR/JS framework, browser storage, CORS và signed asset URLs.

### 3.3. Đường dẫn và triển khai Cloudflare

- Main page: `/create-your-own` (URL trên thanh địa chỉ phải được giữ nguyên).
- Route nhúng nội bộ **đề xuất**: `/integrations/mockup-library/` nếu là nội dung tin cậy/cấp phép phù hợp; với HTML script của bên thứ ba, ưu tiên origin tách biệt cho iframe.
- `workers.dev` là hostname gắn với Worker; **không tự giả định** có thể dùng Cloudflare zone routes để gắn một Worker thứ hai vào riêng path trên hostname này. Nếu cùng hostname, thêm routing ở Worker hiện có hoặc dùng Service Binding; nếu cần cô lập origin, triển khai Worker thứ hai trên subdomain Worker riêng.
- Deploy trên staging trước; bảo toàn cấu hình Wrangler, assets, routes và SPA fallback hiện tại.

## 4. Quy tắc xác thực cho Phase 1

- Mặc định **guest-only**. Không tự bật đăng nhập Placeit.
- Không triển khai SSO, cookie import/export, token injection hoặc trình duyệt tự đăng nhập.
- Nếu một hành động mở màn hình login, dừng phạm vi thao tác tương ứng và báo rõ "Yêu cầu đăng nhập Placeit; nằm ngoài Phase 1".
- Không lấy việc xem được thumbnail đồng nghĩa với quyền sử dụng/download mockup thương mại.

## 5. Checklist triển khai theo thứ tự

### A. Audit repository và giao diện

- [ ] Xác định đúng component `create-your-own`, icon kích hoạt và modal Choose Images hiện tại.
- [ ] Xác định state management, vị trí lưu canvas và cách modal được đóng/mở.
- [ ] Chụp baseline giao diện desktop/mobile và ghi lại behavior trước khi sửa.
- [ ] Kiểm tra Worker, cấu hình Wrangler và cách deploy đang dùng.
- [ ] Xác định các CSS selector/class ảnh hưởng riêng modal, tránh sửa style global.

### B. Đánh giá nguồn Placeit và quyền tích hợp

- [ ] Xác minh quyền được nhúng, proxy và tùy biến branding/nội dung của Placeit.
- [ ] Kiểm tra guest browsing trực tiếp trên URL nguồn trong cửa sổ ẩn danh.
- [ ] Kiểm tra iframe/CSP/frame-ancestors/X-Frame-Options bằng browser devtools.
- [ ] Kiểm tra requests của filter, pagination, thumbnail, media, card click; ghi tên miền và loại tài nguyên.
- [ ] Kiểm tra có lỗi HTTP 403/challenge/CORS/redirect hay không, không tìm cách vượt bảo vệ.
- [ ] Xác định liệu nội dung có thể được sử dụng hợp lệ theo phương thức tích hợp nào; đưa ra quyết định GO / BLOCKED.

### C. Tích hợp modal frontend

- [ ] Icon đúng vị trí mở Choose Images như ảnh tham chiếu.
- [ ] Tái sử dụng modal sẵn có, không tạo overlay/modal lồng.
- [ ] Xóa sidebar danh mục Printerval **chỉ trong modal này**.
- [ ] Xóa thanh Find Products/card mock data cũ **chỉ trong modal này**.
- [ ] Thêm vùng nhúng/library component với loading, error, timeout, retry.
- [ ] Không thay đổi URL trang chính khi modal mở, lọc hoặc phân trang.
- [ ] Modal đóng/mở không ảnh hưởng state canvas, undo/redo hay scroll trang chính.
- [ ] Tránh scroll lồng, tràn ngang, z-index sai hoặc mất khả năng click dropdown.
- [ ] Keyboard/focus: X, Escape (nếu chuẩn modal cũ), focus return và accessibility title.

### D. CSS và giới hạn vùng hiển thị

- [ ] Khoanh rõ vùng nguồn: Filters trái + filter ngang + sort + grid + pagination.
- [ ] Nếu có quyền tùy biến: lập danh sách selector vùng loại bỏ sau khi audit DOM thật.
- [ ] CSS được scoped trong tài liệu nhúng được phép chỉnh, không ảnh hưởng Printerval.
- [ ] Không ẩn nhầm dropdown/menu, overlay media, pagination hoặc lỗi hệ thống.
- [ ] Không dùng cắt pixel cố định chỉ để khớp một ảnh chụp.
- [ ] Không xóa các attribution/branding bắt buộc theo giấy phép.

### E. Worker / integration gateway (chỉ khi được cho phép)

- [ ] Chọn mô hình origin cách ly, kết nối iframe từ Printerval.
- [ ] Cấu hình allowlist upstream và hạn chế method/redirect theo phạm vi hợp đồng.
- [ ] Kiểm tra rewrite đường dẫn/tài nguyên/query string và redirect được phép.
- [ ] Kiểm tra CSP/sandbox, postMessage origin check nếu cần.
- [ ] Không chuyển cookie Printerval tới Placeit, không cache nội dung cá nhân hóa.
- [ ] Xử lý 403/429/5xx, timeout, retry giới hạn và log phi nhạy cảm.
- [ ] Không phá hoặc vượt anti-bot/frame restrictions của nguồn.
- [ ] Tách feature flag, rollback dễ và không làm hỏng SPA routing.

### F. Nghiệm thu chức năng

- [ ] Mở modal từ đúng icon, hiển thị đúng tiêu đề/nút X/overlay.
- [ ] Không còn sidebar danh mục Printerval trong modal.
- [ ] Có Filters + top filters + Sort + gallery + Pagination nếu nguồn được nhúng thành công.
- [ ] Checkbox filter thay đổi kết quả hoặc được đánh dấu "blocked" với bằng chứng lỗi.
- [ ] Dropdown chọn filter tương tác được, không bị modal che.
- [ ] Pagination tới trang kế tiếp và quay lại được, số trang không hardcode.
- [ ] Ảnh/video thumbnail hiển thị, có lazy loading và fallback lỗi hợp lý.
- [ ] Scroll được đến cuối phân trang, không hiển thị nội dung ngoài phạm vi được phép.
- [ ] Không xuất hiện yêu cầu tự động đăng nhập/SSO/cookie sharing.
- [ ] Reload trang Printerval khi modal đóng không bắt buộc; canvas không bị reset bởi việc mở/đóng.
- [ ] Desktop Chrome/Edge và thiết bị mobile phổ biến được kiểm thử.
- [ ] Build/lint/typecheck/test chạy và ghi rõ PASS/FAIL; không tuyên bố thành công nếu live iframe/proxy thực tế bị chặn.

## 6. Ma trận kiểm thử chấp nhận (UAT)

| ID | Tình huống | Kỳ vọng |
|---|---|---|
| UAT-01 | Mở `/create-your-own` | Trang/canvas hoạt động như trước |
| UAT-02 | Click icon danh mục sidebar | Modal Choose Images mở, URL không thay đổi |
| UAT-03 | Quan sát modal | Không có sidebar Home & Living/Fashion… của Printerval |
| UAT-04 | Kiểm tra nội dung nguồn | Có Filters, filter ngang, Sort, grid, pagination **nếu nguồn được phép và nhúng thành công** |
| UAT-05 | Cuộn tới đáy danh sách | Nhìn và click được pagination, không thấy footer ngoài phạm vi (nếu được phép tùy biến) |
| UAT-06 | Lọc và chuyển trang | Không bị điều hướng top-level sang Placeit, không lỗi runtime |
| UAT-07 | Mở dropdown | Dropdown không bị che/cắt/đóng sai |
| UAT-08 | Đóng/mở lại modal | Canvas và UI Printerval được bảo toàn |
| UAT-09 | Guest action yêu cầu login | Thông báo đúng phạm vi, **không** tự đăng nhập |
| UAT-10 | URL bị chặn frame/HTTP 403 | Hiện trạng thái lỗi hữu ích; log bằng chứng; không tìm cách bypass |
| UAT-11 | Giao diện mobile | Modal vừa viewport, có đường truy cập Filters và phân trang |
| UAT-12 | Các chức năng editor khác | Không regression các icon/modal khác, undo/redo, download |

**Điều kiện GO LIVE:** mọi mục bắt buộc của Phase 1 đạt, bằng chứng quyền tích hợp được xác nhận và nguồn live thực sự hoạt động. Nếu không, deliver bản UI shell + báo cáo blocker, không gọi là tích hợp Placeit thành công.

## 7. Kế hoạch làm việc và bàn giao

1. **Khảo sát (audit):** xác định source hiện tại, các component liên quan, routes Worker, bằng chứng browser/Network/CSP.
2. **Frontend shell:** thay body Choose Images, bỏ sidebar/dữ liệu Printerval cũ, hoàn thiện loading/error/modal responsiveness.
3. **Kết nối nguồn hợp lệ:** direct embed nếu hỗ trợ; authorized gateway nếu có quyền và cần CSS transform; nếu bị chặn thì dừng tại blocker.
4. **Kiểm thử:** UAT theo 12 tình huống trên, ít nhất hai kích thước desktop và mobile, test regression canvas.
5. **Bàn giao:** file đã thay, lý do chỉnh sửa, diff/patch nếu được yêu cầu, build/test output, hình chụp trước/sau và danh sách blocker thật.

**Dự kiến tham khảo (không phải cam kết):** audit 0,5–1,5 ngày; frontend shell 1–3 ngày; kiểm thử 0,5–2 ngày. Proxy cho ứng dụng bên thứ ba là nhánh phụ thuộc giấy phép, khả năng tương thích và không nên cam kết thời lượng trước khi có kết quả audit.

## 8. Quy tắc chất lượng và rollback

- Không giả lập Placeit bằng mock data rồi báo đã nhúng live; có thể làm UI shell nhưng phải gắn nhãn demo.
- Không đổi tên/icon/menu hệ thống khác, không sửa CSS toàn site, không tạo CSS `!important` đại trà.
- Không ghi API key/token/cookie thật vào repository hoặc log.
- Không dùng `git reset --hard`, xóa thay đổi có sẵn hoặc ghi đè file người dùng chưa cho phép.
- Chuẩn bị feature flag để tắt integration mà vẫn mở được Create Your Own; rollback không làm ảnh hưởng editor.
- Nếu đầu ra là `.patch`, kiểm tra `git apply --check` trên đúng commit/working tree mục tiêu và báo rõ nếu không áp dụng được.

## 9. Nguồn kiểm chứng (truy cập tháng 10/2026)

- Placeit — “Do you have an API?”: https://help.placeit.net/hc/en-us/articles/37799704596377-Do-you-have-an-API
- Placeit — License FAQs: https://help.placeit.net/hc/en-us/articles/51329441745049-Placeit-License-FAQs
- Cloudflare Workers — HTMLRewriter: https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/
- Cloudflare Workers — Routes and domains: https://developers.cloudflare.com/workers/configuration/routing/
- Cloudflare Workers — Microfrontends/service bindings: https://developers.cloudflare.com/workers/framework-guides/web-apps/microfrontends/
- MDN — `frame-ancestors`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- MDN — iframe sandbox and origin isolation: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

## 10. Prompt thực thi

**Prompt hoàn chỉnh, tối ưu để dán vào Cursor / Claude Code / coding agent có quyền đọc repository được tách riêng trong file:** [`PROMPT_IMPLEMENT_PHASE1_PLACEIT_PRINTERVAL.md`](./PROMPT_IMPLEMENT_PHASE1_PLACEIT_PRINTERVAL.md).

Prompt đó yêu cầu agent đọc source trước, thực hiện thay đổi frontend ít xâm lấn, kiểm tra tính hợp lệ của nhúng Placeit, không triển khai đăng nhập và không tuyên bố đã hoàn tất proxy live khi chưa có bằng chứng.


---

# PHU LUC: PROMPT GIAO CHO CODING AGENT

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
