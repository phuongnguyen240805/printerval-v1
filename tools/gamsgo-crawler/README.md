# GamsGo AI crawler → Medusa v2

See [AUDIT_VI.md](AUDIT_VI.md) for the audit in Vietnamese. The supplied ZIP's README is preserved as `README_GAMSGO_ORIGINAL.md`; Mona source/commands remain separate.

Requires Node.js 20+ and Chromium. Run inside this folder:

```powershell
npm ci
npm run install:browsers
npm run typecheck
npm run test:gamsgo
npm run test:gamsgo:complete
```

## Live crawl

```powershell
npm run crawl:gamsgo -- --no-resume --output output/gamsgo-live-v2
```

Defaults: all discovered AI category/menu pages, marketplace pages and child offers, one worker, 900 ms delay, no product count limit. Output schema v2 refuses resuming schema-v1 data. Use a fresh output folder to preserve old runs.

If a local browser already exposes CDP:

```powershell
npm run crawl:gamsgo -- --cdp http://127.0.0.1:9222 --no-resume --output output/gamsgo-cdp-v2
```

CDP uses a new isolated context; it does not reuse your logged-in profile or guarantee resolving HTTP 403. The crawler stops on access denial/rate limiting, with no challenge bypass.

Saved public-page HTML can be processed offline:

```powershell
npm run crawl:gamsgo -- --offline-html C:/capture/category.html --offline-details C:/capture/pages --output output/saved-pages --no-resume
```

Scoped filenames avoid `details/cursor` and `accounts/cursor` collisions:

```text
pages/details/chatgpt.html
pages/accounts/cursor.html
pages/shop/<offer-id>.html
```

Legacy flat `<slug>.html` fallback remains. Offline data stays excluded from live import by default; review authenticity/timestamps before using saved pages as commerce data.

## Outputs

| File | Purpose |
| --- | --- |
| `catalog.json` | Category cards and menu discovery |
| `products.json` / `.jsonl` | Details, selected quotes, child offers, coverage |
| `network.jsonl` | Sanitized public API evidence, explicit size warnings |
| `coverage-report.json` | Missing URLs, incomplete variants, exclusions |
| `medusa-products.json` | Eligible live Medusa payloads, all draft |
| `medusa-products.csv` | Admin import, one row per variant |
| `medusa-preview.json` | Priced fixture/incomplete products for inspection |
| `errors.jsonl` | Request/extraction errors |

```powershell
npm run audit:gamsgo -- --input output/gamsgo-live-v2
```

Exit `2` means incomplete live coverage/audit. Offline exit `0` means parsing succeeded; it does not mean live import is ready. `summary.succeeded` counts parsed pages, not completed SKUs. Review the coverage report before importing eligible output.

`--currency VND` is a fallback ISO hint only: it neither converts prices nor changes the website currency selector. Observed currency takes precedence. Do not relabel JPY amounts as VND. Useful limits: `--listing-pages 100`, `--variants 200`, `--concurrency 1`, `--delay 900`, `--limit 0`. Hitting a limit marks coverage incomplete. `--no-ai-menu` restricts to visible category cards. Other flags: `npm run crawl:gamsgo -- --help`.

## Medusa import

Use CSV in Medusa Admin → Products → Import, reviewing its preview before confirming. JSON retains richer metadata and separate seller offers. Set category, sales-channel and shipping-profile IDs that exist in your backend. The tool exports files and does not mutate Medusa.

For repeated sync, resolve existing Medusa product/variant IDs by `external_id`/handle and SKU, then use update/batch-variant APIs. Stable source identifiers alone do not make repeated CSV create-imports idempotent.

Official references: [CSV format](https://docs.medusajs.com/user-guide/products/import), [Admin product/variant API](https://docs.medusajs.com/resources/commerce-modules/product/guides/manage-with-admin-api).

## Full-graph fixture

```powershell
npm run crawl:gamsgo:fixture-complete
```

Captures 2 parents + 3 child offers and 7 quotes. `medusa-products.json` is intentionally empty for synthetic fixtures; inspect `medusa-preview.json`.

The original live output was empty due to HTTP 403. A local live attempt reproduced the denial. Current live selectors, prices and coverage remain unverified until a successful live/snapshot run.
