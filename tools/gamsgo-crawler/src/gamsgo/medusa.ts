import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { CatalogRecord, ProductDetail, VariantQuote } from './types.js';
import { auditPrinterval } from './ui-audit.js';

const digest = (text: string) =>
  createHash('sha256').update(text).digest('hex').slice(0, 16);
export interface MedusaProduct {
  title: string;
  handle: string;
  status: 'draft';
  external_id: string;
  description: string;
  thumbnail?: string;
  images: Array<{ url: string }>;
  options: Array<{ title: string; values: string[] }>;
  variants: Array<{
    title: string;
    sku: string;
    manage_inventory: boolean;
    allow_backorder: boolean;
    options: Record<string, string>;
    prices: Array<{ currency_code: string; amount: number }>;
    metadata: Record<string, unknown>;
  }>;
  metadata: Record<string, unknown>;
}

export function buildMedusa(
  records: ProductDetail[],
  catalog: CatalogRecord | null,
) {
  const excluded: Array<{ url: string; reason: string }> = [];
  const products: MedusaProduct[] = [];
  const preview: MedusaProduct[] = [];
  const parentByOffer = new Map(
    records.flatMap(record =>
      (record.offers || []).map(
        offer => [offer.url, { parent: record, offer }] as const,
      ),
    ),
  );
  for (const record of records) {
    if (record.coverage?.kind === 'marketplace') continue;
    const quotes = (record.variants || []).filter(
      q =>
        q.selectionVerified === true &&
        q.price?.amount !== null &&
        q.price?.amount !== undefined &&
        q.price.amount >= 0 &&
        q.price.currency &&
        /^[A-Z]{3}$/.test(q.price.currency),
    );
    if (!quotes.length) {
      excluded.push({
        url: record.requestedUrl,
        reason:
          'No individually selected variant quote with known amount/currency',
      });
      continue;
    }
    const parent = parentByOffer.get(record.requestedUrl);
    const labels = quotes.map(
      q =>
        (Object.values(q.options).join(' · ') || record.title) +
        ' · ' +
        q.sourceId.slice(0, 6),
    );
    const images = Array.from(
      new Set(record.images.map(image => image.src)),
    ).filter(url => /^https?:\/\//.test(url));
    const product: MedusaProduct = {
      title: record.title,
      handle:
        'gamsgo-' +
        record.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') +
        '-' +
        digest(record.requestedUrl).slice(0, 6),
      status: 'draft',
      external_id: record.requestedUrl,
      description: record.description || record.intro || record.contentText,
      ...(images[0] ? { thumbnail: images[0] } : {}),
      images: images.map(url => ({ url })),
      options: [{ title: 'Lựa chọn', values: labels }],
      variants: quotes.map((q, index) => ({
        title: labels[index],
        sku: 'GG-' + digest(record.requestedUrl + '|' + q.sourceId),
        manage_inventory: false,
        allow_backorder: false,
        options: { 'Lựa chọn': labels[index] },
        // Medusa v2 accepts currency units (USD 4.64, VND 120318); no x100 conversion.
        prices: [
          {
            currency_code: q.price!.currency!.toLowerCase(),
            amount: q.price!.amount!,
          },
        ],
        metadata: {
          source_id: q.sourceId,
          source_url: record.requestedUrl,
          selected_options: q.options,
          price_raw: q.price!.raw,
          price_period: q.price!.period,
          renewal_price: q.renewalPrice || null,
          evidence: q.evidence,
          ...(parent
            ? {
                seller: parent.offer.seller,
                offer_attributes: { ...parent.offer.attributes, ...record.offerDetails?.attributes },
                parent_url: parent.parent.requestedUrl,
              }
            : {}),
          offline_fixture: record.crawl.offline,
        },
      })),
      metadata: {
        source: 'gamsgo',
        source_scope: record.sourceScope || 'public-product-page',
        parent_url: parent?.parent.requestedUrl || null,
        source_catalog_card: catalog?.products.find(card => card.url === (parent?.parent.requestedUrl || record.requestedUrl)) || null,
        parent_content: parent ? {
          title: parent.parent.title, intro: parent.parent.intro,
          description: parent.parent.description, sections: parent.parent.sections,
          features: parent.parent.features, faqs: parent.parent.faqs,
        } : null,
        source_url: record.requestedUrl,
        crawled_at: record.crawl.fetchedAt,
        coverage: record.coverage || null,
        sections: record.sections,
        features: record.features,
        faqs: record.faqs,
        media: record.media,
        tags: record.tags,
        public_catalog_data: record.publicCatalogData || [],
        offer_details: record.offerDetails || null,
        offline_fixture: record.crawl.offline,
      },
    };
    if (record.crawl.offline || !record.coverage?.complete) {
      preview.push(product);
      excluded.push({
        url: record.requestedUrl,
        reason: record.crawl.offline
          ? 'Offline fixture: excluded from live import'
          : `Incomplete coverage: ${(record.coverage?.reasons || ['No coverage evidence']).join('; ')}`,
      });
    } else products.push(product);
  }
  const known = new Set(records.map(record => record.requestedUrl));
  const required = new Set([
    ...(catalog?.products || []).map(p => p.url),
    ...(catalog?.aiNavigation || []).map(p => p.url),
    ...(catalog?.marketplaceOffers || []).map(p => p.url),
    ...records.flatMap(p => (p.offers || []).map(o => o.url)),
  ]);
  const missing = [...required].filter(url => !known.has(url));
  return {
    products,
    preview,
    report: {
      schemaVersion: 2,
      source: catalog?.sourceUrl || null,
      records: records.length,
      readyProducts: products.length,
      readyVariants: products.reduce((n, p) => n + p.variants.length, 0),
      previewProducts: preview.length,
      missingPages: missing,
      excluded,
      complete:
        !!catalog &&
        !catalog.extractionWarning &&
        !!records.length &&
        products.length > 0 &&
        missing.length === 0 &&
        records.every(p => !p.crawl.offline && p.coverage?.complete) &&
        excluded.length === 0,
      notes: [
        'No synthetic variants or currency conversion. Listing teaser prices are not import prices.',
        'Products are exported as draft. Inventory, provisioning, sales-channel/category/shipping-profile IDs require configuration in the target store.',
        'Seller offers remain separate products keyed by source URL; source brand/parent is preserved in metadata.',
        'Additional metadata is preserved in JSON; CSV stores variant metadata but is not the full source archive.',
      ],
    },
  };
}

export function medusaCsv(products: MedusaProduct[]): string {
  const currencies = Array.from(
    new Set(
      products.flatMap(p =>
        p.variants.flatMap(v =>
          v.prices.map(price => price.currency_code.toUpperCase()),
        ),
      ),
    ),
  ).sort();
  const columns = [
    'Product Handle',
    'Product Title',
    'Product Status',
    'Product Description',
    'Product External Id',
    'Product Thumbnail',
    'Variant Title',
    'Variant Sku',
    'Variant Manage Inventory',
    'Variant Allow Backorder',
    'Variant Option 1 Name',
    'Variant Option 1 Value',
    'Variant Metadata',
    ...currencies.map(c => 'Variant Price ' + c),
  ];
  const imageCount = Math.max(0, ...products.map(p => p.images.length));
  for (let i = 1; i <= imageCount; i++) columns.push('Product Image ' + i);
  const escape = (v: unknown) =>
    '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const lines = [columns.map(escape).join(',')];
  for (const p of products)
    for (const v of p.variants) {
      const row: Record<string, unknown> = {
        'Product Handle': p.handle,
        'Product Title': p.title,
        'Product Status': p.status,
        'Product Description': p.description,
        'Product External Id': p.external_id,
        'Product Thumbnail': p.thumbnail,
        'Variant Title': v.title,
        'Variant Sku': v.sku,
        'Variant Manage Inventory': 'false',
        'Variant Allow Backorder': 'false',
        'Variant Option 1 Name': 'Lựa chọn',
        'Variant Option 1 Value': v.options['Lựa chọn'],
        'Variant Metadata': JSON.stringify(v.metadata),
      };
      for (const price of v.prices)
        row['Variant Price ' + price.currency_code.toUpperCase()] =
          price.amount;
      p.images.forEach((image, i) => {
        row['Product Image ' + (i + 1)] = image.url;
      });
      lines.push(columns.map(c => escape(row[c])).join(','));
    }
  return '\uFEFF' + lines.join('\r\n') + '\r\n';
}

export async function exportMedusa(directory: string) {
  const records = JSON.parse(
    await readFile(join(directory, 'products.json'), 'utf8'),
  ) as ProductDetail[];
  const catalog = await readFile(join(directory, 'catalog.json'), 'utf8')
    .then(s => JSON.parse(s) as CatalogRecord)
    .catch(() => null);
  const result = buildMedusa(records, catalog);
  const ui = auditPrinterval(records, catalog);
  const run = await readFile(join(directory, 'summary.json'), 'utf8')
    .then(text => JSON.parse(text).summary).catch(() => null);
  const network = await readFile(join(directory, 'network.jsonl'), 'utf8').catch(() => '');
  const networkWarnings = network.split(/\r?\n/).flatMap(line => {
    try { const entry = JSON.parse(line); return entry.bodyWarning ?
      [{ url: entry.url, warning: entry.bodyWarning }] : []; } catch { return []; }
  });
  const crawlComplete = result.report.complete && !run?.errors && !run?.warning && !networkWarnings.length;
  const report = { ...result.report, crawlComplete, networkWarnings,
    crawlError: run?.warning || null, uiReady: ui.ready,
    complete: crawlComplete && ui.ready };
  await Promise.all([
    writeFile(join(directory, 'printerval-ui-report.json'), JSON.stringify(ui, null, 2)),
    writeFile(
      join(directory, 'medusa-products.json'),
      JSON.stringify(result.products, null, 2),
    ),
    writeFile(
      join(directory, 'medusa-products.csv'),
      medusaCsv(result.products),
    ),
    writeFile(
      join(directory, 'medusa-preview.json'),
      JSON.stringify(result.preview, null, 2),
    ),
    writeFile(
      join(directory, 'coverage-report.json'),
      JSON.stringify(report, null, 2),
    ),
  ]);
  return report;
}
