import { getAiMedusaConfig } from "./config.server";
import { mapAiCatalog } from "./adapter";
import type { StoreProduct } from "./types";

export class AiCatalogError extends Error {
  constructor(
    public code: string,
    public status = 502,
  ) {
    super(code);
  }
}

export async function getAiCatalog() {
  let config: ReturnType<typeof getAiMedusaConfig>;
  try {
    config = getAiMedusaConfig();
  } catch {
    throw new AiCatalogError("AI_CATALOG_CONFIG", 503);
  }
  const request = async <T>(
    path: string,
    query: Record<string, string> = {},
  ): Promise<T> => {
    const url = new URL(path, config.backendUrl);
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          "x-publishable-api-key": config.publishableKey,
          accept: "application/json",
        },
        signal: AbortSignal.timeout(config.timeoutMs),
        redirect: "error",
        cache: "no-store",
      });
    } catch {
      throw new AiCatalogError("AI_CATALOG_NETWORK");
    }
    if (!response.ok) {
      if ([401, 403].includes(response.status))
        throw new AiCatalogError("AI_CATALOG_ACCESS", 503);
      if (response.status === 400) {
        const body = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        const message = typeof body.message === "string" ? body.message.toLowerCase() : "";
        if (message.includes("publishable key") && message.includes("sales channel"))
          throw new AiCatalogError("AI_CATALOG_CHANNEL", 503);
        throw new AiCatalogError(
          message.includes("publishable key")
            ? "AI_CATALOG_ACCESS"
            : "AI_CATALOG_REQUEST",
          503,
        );
      }
      throw new AiCatalogError("AI_CATALOG_UPSTREAM");
    }
    try {
      return (await response.json()) as T;
    } catch {
      throw new AiCatalogError("AI_CATALOG_RESPONSE");
    }
  };
  const { regions } = await request<{
    regions: Array<{ id: string; currency_code: string }>;
  }>("/store/regions");
  if (!Array.isArray(regions)) throw new AiCatalogError("AI_CATALOG_RESPONSE");
  const region = config.regionId
    ? regions.find((r) => r.id === config.regionId)
    : regions.find((r) => r.currency_code === config.preferredCurrency) ||
      regions[0];
  if (config.regionId && !region)
    throw new AiCatalogError("AI_CATALOG_REGION", 503);
  const products: StoreProduct[] = [];
  let total = Infinity;
  // Guard malformed pagination so a backend bug cannot create an endless request loop.
  for (let page = 0; products.length < total && page < 100; page++) {
    const result = await request<{ products: StoreProduct[]; count: number }>(
      "/store/products",
      {
        limit: String(config.pageSize),
        offset: String(products.length),
        fields:
          "id,title,handle,description,thumbnail,metadata,*images,*variants,*variants.calculated_price",
        ...(region ? { region_id: region.id } : {}),
        ...(config.collectionId ? { collection_id: config.collectionId } : {}),
      },
    );
    if (
      !Array.isArray(result.products) ||
      !Number.isInteger(result.count) ||
      result.count < 0
    )
      throw new AiCatalogError("AI_CATALOG_RESPONSE");
    total = result.count;
    if (!result.products.length) break;
    products.push(...result.products);
  }
  if (products.length < total)
    throw new AiCatalogError("AI_CATALOG_PAGINATION");
  return mapAiCatalog(products, region?.currency_code);
}
