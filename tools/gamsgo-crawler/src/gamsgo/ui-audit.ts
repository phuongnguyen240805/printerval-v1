import type { CatalogRecord, ProductDetail } from './types.js';

// Matches the data consumed by AiAccountsPage and AiAccountDetailPage.
// Missing source values stay missing: never manufacture reviews or prices.
export function auditPrinterval(records: ProductDetail[], catalog: CatalogRecord | null) {
  const issues: Array<{ url: string; fields: string[] }> = [];
  const present = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
  const usableImage = (value: string | null | undefined) => !!value && /^https?:\/\//.test(value);
  const byUrl = new Map(records.map(record => [record.requestedUrl, record]));
  for (const card of catalog?.products || []) {
    const detail = byUrl.get(card.url);
    const missing: string[] = [];
    if (!present(card.name)) missing.push('card.name');
    if (!usableImage(card.image)) missing.push('card.logo');
    if (!detail) missing.push('detail');
    if (!card.price || card.price.amount === null) missing.push('card.price');
    if (card.price?.currency !== 'VND') missing.push('card.currency: Printerval currently formats VND');
    if (missing.length) issues.push({ url: card.url, fields: missing });
  }
  for (const record of records) {
    const missing: string[] = [];
    if (!present(record.title)) missing.push('title');
    if (record.sourceScope !== 'public-marketplace-api') {
      if (!present(record.description) && !present(record.intro)) missing.push('description/intro');
      if (!record.features.length && !record.sections.length) missing.push('features/sections');
    }
    if (!record.images.some(image => usableImage(image.src)) &&
        !catalog?.products.some(card => card.url === record.requestedUrl && usableImage(card.image)))
      missing.push('images');
    if (record.crawl.offline) missing.push('live provenance');
    if (!record.coverage?.complete) missing.push('complete source coverage');
    if (record.coverage?.kind !== 'marketplace') {
      if (!record.variants?.length) missing.push('variants');
      for (const quote of record.variants || []) {
        if (quote.price?.amount == null) missing.push(`variants.${quote.sourceId}.price`);
        if (quote.price?.currency !== 'VND') missing.push(`variants.${quote.sourceId}.currency: expected VND for current UI`);
        if (!Object.keys(quote.options).length) missing.push(`variants.${quote.sourceId}.options`);
      }
    }
    if (missing.length) issues.push({ url: record.requestedUrl, fields: missing });
    for (const offer of record.offers || []) {
      const fields: string[] = [];
      if (!present(offer.title)) fields.push('title');
      if (!present(offer.seller)) fields.push('seller');
      for (const field of ['duration', 'sharing', 'plan', 'delivery', 'warranty', 'availability', 'rating', 'positive', 'reviews'])
        if (!present(byUrl.get(offer.url)?.offerDetails?.attributes[field] || offer.attributes?.[field])) fields.push(field);
      if (offer.price?.amount == null) fields.push('price');
      if (offer.price?.currency !== 'VND') fields.push('currency: expected VND for current UI');
      if (!byUrl.has(offer.url)) fields.push('child detail');
      if (fields.length) issues.push({ url: offer.url, fields });
    }
  }
  return {
    schemaVersion: 1,
    ready: !!catalog?.products.length && !!records.length && !issues.length,
    issues,
    notes: [
      'Public marketplace API child records cover offer-card fields only. Shop descriptions, media galleries and checkout quotes are not included; parent content is audited separately.',
      'Strict UI readiness, separate from crawl coverage. Source-unavailable fields need an explicit UI fallback, not invented values.',
      'VND is required by the current UI. The currency flag is a parsing hint, not a conversion or site currency selector.',
      'Image URLs are checked for presence only; asset availability and visual fidelity still require live verification.',
    ],
  };
}
