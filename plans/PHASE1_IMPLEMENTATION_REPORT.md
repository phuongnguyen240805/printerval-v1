# Báo cáo triển khai Phase 1 — Placeit × Printerval

Ngày kiểm tra: 09/10/2026. Kết quả: **frontend shell hoàn thành; nguồn live BLOCKED_WITH_REASON**. Không deploy production, không chuyển sang Phase 2.

## 1. Repository audit

- Runtime build thực tế: Next.js 16.2.3, React 19, TypeScript; trang mục tiêu dùng Pages Router.
- Entry: `src/pages/create-your-own/index.tsx` → `CustomYourOwn/index.tsx` → `components/editor.tsx`.
- Icon thật: `components/sidebar/sidebar.tsx`, tool `category-images`, icon `Layout`, title `Categories`.
- Modal thật: `components/sidebar/category-images-sidebar.tsx`; editor mount modal khi activeTool là `category-images`. Đóng vẫn gọi `onChangeActiveTool("none")`; không router push.
- Canvas Fabric và state nằm trong `hooks/use-editor.ts`; undo/redo trong `hooks/use-history.ts`; hotkeys trong `hooks/use-hotkeys.ts`. Không sửa các file này.
- Cấu hình Next có cả `.ts` và `.mjs`; output build xác nhận dùng `next.config.mjs`, hiện đặt `ignoreBuildErrors: true`. Vì vậy build PASS không thay thế typecheck.
- Worker hiện hữu: `wrangler.toml`, entry `.open-next/worker.js`, assets `.open-next/assets`, nodejs_compat. Build Cloudflare qua `scripts/build-cloudflare.mjs`; deploy script chạy OpenNext. Không sửa Worker/Wrangler hoặc triển khai gateway.
- Working tree ban đầu có nhiều thay đổi ở AI accounts, contracts, patches/plans và `next-env.d.ts`. Giữ nguyên các tính năng đó; patch bàn giao chỉ gồm code modal và thư viện mới. `next-env.d.ts` là file generated đã dirty trước tác vụ và được công cụ Next quản lý.

## 2. Integration feasibility

**Quyết định: BLOCKED_WITH_REASON.**

- Guest browser truy cập được `https://placeit.net/mockups/print-on-demand`, thấy gallery, các filter Template Type/Style/Gender/Age/Ethnicity, Sort Popular và pagination. Không có login bắt buộc ngay khi vào; profile hiện Visitor/Free Account/Login. Đây là phiên browser không thực hiện đăng nhập, không phải chứng nhận kiểm thử incognito riêng.
- GET bằng curl và Node nhận HTTP 200, `X-Frame-Options: DENY`, CSP `frame-ancestors 'none'`. Chỉ lưu các header không chứa cookie trong `evidence-phase1/headers.json`.
- Test iframe trực tiếp trên localhost hiển thị `placeit.net refused to connect` / `chrome-error://chromewebdata/`. Ảnh: `evidence-phase1/direct-iframe-blocked.jpg`. Log API browser không trả console error cho trường hợp này; không bịa console message.
- Trang Printerval deployed trả HTTP 200; lần kiểm tra không có CSP/XFO trong response header. Việc upstream cấm frame vẫn đủ chặn direct iframe.
- [Placeit API FAQ](https://help.placeit.net/hc/en-us/articles/37799704596377-Do-you-have-an-API) xác nhận chưa có API. [License FAQ](https://help.placeit.net/hc/en-us/articles/51329441745049-Placeit-License-FAQs) bàn về quyền dùng nội dung thành phẩm và hạn chế sublicense; không tìm thấy bằng chứng cho phép proxy/white-label thư viện trong tài liệu được cung cấp.
- Chưa có văn bản/endpoint đối tác cho phép nhúng và tùy biến vùng nội dung. Không bật proxy, không xóa CSP/XFO, không audit sâu internal API/filter requests để triển khai lại nguồn sau khi đã xác định blocker.
- DOM gallery, thumbnail, header/footer là nội dung bên thứ ba cross-origin. Không áp CSS parent để ẩn nguồn; không có selector rewrite được triển khai hoặc giả định đã hoạt động.

## 3. Thay đổi thực hiện

Code bàn giao gồm **1 file sửa + 4 file mới**:

1. `components/sidebar/category-images-sidebar.tsx`: giữ overlay, title, X, radius, shadow, z-index và callback mở/đóng; bỏ sidebar Home & Living/Fashion/Kids & Babies và Find Products/mock cards trong modal. Sửa ký tự `x` thừa cạnh title. Thêm dialog semantics, focus loop, Escape, focus return và phục hồi body overflow. Chặn hotkeys editor khi người dùng đang ở dialog để Delete/undo/paste không tác động canvas phía sau.
2. `components/mockup-library/MockupLibrary.tsx`: nội dung tách riêng; chỉ mount theo lifecycle modal hiện hữu, loading skeleton, blocked/error/empty, timeout 15 giây, retry và link Visit Placeit mở tab riêng. Không hiển thị mock templates.
3. `components/mockup-library/MockupLibrary.module.css`: CSS module riêng, body chiếm vùng còn lại, cuộn trong body, modal vừa viewport desktop/tablet/mobile, focus visible và reduced motion. Không sửa global CSS.
4. `components/mockup-library/integration.ts`: cấu hình disabled/direct-iframe/authorized-proxy. Default disabled; direct-iframe luôn fail closed vì chính sách nguồn đã được xác minh. Gateway chỉ được nhận khi permission flag bật và URL HTTPS khác origin Printerval, không chứa user/password.
5. `components/mockup-library/MockupLibrary.test.tsx`: 7 tests về config, blocked không gửi request, timeout/retry, origin/source message validation, ready/empty/error và keyboard/focus/scroll.

Tất cả đường dẫn `components/` ở trên nằm dưới `src/shared/features/page/CustomYourOwn/`.

Không thay đổi canvas, history, upload/download, toolbar, navbar, các modal khác hoặc routes của Printerval. Không SSO, auto-login, payment hoặc canvas sync.

## 4. Demo/UI

**UI đang là blocked shell, không phải Placeit live hoặc gallery demo.**

- Desktop 1280×720: modal rộng 1024, cao 688, top 16; title/X không bị che.
- Mobile 390×844: modal rộng khoảng 366, cao 820, left/top 12; scrollWidth = clientWidth = 366, không overflow ngang trong modal.
- Tablet 768×1024: modal rộng khoảng 614, cao 820, top 102; scrollWidth = clientWidth = 614.
- Click đúng icon → modal mở; retry giữ blocked hợp lệ; Escape và X đóng; focus quay về Categories; pathname vẫn `/create-your-own`, body overflow phục hồi.
- Đã thêm shape thật qua Shapes rồi mở modal, nhấn Delete trong modal, đóng: shape còn trên canvas. Có ảnh trước/sau; đây là kiểm tra trực quan, không phải so sánh pixel tự động.
- Console quan sát có warning HMR và aspect ratio `/logo.png` tồn tại từ phiên baseline; không thấy lỗi mới của library. Không tuyên bố toàn bộ editor UAT đã được kiểm tra exhaustively.
- Filter/dropdown/pagination/media của nguồn trong modal và responsive nguồn live **chưa nghiệm thu được** vì embed bị chặn. Undo/redo/upload/download được giữ nguyên source nhưng chưa chạy đầy đủ tất cả trường hợp browser regression.

Ảnh bằng chứng:

- `evidence-phase1/before-desktop.jpg`, `before-mobile.jpg`
- `evidence-phase1/after-desktop.jpg`, `after-mobile.jpg`, `after-tablet.jpg`
- `evidence-phase1/canvas-before-modal.jpg`, `canvas-after-modal.jpg`
- `evidence-phase1/direct-iframe-blocked.jpg`

## 5. Tests

| Lệnh / kiểm tra | Kết quả |
|---|---|
| `rtk npx jest src/shared/features/page/CustomYourOwn/components/mockup-library/MockupLibrary.test.tsx --runInBand` | PASS: 1 suite, 7/7 tests |
| `rtk npx eslint src/shared/features/page/CustomYourOwn/components/sidebar/category-images-sidebar.tsx src/shared/features/page/CustomYourOwn/components/mockup-library --ext .ts,.tsx` | PASS: no issues |
| `rtk npm run build` | PASS: compiled, 196 static pages generated, `/create-your-own` included; type validation skipped by existing Next config |
| `rtk npx tsc --noEmit --incremental false` | FAIL: existing `src/server/api/routers/bought-together.ts(28,44): TS1109 Expression expected`; output saved in `evidence-phase1/typecheck.log` |
| Prettier với config repo | FAIL: CommonJS config require ESM tailwind plugin có top-level await |
| `rtk npx prettier --write --config plans/evidence-phase1/prettier.json` + các file thay đổi | PASS; dùng config rỗng riêng để format code, không sửa config/tooling toàn repo |
| Browser blocked shell desktop/mobile/tablet, X/Escape/retry/focus, Delete/canvas | PASS trong phạm vi mô tả ở mục 4 |
| Placeit live iframe | BLOCKED: DENY / frame-ancestors none / refused to connect |

Warning build hiện hữu: i18n với App Router, middleware convention deprecated, Browserslist cũ. Không sửa chúng ngoài phạm vi.

## 6. Diff/patch

File: `patches/phase1-placeit-modal.patch`. Gồm đúng 5 file code trên, không chứa thay đổi tính năng khác hoặc file generated.

Đã chạy `git apply --check --reverse` trên working tree sau triển khai và `git apply --check` trên baseline HEAD tách riêng: cả hai PASS. Script tái tạo: `rtk proxy node plans/evidence-phase1/export-patch.cjs`.

Patch dùng để review/áp vào baseline chưa có các thay đổi này; không apply forward lần nữa lên working tree hiện tại. Báo cáo và ảnh evidence không nằm trong patch code.

## 7. Blockers & next steps / rollback

- Cần văn bản cho phép nhúng/tùy biến và endpoint/library được Placeit chấp thuận. Direct URL hiện tại không dùng được; chỉ bật env flag không thể làm mất hạn chế nguồn.
- Chỉ khi có quyền phù hợp mới triển khai/audit gateway trên origin riêng. Phải giữ attribution, không strip protective headers để né chính sách; audit assets/internal API/routing/cache/methods/redirects theo checklist gốc trước go-live.
- Feature flags build-time:
  - `NEXT_PUBLIC_MOCKUP_LIBRARY_MODE=disabled` (mặc định; tắt mọi request từ shell).
  - `direct-iframe` hiện vẫn blocked, cần audit và sửa resolver nếu đối tác thay đổi policy trong tương lai.
  - `authorized-proxy` cần `NEXT_PUBLIC_MOCKUP_LIBRARY_PERMISSION_VERIFIED=true` và `NEXT_PUBLIC_MOCKUP_LIBRARY_GATEWAY_URL=https://<approved-isolated-origin>/<library>`; chưa cấu hình/bật trong tác vụ này.
- Gateway tương lai phải gửi `{ type: "printerval:mockup-library", status: "ready" | "empty" | "error" }` bằng postMessage tới đúng origin cha. Parent kiểm tra cả `origin` và `source`. Iframe `load` không được xem là bằng chứng source ready. Không có handshake thì timeout, kể cả iframe browser bị chặn nhưng phát sự kiện load.
- Sandbox chỉ có `allow-scripts allow-same-origin`, không top navigation/popups/forms. Không đọc DOM nguồn. Escape/focus bên trong iframe cross-origin cần hợp tác của endpoint; nút X của parent luôn có thể sử dụng. Nhánh gateway mới được unit test bằng sự kiện mô phỏng, **chưa có gateway live được chứng nhận**.
- Rollback nguồn: đặt mode disabled và rebuild; modal vẫn hiển thị trạng thái unavailable, editor hoạt động. Rollback toàn bộ code: reverse patch đã kiểm tra, phục hồi body modal cũ.
- Lỗi typecheck ngoài phạm vi và UAT nguồn live còn mở. Không gọi kết quả này là tích hợp Placeit live hoàn thành. Dừng tại Phase 1 theo yêu cầu.
