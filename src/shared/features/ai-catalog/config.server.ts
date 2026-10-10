// This module is only imported by the server service. No Admin API credential is needed.
export function getAiMedusaConfig() {
  const backendUrl =
    process.env.MEDUSA_AI_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey =
    process.env.MEDUSA_AI_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (!backendUrl || !publishableKey) throw new Error("AI_CATALOG_CONFIG");
  const url = new URL(backendUrl);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("AI_CATALOG_CONFIG");
  return {
    backendUrl: url.origin,
    publishableKey,
    regionId: process.env.MEDUSA_AI_REGION_ID,
    collectionId: process.env.MEDUSA_AI_COLLECTION_ID,
    preferredCurrency: (process.env.MEDUSA_AI_CURRENCY || "vnd").toLowerCase(),
    timeoutMs: 15000,
    pageSize: 100,
  };
}
