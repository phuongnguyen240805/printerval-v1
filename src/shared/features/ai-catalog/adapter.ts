import type {
  AccountDetailData,
  AiCatalog,
  AiProduct,
  AiVariant,
  CatalogCategory,
  DetailOffer,
  StoreProduct,
  StoreVariant,
} from "./types";

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown) => (typeof value === "string" ? value : "");
const strings = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string => typeof item === "string" && !!item.trim(),
      )
    : [];
const categories: Array<Exclude<CatalogCategory, "all">> = [
  "ai",
  "svod",
  "software",
  "music",
  "gaming",
  "marketplace",
  "topup",
  "new",
];

function variant(
  v: StoreVariant,
  productTitle: string,
  expectedCurrency?: string,
): AiVariant {
  const metadata = object(v.metadata);
  const price = v.calculated_price;
  const currency = text(price?.currency_code).toLowerCase();
  const hasPrice =
    typeof price?.calculated_amount === "number" &&
    Number.isFinite(price.calculated_amount) &&
    price.calculated_amount >= 0 &&
    /^[a-z]{3}$/.test(currency) &&
    (!expectedCurrency || currency === expectedCurrency);
  return {
    id: v.id,
    title: v.title || productTitle,
    price: hasPrice ? price!.calculated_amount! : 0,
    currencyCode: currency || undefined,
    hasPrice,
    duration:
      text(metadata.price_period) || text(metadata.duration) || undefined,
  };
}

function offer(v: StoreVariant, mapped: AiVariant): DetailOffer {
  const metadata = object(v.metadata);
  const attributes = object(metadata.offer_attributes);
  const selected = object(metadata.selected_options);
  const duration =
    text(attributes.duration) ||
    text(selected.duration) ||
    mapped.duration ||
    "";
  const rating =
    typeof attributes.rating === "number"
      ? attributes.rating
      : typeof attributes.rating === "string" && attributes.rating.trim()
        ? Number(attributes.rating)
        : NaN;
  return {
    ...mapped,
    meta:
      Object.values(selected)
        .filter((value) => typeof value === "string")
        .join(" · ") || mapped.title,
    seller: text(metadata.seller) || text(attributes.seller) || "Chưa cung cấp",
    sellerAvatar:
      text(attributes.seller_avatar) ||
      text(attributes.sellerAvatar) ||
      undefined,
    rating:
      Number.isFinite(rating) && rating >= 0 && rating <= 5 ? rating : null,
    positive: text(attributes.positive),
    reviews: text(attributes.reviews),
    delivery: text(attributes.delivery) || "Chưa cung cấp",
    warranty: text(attributes.warranty) || "Chưa cung cấp",
    availability: text(attributes.availability),
    duration,
    sharing: text(attributes.sharing),
    plan: text(attributes.plan) || text(selected.plan),
  };
}

export function mapAiCatalog(
  raw: StoreProduct[],
  expectedCurrency?: string,
): AiCatalog {
  const details: AiCatalog["details"] = {};
  const products = raw.map((p): AiProduct => {
    const metadata = object(p.metadata);
    const card = object(metadata.source_catalog_card);
    const parent = object(metadata.parent_content);
    const variants = (p.variants || []).map((v) =>
      variant(v, p.title, expectedCurrency),
    );
    // Select the cheapest quote only within the response's region currency; never convert currencies.
    const priced = variants.filter((v) => v.hasPrice);
    const cheapest = priced.reduce<AiVariant | undefined>(
      (current, next) =>
        !current || next.price < current.price ? next : current,
      undefined,
    );
    const category = categories.includes(
      metadata.category as Exclude<CatalogCategory, "all">,
    )
      ? (metadata.category as Exclude<CatalogCategory, "all">)
      : "ai";
    const marketplace =
      metadata.type === "marketplace" ||
      !!metadata.parent_url ||
      metadata.source_scope === "public-marketplace-api" ||
      // CSV imports retain Marketplace evidence on variants, without product metadata.
      (metadata.type !== "official" &&
        (p.variants || []).some((v) => !!text(object(v.metadata).parent_url)));
    const handle = p.handle || p.id;
    const features = strings(metadata.features).length
      ? strings(metadata.features)
      : strings(parent.features).length
        ? strings(parent.features)
        : strings(card.highlights);
    const product: AiProduct = {
      id: p.id,
      handle,
      name: p.title,
      category,
      logo:
        p.thumbnail ||
        p.images?.[0]?.url ||
        "/assets/ai-accounts/placeholder.svg",
      price: cheapest?.price ?? 0,
      currencyCode: cheapest?.currencyCode,
      hasPrice: !!cheapest,
      duration: cheapest?.duration,
      type: marketplace ? "marketplace" : "official",
      features,
      description: p.description || "",
      tags: strings(metadata.tags),
      variants,
      offers: variants,
      offerCount: variants.length,
      detailSlug: marketplace ? handle : undefined,
      badge: text(metadata.badge) || text(card.badge) || undefined,
      isNew: metadata.is_new === true,
    };
    const offers = (p.variants || []).map((v, index) =>
      offer(v, variants[index]!),
    );
    const facets: Array<[string, keyof DetailOffer]> = [
      ["Giao hàng cam kết", "delivery"],
      ["Tình trạng có sẵn", "availability"],
      ["Thời lượng", "duration"],
      ["Phương thức chia sẻ", "sharing"],
      ["Gói", "plan"],
    ];
    const detail: AccountDetailData = {
      slug: handle,
      name: p.title,
      title: p.title,
      logo: product.logo,
      resultCount: offers.length,
      warning: "",
      offers,
      filters: [
        {
          title: `Khoảng giá (${(product.currencyCode || "vnd").toUpperCase()})`,
          items: [{ label: "Giá từ" }, { label: "Giá đến" }],
        },
        ...facets.map(([title, field]) => ({
          title,
          items: [
            ...new Set(
              offers.map((o) => String(o[field] || "")).filter(Boolean),
            ),
          ].map((label) => ({ label })),
        })),
      ],
      introTitle: p.title,
      intro: p.description ? [p.description] : [],
      sections: [],
    };
    details[handle] = detail;
    return product;
  });
  return { products, details };
}
