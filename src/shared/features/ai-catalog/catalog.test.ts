/** @jest-environment node */
import { mapAiCatalog } from "./adapter";
import { formatAiPrice } from "./price";
import { getAiCatalog } from "./service.server";
import type { StoreProduct } from "./types";

const product: StoreProduct = {
  id: "prod_real",
  handle: "imported-agent",
  title: "Imported Agent",
  description: "Backend description",
  metadata: { category: "ai", features: ["Backend feature"] },
  variants: [
    {
      id: "var_month",
      title: "Monthly",
      metadata: { price_period: "1 tháng" },
      calculated_price: { calculated_amount: 150000, currency_code: "vnd" },
    },
    {
      id: "var_year",
      title: "Annual",
      metadata: { price_period: "1 năm" },
      calculated_price: { calculated_amount: 1200000, currency_code: "vnd" },
    },
  ],
};
const savedEnv = { ...process.env };
const savedFetch = global.fetch;
const json = (data: unknown, status = 200) =>
  ({ ok: status < 400, status, json: async () => data }) as Response;

test("CSV-imported Marketplace variants restore the original offer detail UI contract", () => {
  const data = mapAiCatalog(
    [
      {
        ...product,
        handle: "gamsgo-market-claude",
        metadata: null,
        variants: [
          {
            ...product.variants![0]!,
            metadata: {
              parent_url: "https://www.gamsgo.com/vi/accounts/claude",
              seller: "Adil",
              selected_options: {
                duration: "1 tháng",
                plan: "Max 20x",
                sharing: "Tài khoản dùng chung",
              },
              offer_attributes: {
                rating: "5.0",
                sellerAvatar: "https://example.com/avatar.png",
                warranty: "30 ngày",
                delivery: "1 giờ",
                duration: "1 tháng",
                sharing: "Tài khoản dùng chung",
                plan: "Max 20x",
              },
            },
          },
        ],
      },
    ],
    "vnd",
  );
  expect(data.products[0]).toMatchObject({
    type: "marketplace",
    detailSlug: "gamsgo-market-claude",
  });
  const detail = data.details["gamsgo-market-claude"]!;
  expect(detail.offers[0]).toMatchObject({
    seller: "Adil",
    rating: 5,
    sellerAvatar: "https://example.com/avatar.png",
    warranty: "30 ngày",
    price: 150000,
  });
  expect(
    detail.filters.find((f) => f.title === "Phương thức chia sẻ")?.items,
  ).toContainEqual({ label: "Tài khoản dùng chung" });
});
beforeEach(() => {
  process.env.MEDUSA_AI_BACKEND_URL = "https://medusa.example";
  process.env.MEDUSA_AI_PUBLISHABLE_KEY = "pk_test";
  delete process.env.MEDUSA_AI_REGION_ID;
  delete process.env.MEDUSA_AI_COLLECTION_ID;
});
afterEach(() => {
  process.env = { ...savedEnv };
  global.fetch = savedFetch;
});

test("maps imported product IDs, variants, features and exact Medusa v2 currency units", () => {
  const data = mapAiCatalog([product], "vnd");
  expect(data.products[0]).toMatchObject({
    id: "prod_real",
    handle: "imported-agent",
    price: 150000,
    currencyCode: "vnd",
    hasPrice: true,
    features: ["Backend feature"],
  });
  expect(data.products[0]!.variants).toHaveLength(2);
  expect(data.details["imported-agent"]!.offers.map((o) => o.id)).toEqual([
    "var_month",
    "var_year",
  ]);
  expect(data.details["imported-agent"]!.offers[0]!.rating).toBeNull();
});
test("does not fabricate a zero price, rating or currency conversion when source price is missing", () => {
  const data = mapAiCatalog([
    { ...product, variants: [{ id: "v", title: "Unknown price" }] },
  ]);
  expect(data.products[0]!.hasPrice).toBe(false);
  expect(formatAiPrice(data.products[0]!.price, undefined, false)).toBe(
    "Chưa có giá",
  );
  expect(formatAiPrice(4.64, "usd")).toContain("4,64");
});
test("quotes from a different currency cannot become the cheapest regional offer", () => {
  const data = mapAiCatalog(
    [
      {
        ...product,
        variants: [
          ...product.variants!,
          {
            id: "usd",
            calculated_price: { calculated_amount: 1, currency_code: "usd" },
          },
        ],
      },
    ],
    "vnd",
  );
  expect(data.products[0]!.price).toBe(150000);
  expect(data.products[0]!.variants?.[2]?.hasPrice).toBe(false);
});
test("API response can supply more products than the original hardcoded catalog", () => {
  const products = Array.from({ length: 18 }, (_, i) => ({
    ...product,
    id: `prod_${i}`,
    handle: `agent-${i}`,
  }));
  expect(mapAiCatalog(products).products).toHaveLength(18);
  expect(mapAiCatalog([]).products).toEqual([]);
});
test("fetches all product pages with publishable key and preferred region, no Admin authentication", async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce(
      json({
        regions: [
          { id: "reg_us", currency_code: "usd" },
          { id: "reg_vn", currency_code: "vnd" },
        ],
      }),
    )
    .mockResolvedValueOnce(json({ products: [product], count: 2 }))
    .mockResolvedValueOnce(
      json({
        products: [{ ...product, id: "prod_two", handle: "agent-two" }],
        count: 2,
      }),
    );
  global.fetch = fetchMock;
  const result = await getAiCatalog();
  expect(result.products).toHaveLength(2);
  const url = fetchMock.mock.calls[2]![0] as URL;
  expect(url.searchParams.get("offset")).toBe("1");
  expect(url.searchParams.get("region_id")).toBe("reg_vn");
  expect(fetchMock.mock.calls[0]![1].headers).toEqual({
    "x-publishable-api-key": "pk_test",
    accept: "application/json",
  });
});
test("invalid publishable key fails explicitly, never returns mock or an empty success", async () => {
  global.fetch = jest.fn().mockResolvedValue(
    json(
      {
        message:
          "A valid publishable key is required to proceed with the request",
      },
      400,
    ),
  );
  await expect(getAiCatalog()).rejects.toMatchObject({
    code: "AI_CATALOG_ACCESS",
  });
});
test("incomplete pagination fails rather than silently dropping products", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce(json({ regions: [] }))
    .mockResolvedValueOnce(json({ products: [], count: 18 }));
  await expect(getAiCatalog()).rejects.toMatchObject({
    code: "AI_CATALOG_PAGINATION",
  });
});
test("valid key without a sales channel reports the configuration needed", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce(
      json({ regions: [{ id: "reg_eu", currency_code: "eur" }] }),
    )
    .mockResolvedValueOnce(
      json(
        { message: "Publishable key needs to have a sales channel configured" },
        400,
      ),
    );
  await expect(getAiCatalog()).rejects.toMatchObject({
    code: "AI_CATALOG_CHANNEL",
    status: 503,
  });
});
test("backend network failures return a controlled error", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("network failed"));
  await expect(getAiCatalog()).rejects.toMatchObject({
    code: "AI_CATALOG_NETWORK",
  });
});
