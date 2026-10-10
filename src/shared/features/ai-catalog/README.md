# AI Agent catalog — Medusa integration

All AI catalog configuration, requests, mapping, shared types and query caching live in this folder. UI components keep their existing layout. `src/pages/api/ai-catalog.ts` is a thin GET-only server endpoint.

Flow: page → `useAiCatalog` → `/api/ai-catalog` → `service.server` → Medusa Store API → `adapter` → view model. The browser never imports the server configuration or an Admin API key. Other catalog/cart/user Medusa integrations remain unchanged.

## Configure in one place

Set these server environment variables in `.env` for local development and in the deployment environment before building/deploying:

```dotenv
MEDUSA_AI_BACKEND_URL=https://medusa-backend-keffjz-7f6bd8-5-104-81-247.sslip.io
MEDUSA_AI_PUBLISHABLE_KEY=pk_your_storefront_key
# Optional: choose an explicit pricing region and limit the catalog to its AI collection.
MEDUSA_AI_REGION_ID=
MEDUSA_AI_COLLECTION_ID=
MEDUSA_AI_CURRENCY=vnd
```

Existing `NEXT_PUBLIC_MEDUSA_BACKEND_URL`/`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` are fallback values only. The dedicated variables let AI Agent use the new backend without redirecting unrelated shop flows. Restart development after configuration changes.

The publishable key must be associated with the Sales Channel containing the imported products. Products must be published and available to that channel; a successful import as draft does not expose them to the Store API. Without a collection filter, this module lists the published products exposed by that backend/key. Set the collection ID if the backend contains other products too.

## Data contract

- `/store/regions` selects `MEDUSA_AI_REGION_ID` or the preferred currency's region, then the first available region.
- `/store/products` fetches all pages, including variants/calculated prices, metadata and images. IDs/handles are retained; detail routes use live data instead of static mock paths.
- Prices remain in the currency units returned by Medusa v2, with no x100 multiplication or exchange-rate conversion. Missing prices are labeled and purchase preview is disabled. Variant selection on product details uses the selected backend quote.
- Optional metadata: `category`, `type`, `features`, `tags`, `badge`, `is_new`. The importer's `source_catalog_card`, `parent_content`, `parent_url`, `source_scope`, and variant `price_period`/`selected_options`/`offer_attributes` are supported. Missing seller ratings are not invented.
- Product `category` defaults to `ai` for this dedicated module. Card style defaults to `official`; explicit marketplace metadata uses the existing marketplace view. Each Store product remains one card, with its variants as choices.
- Grouped CSV imports can have no product metadata. A variant's `parent_url` identifies a Marketplace product and restores its offer detail page; an explicit product `type: official` keeps the subscription view. Seller avatars support both CSV `sellerAvatar` and `seller_avatar`; numeric string ratings are validated before display.
- Loading, empty, API error and retry are explicit. No production fallback to `mockData`; existing fixture files are retained for old tests/editorial FAQ content.
- Checkout remains a preview. This request does not create real orders, charge payments, or provision accounts.

## Verify

`rtk npx jest src/shared/features/ai-catalog/catalog.test.ts --runInBand`

GET `/api/ai-catalog` should return products from the backend. `AI_CATALOG_ACCESS` means the Store API rejected the key/access; `AI_CATALOG_CONFIG` means configuration is missing; other error codes identify response/request/network/pagination problems. Errors never return Admin credentials or backend response bodies.

`AI_CATALOG_CHANNEL` means the publishable key is valid but has no Sales Channel configured. Associate the key with the channel containing the published AI products in Medusa Admin.
