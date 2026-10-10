import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { parsePrice } from '../src/gamsgo/price.js';
import { loadGamsgoConfig, cleanProductUrl } from '../src/gamsgo/config.js';
import { runGamsgoCrawl } from '../src/gamsgo/crawler.js';
import { buildMedusa, medusaCsv } from '../src/gamsgo/medusa.js';
import { GamsgoOutput } from '../src/gamsgo/output.js';
import { collectMarketplace } from '../src/gamsgo/marketplace.js';
import { auditPrinterval } from '../src/gamsgo/ui-audit.js';
import { collectVariants } from '../src/gamsgo/variants.js';
import { marketplaceApiOffers, marketplaceApiProduct } from '../src/gamsgo/marketplace-api.js';
import { extractCatalog } from '../src/gamsgo/extract.js';

test('prices support VND suffix and both decimal/thousand conventions', () => {
  for (const [raw, currency, amount] of [
    ['120.318 ₫', 'VND', 120318],
    ['1.234,56 EUR', 'EUR', 1234.56],
    ['$1,234.56', 'USD', 1234.56],
    ['JPY 5,858', 'JPY', 5858],
    ['₫ 120,318', 'VND', 120318],
  ] as const)
    assert.deepEqual(
      [
        parsePrice(raw, null, 'detail')?.currency,
        parsePrice(raw, null, 'detail')?.amount,
      ],
      [currency, amount],
    );
  assert.equal(parsePrice('￥762', null, 'listing')?.currency, null);
  assert.equal(parsePrice('--', null, 'listing'), null);
});

test('child offer URLs are allowed and unsupported/external URLs are rejected', () => {
  assert.equal(
    cleanProductUrl('/vi/shop/29f84b99-014a-c877-9006-e001f6863211?x=1'),
    'https://www.gamsgo.com/vi/shop/29f84b99-014a-c877-9006-e001f6863211',
  );
  assert.equal(cleanProductUrl('https://evil.invalid/vi/shop/offer'), null);
  assert.equal(cleanProductUrl('/vi/checkout/offer'), null);
});

test('last CLI flag wins and file configuration is validated', async () => {
  const cfg = await loadGamsgoConfig([
    '--output',
    'output/first',
    '--output',
    'output/last',
  ]);
  assert.equal(cfg.outputDir, resolve('output/last'));
  const temp = await mkdtemp(join(tmpdir(), 'gamsgo-config-'));
  const file = join(temp, 'bad.json');
  await writeFile(file, JSON.stringify({ concurrency: -1 }));
  await assert.rejects(loadGamsgoConfig(['--config', file]));
  await assert.rejects(loadGamsgoConfig(['--reuse-cdp-context']));
});

test('full fixture crawls pagination, child offers, quote combinations and preserves provenance', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gamsgo-complete-'));
  const cfg = await loadGamsgoConfig([
    '--offline-html',
    'fixtures/gamsgo-complete/category.html',
    '--offline-details',
    'fixtures/gamsgo-complete',
    '--output',
    directory,
    '--no-resume',
  ]);
  const summary = await runGamsgoCrawl(cfg);
  assert.equal(summary.errors, 0);
  assert.equal(summary.succeeded, 5);
  assert.equal(summary.childOffers, 3);
  assert.equal(summary.variants, 7);
  const records = JSON.parse(
    await readFile(join(directory, 'products.json'), 'utf8'),
  );
  const catalog = JSON.parse(
    await readFile(join(directory, 'catalog.json'), 'utf8'),
  );
  const market = records.find((r: any) => r.coverage.kind === 'marketplace');
  const urls = JSON.parse(await readFile(join(directory, 'urls.json'), 'utf8'));
  assert.equal(urls.count, 5);
  assert.ok(urls.urls.some((url: string) => url.endsWith('/shop/offer-c')));
  const ui = auditPrinterval(records, catalog);
  assert.equal(ui.ready, false);
  assert.ok(ui.issues.some(issue => issue.fields.includes('images')));
  assert.ok(ui.issues.some(issue => issue.fields.includes('live provenance')));
  const exported = JSON.parse(await readFile(join(directory, 'coverage-report.json'), 'utf8'));
  assert.equal(exported.uiReady, false);
  assert.equal(exported.complete, false);
  assert.equal(market.coverage.pagesVisited, 2);
  assert.equal(market.coverage.complete, true);
  assert.equal(market.offers[0].seller, 'Seller A');
  const quotes = records.find((r: any) => r.slug === 'test-ai').variants;
  assert.deepEqual(
    quotes.map((q: any) => q.price.amount),
    [120000, 240000, 1440000, 2880000],
  );
  const fixture = buildMedusa(records, catalog);
  assert.equal(fixture.products.length, 0);
  assert.equal(fixture.preview.length, 4);
  assert.equal(fixture.report.complete, false);
  const live = buildMedusa(
    records.map((r: any) => ({ ...r, crawl: { ...r.crawl, offline: false } })),
    catalog,
  );
  assert.equal(live.products.length, 4);
  assert.equal(live.report.complete, true);
  assert.equal(buildMedusa(
    records.map((r: any) => ({ ...r, crawl: { ...r.crawl, offline: false } })),
    { ...catalog, extractionWarning: 'Incomplete category' },
  ).report.complete, false);
  const variant = live.products.find(p => p.external_id.endsWith('offer-b'))!
    .variants[0];
  assert.equal(variant.prices[0].amount, 1200000); // Annual total is not multiplied by 12 or 100.
  assert.equal(variant.metadata.seller, 'Seller B');
  assert.equal(
    new Set(live.products.flatMap(p => p.variants.map(v => v.sku))).size,
    7,
  );
  const csv = medusaCsv(live.products);
  assert.ok(csv.includes('Variant Price VND'));
  assert.ok(csv.includes('Variant Metadata'));
  const incomplete = buildMedusa(records.slice(0, 2), catalog);
  assert.equal(incomplete.report.missingPages.length, 3);
  assert.equal(incomplete.report.complete, false);
  // Fresh output preserves unrelated files; resumable records require complete coverage.
  await writeFile(join(directory, 'do-not-delete.txt'), 'keep');
  const safe = new GamsgoOutput({ ...cfg, resume: false });
  await safe.prepare();
  assert.equal(
    await readFile(join(directory, 'do-not-delete.txt'), 'utf8'),
    'keep',
  );
  await safe.product({
    ...records[0],
    coverage: { ...records[0].coverage, complete: false },
  });
  const resumed = await new GamsgoOutput({ ...cfg, resume: true }).prepare();
  assert.equal(resumed.size, 0);
  await safe.product(records[0]);
  const offlineResume = await new GamsgoOutput({
    ...cfg,
    resume: true,
  }).prepare();
  assert.equal(offlineResume.size, 1);
  const liveResume = await new GamsgoOutput({
    ...cfg,
    offlineHtml: undefined,
    resume: true,
  }).prepare();
  assert.equal(liveResume.size, 0);
});

test('page caps and unavailable totals are reported as incomplete', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    const html = await readFile(
      'fixtures/gamsgo-complete/accounts/cursor.html',
      'utf8',
    );
    await page.setContent('<base href="https://www.gamsgo.com/">' + html);
    const cfg = await loadGamsgoConfig([
      '--offline-html',
      'unused',
      '--listing-pages',
      '1',
    ]);
    const result = await collectMarketplace(
      page,
      cfg,
      'https://www.gamsgo.com/vi/accounts/cursor',
      'VND',
    );
    assert.equal(result.offers.length, 2);
    assert.equal(result.coverage.complete, false);
    assert.ok(result.coverage.reasons.some(r => r.includes('limit')));
    await page.setContent(
      '<base href="https://www.gamsgo.com/">' +
        html.replace('3 đã tìm thấy mục', 'Offers'),
    );
    const unknown = await collectMarketplace(
      page,
      { ...cfg, maxListingPages: 10 },
      'https://www.gamsgo.com/vi/accounts/cursor',
      'VND',
    );
    assert.equal(unknown.coverage.complete, false);
    assert.ok(
      unknown.coverage.reasons.some(r => r.includes('count not observable')),
    );
  } finally {
    await browser.close();
  }
});

test('live-style quote waits for recalculation and reads the purchase panel', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.route('https://api.gamsgo2.com/payment/calculate', async route => {
      await new Promise(resolve => setTimeout(resolve, 900));
      await route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"amount":175000}' });
    });
    await page.setContent(`<main>Unrelated content</main><section class="purchase-panel">
      <div role="radiogroup"><button role="radio" aria-checked="true" data-testid="payment-sku-month-option-1">1 tháng</button></div>
      <div><button role="radio" aria-checked="true" data-testid="payment-sku-screen-option-1">Riêng tư</button></div>
      <div role="radiogroup" aria-label="Bảo vệ"><button role="radio" aria-checked="true">Không</button><button id="care" role="radio" aria-checked="false">Có</button></div>
      <b class="total-price">100000₫</b></section><script>
      document.querySelector('#care').onclick=async function(){this.previousElementSibling.setAttribute('aria-checked','false');this.setAttribute('aria-checked','true');
      const response=await fetch('https://api.gamsgo2.com/payment/calculate');const data=await response.json();document.querySelector('.total-price').textContent=data.amount+'₫';};</script>`);
    const result=await collectVariants(page,await loadGamsgoConfig([]),'https://www.gamsgo.com/vi/details/test','VND');
    assert.equal(result.coverage.complete,true);
    assert.deepEqual(result.variants.map(v=>v.price?.amount),[100000,175000]);
    assert.ok(result.variants.every(v=>v.options['Chọn loại']==='Riêng tư'));
  } finally { await browser.close(); }
});

test('fixed child offer price comes from its total, not recommendations', async () => {
  const browser=await chromium.launch();const page=await browser.newPage();
  try {
    await page.setContent('<h1>Cursor Pro</h1><div class="sku"><b class="price">10₫</b></div><dl><div class="info-list-item"><dt>Tổng cộng:</dt><dd><span class="ui-price">955949₫</span></dd></div></dl>');
    const result=await collectVariants(page,await loadGamsgoConfig([]),'https://www.gamsgo.com/vi/shop/test','VND');
    assert.equal(result.variants[0].price?.amount,955949);
    assert.equal(result.variants[0].evidence,'offer-detail');
  }finally{await browser.close();}
});

test('public marketplace data preserves zero inventory and seller fields', () => {
  const entries=[{url:'https://mapi.gamsgo2.com/index/planList',publicApiJson:{data:{currency:'VND',list:[{
    type_plan_id:'sample-offer',title:'Cursor Pro',total_price:'120000',attribute_name:'1 tháng-Toàn quyền truy cập-Pro',
    merchant_name:'Seller',merchant_star_level:'4.8',merchant_comment_num:0,inventory_quantity:0,warranty_period:'10 ngày',shipping_time_name:'20 phút',
  }]}}}] as any;
  const offers=marketplaceApiOffers(entries,'https://www.gamsgo.com/vi/accounts/cursor');
  assert.equal(offers[0].price?.amount,120000);
  assert.equal(offers[0].attributes?.availability,'0');
  assert.equal(offers[0].attributes?.reviews,'0');
  assert.equal(offers[0].attributes?.plan,'Pro');
  assert.equal(offers[0].seller,'Seller');
  const product = marketplaceApiProduct(offers[0])!;
  assert.equal(product.sourceScope, 'public-marketplace-api');
  assert.equal(product.coverage?.pagesVisited, 0);
  assert.equal(product.description, '');
  assert.equal(product.variants?.[0].evidence, 'public-api');
  assert.equal(product.offerDetails?.attributes.inventory_quantity, '0');
  assert.equal(marketplaceApiProduct({...offers[0], publicApiRow: undefined}), null);
});

test('API-only mode never queues shop pages and reports missing API records', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gamsgo-api-only-'));
  const cfg = await loadGamsgoConfig(['--offline-html', 'fixtures/gamsgo-complete/category.html',
    '--offline-details', 'fixtures/gamsgo-complete', '--marketplace-api-only', '--output', directory]);
  assert.equal(cfg.respectRobots, true);
  const result = await runGamsgoCrawl(cfg);
  assert.equal(result.attempted, 2);
  const urls = JSON.parse(await readFile(join(directory, 'urls.json'), 'utf8'));
  assert.ok(urls.urls.every((url: string) => !url.includes('/shop/')));
  const records = JSON.parse(await readFile(join(directory, 'products.json'), 'utf8'));
  const market = records.find((record: any) => record.coverage.kind === 'marketplace');
  assert.equal(market.coverage.complete, false);
  assert.ok(market.coverage.reasons.some((reason: string) => reason.includes('Public API data missing')));
});

test('catalog uses the offer price rather than dollar credits in a title', async () => {
  const browser=await chromium.launch(); const page=await browser.newPage();
  try {
    await page.setContent('<base href="https://www.gamsgo.com/"><main><div class="home-catalog__product"><img alt="Replit"><a href="/vi/accounts/replit">Replit Core $40 credits</a><span class="third-card__plan-price">543,478₫</span></div></main>');
    const result=await extractCatalog(page,{startUrl:'https://www.gamsgo.com/vi?category_id=ai',includeMarketplace:true});
    assert.equal(result.products[0].price?.amount,543478);
    assert.equal(result.products[0].price?.currency,'VND');
  } finally {await browser.close();}
});
