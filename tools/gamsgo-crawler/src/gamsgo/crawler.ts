import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium, type BrowserContext, type Page } from 'playwright';
import { extractCatalog, extractProduct } from './extract.js';
import { cleanProductUrl } from './config.js';
import { PublicNetworkCollector } from './network.js';
import { GamsgoOutput } from './output.js';
import { fetchRobots, type RobotsPolicy } from './robots.js';
import type { CatalogItem, CrawlSummary, GamsgoConfig } from './types.js';
import { collectMarketplace } from './marketplace.js';
import { collectVariants } from './variants.js';
import { exportMedusa } from './medusa.js';
import { extractOfferDetail } from './offer-detail.js';
import { marketplaceApiOffers, marketplaceApiProduct } from './marketplace-api.js';

const pause = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function assertPublicPage(page: Page): void {
  const url = page.url();
  if (!url.startsWith('https://www.gamsgo.com/') && url !== 'about:blank') {
    throw new Error(`Unexpected redirect outside the allowed domain: ${url}`);
  }
}
async function offlineDocument(page: Page, file: string): Promise<void> {
  const html = await readFile(resolve(file), 'utf8');
  const base = '<base href="https://www.gamsgo.com/">';
  const prepared = html.includes('<head>')
    ? html.replace('<head>', '<head>' + base)
    : base + html;
  await page.setContent(prepared, { waitUntil: 'domcontentloaded' });
}
async function navigate(
  page: Page,
  url: string,
  timeout: number,
): Promise<number> {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout,
  });
  const status = response?.status() || 0;
  if (status === 429)
    throw new Error(
      'HTTP 429: rate-limited; stop and retry later, do not bypass',
    );
  if (status === 403) throw new Error('HTTP 403: access denied; do not bypass');
  if (status >= 400 || !response)
    throw new Error(`Unexpected HTTP ${status || 'no response'}`);
  assertPublicPage(page);
  const body =
    (await page
      .locator('body')
      .innerText()
      .catch(() => '')) || '';
  const title = (await page.title().catch(() => '')) || '';
  if (
    /^(just a moment|access denied|are you human|verify you are human)/i.test(
      title,
    ) ||
    /cf-chl-|verify you are human/i.test(body.slice(0, 1200))
  ) {
    throw new Error(
      'Verification/challenge page detected; crawler will not bypass it',
    );
  }
  return status;
}
async function scrollForListing(
  page: Page,
  maxScrolls: number,
): Promise<number> {
  let moved = 0;
  let previous = -1;
  for (let n = 0; n < maxScrolls; n++) {
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(420);
    moved++;
    if (height === previous && n >= 2) break;
    previous = height;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return moved;
}

export async function runGamsgoCrawl(cfg: GamsgoConfig): Promise<CrawlSummary> {
  const start = Date.now();
  const startedAt = new Date().toISOString();
  const offline = Boolean(cfg.offlineHtml);
  const output = new GamsgoOutput(cfg);
  const completed = await output.prepare();
  const browsers = process.env.GAMSGO_CHROMIUM_PATH
    ? { executablePath: process.env.GAMSGO_CHROMIUM_PATH }
    : {};
  const browser = cfg.cdpEndpoint
    ? await chromium.connectOverCDP(cfg.cdpEndpoint)
    : await chromium.launch({ headless: cfg.headless, ...browsers });
  const ownsContext = !cfg.reuseCdpContext;
  const context = cfg.reuseCdpContext ? browser.contexts()[0] : await browser.newContext({
    viewport: { width: 1440, height: 980 },
    locale: cfg.locale,
    extraHTTPHeaders: { 'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8' },
    serviceWorkers: 'block',
  });
  if (!context) throw new Error('No browser context available at CDP endpoint');
  if (!cfg.cdpEndpoint && (cfg.blockHeavyResources || offline)) {
    await context.route('**/*', route => {
      const type = route.request().resourceType();
      if (offline || type === 'font' || type === 'image' || type === 'media')
        return route.abort();
      return route.continue();
    });
  }
  let discovered = 0,
    menuCount = 0,
    pageCount = 0,
    marketCount = 0,
    attempted = 0,
    succeeded = 0,
    errors = 0,
    skippedCompleted = 0;
  let warning: string | undefined;
  let childOffers = 0,
    variants = 0;
  let stopped = false;
  const onDisconnected=()=>{
    stopped=true;
    warning='Browser/CDP disconnected; saved records are resumable. Reconnect the browser before continuing.';
  };
  browser.on('disconnected',onDisconnected);
  try {
    const robots: RobotsPolicy =
      offline || !cfg.respectRobots
        ? { available: false, allows: () => true }
        : await fetchRobots(context);
    if (robots.warning) console.warn('[gamsgo][robots]', robots.warning);
    if (!robots.allows(cfg.startUrl))
      throw new Error('robots.txt disallows the AI category page');

    const listPage = await context.newPage();
    listPage.setDefaultNavigationTimeout(cfg.navigationTimeoutMs);
    const listingNetwork = new PublicNetworkCollector(
      cfg.capturePublicApiBodies,
    );
    if (cfg.captureNetwork && !offline) {
      listingNetwork.attach(listPage);
      listingNetwork.begin(cfg.startUrl);
    }
    let listingStatus: number | undefined;
    let scrolls = 0;
    try {
      console.log(
        '[gamsgo][catalog]',
        cfg.startUrl,
        offline ? '(offline)' : '(live)',
      );
      if (offline) await offlineDocument(listPage, cfg.offlineHtml!);
      else
        listingStatus = await navigate(
          listPage,
          cfg.startUrl,
          cfg.navigationTimeoutMs,
        );
      await listPage.waitForTimeout(offline ? 100 : cfg.listingSettleMs);
      if (!offline) {
        const expand = listPage.locator('button.home-catalog__view-all');
        if (await expand.isVisible().catch(() => false)) {
          await expand.click();
          await listPage.waitForTimeout(cfg.listingSettleMs);
        }
      }
      if (!offline) scrolls = await scrollForListing(listPage, cfg.maxScrolls);
      const catalog = await extractCatalog(
        listPage,
        {
          startUrl: cfg.startUrl,
          includeMarketplace: cfg.includeMarketplace,
          currencyHint: cfg.currencyHint,
        },
        listingStatus,
      );
      catalog.scrolls = scrolls;
      if (offline) catalog.finalUrl = cfg.startUrl;
      if (cfg.saveHtml)
        catalog.rawHtmlPath = await output.html(
          cfg.startUrl,
          await listPage.content(),
        );
      await output.catalog(catalog);
      if (cfg.captureNetwork && !offline)
        await output.network(await listingNetwork.complete());
      discovered = catalog.productCount;
      menuCount = catalog.aiNavigation.length;
      marketCount = catalog.marketplaceOffers.length;
      const productPages: CatalogItem[] = [...catalog.products];
      if (cfg.crawlAiNavigation) {
        const known = new Set(productPages.map(item => item.url));
        for (const item of catalog.aiNavigation) {
          const productUrl = cleanProductUrl(item.url);
          if (!productUrl || known.has(productUrl)) continue;
          known.add(productUrl);
          productPages.push({
            url: productUrl,
            slug: new URL(productUrl).pathname.split('/').pop() || '',
            name: item.name,
            teaser: '',
            highlights: [],
            price: null,
            image: null,
            badge: null,
            confidence: 'fallback',
          });
        }
      }
      const queued = new Set(productPages.map(item => item.url));
      const appendPage = (url: string, title: string) => {
        if (cfg.marketplaceApiOnly && /\/(shop|product)\//.test(new URL(url).pathname)) return;
        const clean = cleanProductUrl(url);
        if (!clean || queued.has(clean)) return;
        queued.add(clean);
        productPages.push({
          url: clean,
          slug: new URL(clean).pathname.split('/').pop() || '',
          name: title,
          teaser: '',
          highlights: [],
          price: null,
          image: null,
          badge: null,
          confidence: 'fallback',
        });
        pageCount = productPages.length;
      };
      if (cfg.includeMarketplace)
        for (const offer of catalog.marketplaceOffers)
          appendPage(offer.url, offer.title);
      if (cfg.resume)
        for (const previous of (await output.records()).filter(
          record => record.crawl.offline === offline,
        ))
          for (const offer of previous.offers || [])
            appendPage(offer.url, offer.title);
      pageCount = productPages.length;
      await output.urls(
        productPages.map(item => item.url),
        cfg.crawlAiNavigation,
      );

      console.log(
        `[gamsgo][catalog] ${catalog.productCount} product cards, ${catalog.marketplaceOffers.length} marketplace offers; ${catalog.linksInspected} links inspected`,
      );
      if (catalog.extractionWarning) {
        warning = catalog.extractionWarning;
        console.warn('[gamsgo][catalog]', warning);
      }
      const pending = productPages.filter(
        product => !completed.has(product.url),
      );
      skippedCompleted = productPages.length - pending.length;
      const capped = pending;
      let nextIndex = 0;
      const workers = Array.from(
        { length: Math.min(cfg.concurrency, capped.length) },
        (_, i) => processWorker(i + 1),
      );
      await Promise.all(workers);
      // Child offers are discovered while workers run; persist the final graph.
      await output.urls(productPages.map(item => item.url), cfg.crawlAiNavigation);

      async function processWorker(workerId: number): Promise<void> {
        const page = await context.newPage();
        page.setDefaultNavigationTimeout(cfg.navigationTimeoutMs);
        const tracker = new PublicNetworkCollector(cfg.capturePublicApiBodies);
        if (cfg.captureNetwork && !offline) tracker.attach(page);
        try {
          while (true) {
            if (stopped) break;
            const position = nextIndex++;
            if (
              (cfg.maxProducts > 0 && attempted >= cfg.maxProducts) ||
              (cfg.maxAttempts > 0 && attempted >= cfg.maxAttempts)
            )
              break;
            if (position >= capped.length) break;
            const candidate = capped[position];
            if (!robots.allows(candidate.url)) {
              errors++;
              await output.error(
                candidate.url,
                new Error('Blocked by robots.txt'),
                0,
              );
              continue;
            }
            attempted++;
            console.log(
              `[gamsgo][w${workerId}] ${attempted}/${capped.length} ${candidate.url}`,
            );
            let worked = false;
            for (let attempt = 1; attempt <= cfg.retries + 1; attempt++) {
              const before = Date.now();
              tracker.begin(candidate.url);
              try {
                const kind = new URL(candidate.url).pathname.split('/')[2];
                const scopedFile = cfg.offlineDetailsDir
                  ? join(
                      resolve(cfg.offlineDetailsDir),
                      kind,
                      `${candidate.slug}.html`,
                    )
                  : null;
                const detailFile = scopedFile
                  ? await access(scopedFile)
                      .then(() => scopedFile)
                      .catch(() =>
                        join(
                          resolve(cfg.offlineDetailsDir!),
                          `${candidate.slug}.html`,
                        ),
                      )
                  : null;
                if (offline) {
                  if (!detailFile) {
                    warning =
                      'Offline catalog extracted; product pages skipped because --offline-details was not provided';
                    worked = true;
                    break;
                  }
                  await offlineDocument(page, detailFile);
                } else {
                  await navigate(page, candidate.url, cfg.navigationTimeoutMs);
                }
                if (!offline) await page.waitForTimeout(cfg.detailSettleMs);
                const detail = await extractProduct(
                  page,
                  candidate,
                  offline ? null : 200,
                  Date.now() - before,
                  catalog.currency,
                  offline,
                );
                if (
                  !detail.title ||
                  !detail.contentText ||
                  /^(sign in|login|đăng nhập|access denied)/i.test(detail.title)
                ) {
                  throw new Error(
                    'Product details missing or replaced by a login/challenge page',
                  );
                }
                if (candidate.url.includes('/accounts/')) {
                  const marketplace = await collectMarketplace(
                    page,
                    cfg,
                    candidate.url,
                    catalog.currency,
                  );
                  detail.offers = marketplace.offers;
                  if (!offline) {
                    const apiOffers = marketplaceApiOffers(await tracker.complete(), candidate.url);
                    const merged = new Map(detail.offers.map(offer => [offer.url, offer]));
                    for (const offer of apiOffers) {
                      const dom=merged.get(offer.url);
                      merged.set(offer.url,{ ...dom,...offer,attributes:{...dom?.attributes,...Object.fromEntries(Object.entries(offer.attributes||{}).filter(([,value])=>value!==''))} });
                    }
                    detail.offers=[...merged.values()];
                    marketplace.offers=detail.offers;
                    marketplace.coverage.discoveredOffers=detail.offers.length;
                  }
                  detail.coverage = marketplace.coverage;
                  childOffers += marketplace.offers.length;
                  for (const offer of marketplace.offers) {
                    if (cfg.marketplaceApiOnly) {
                      const apiRecord = marketplaceApiProduct(offer, offline);
                      if (apiRecord) await output.product(apiRecord);
                      else {
                        detail.coverage.complete = false;
                        detail.coverage.reasons.push(`Public API data missing for ${offer.url}`);
                      }
                      continue;
                    }
                    const beforeCount = productPages.length;
                    appendPage(offer.url, offer.title);
                    if (
                      productPages.length > beforeCount &&
                      !completed.has(offer.url)
                    )
                      capped.push(productPages[productPages.length - 1]);
                  }
                } else {
                  const result = await collectVariants(
                    page,
                    cfg,
                    candidate.url,
                    catalog.currency,
                  );
                  detail.variants = result.variants;
                  detail.coverage = result.coverage;
                  if (/\/(?:shop|product)\//.test(candidate.url))
                    detail.coverage.kind = 'offer';
                  variants += result.variants.length;
                }
                if (cfg.saveHtml)
                  detail.crawl.rawHtmlPath = await output.html(
                    candidate.url,
                    await page.content(),
                  );
                if (/\/(shop|product)\//.test(candidate.url)) {
                  detail.offerDetails = await extractOfferDetail(page);
                  if (detail.offerDetails.description) detail.description = detail.offerDetails.description;
                }
                const entries =
                  cfg.captureNetwork && !offline
                    ? await tracker.complete()
                    : [];
                detail.crawl.networkEntries = entries.length;
                const faqResponse=entries.find(entry=>new URL(entry.url).pathname==='/webpage/questions')?.publicApiJson as
                  {data?:Array<{question:string;answer:string}>} | undefined;
                if(Array.isArray(faqResponse?.data))detail.faqs=await page.evaluate(
                  new Function('rows',`return rows.filter(row=>typeof row.question==='string'&&typeof row.answer==='string').map(row=>({question:row.question,answer:new DOMParser().parseFromString(row.answer,'text/html').body.textContent.trim(),answerHtml:row.answer}));`) as (rows:Array<{question:string;answer:string}>)=>Array<{question:string;answer:string;answerHtml:string}>,
                  faqResponse.data,
                );
                detail.publicCatalogData = entries.filter(entry =>
                  entry.publicApiJson && /getSkuList|\/index\/planList/.test(entry.url),
                ).map(entry => ({ url: entry.url, data: entry.publicApiJson }));
                const sku = detail.publicCatalogData.find(entry => entry.url.includes('getSkuList'))?.data as
                  { data?: { thumb_img?: string } } | undefined;
                if (sku?.data?.thumb_img && /^https?:\/\//.test(sku.data.thumb_img))
                  detail.images = [{ src: sku.data.thumb_img, alt: detail.title }, ...detail.images.filter(image => image.src !== sku.data!.thumb_img)];
                await output.network(entries);
                await output.product(detail);
                succeeded++;
                worked = true;
                console.log(
                  `[gamsgo][w${workerId}] OK ${detail.title}; sections=${detail.sections.length}; images=${detail.images.length}`,
                );
                break;
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : String(err);
                if (/HTTP (403|429)|challenge page|Target page, context or browser has been closed|Browser has been closed|browser disconnected/i.test(message)) {
                  stopped = true;
                  warning = `Crawl stopped: ${message}`;
                  errors++;
                  await output.error(candidate.url, err, attempt);
                  break;
                }
                console.warn(
                  `[gamsgo][w${workerId}] ${candidate.slug} attempt ${attempt}/${cfg.retries + 1}:`,
                  err instanceof Error ? err.message : String(err),
                );
                if (attempt === cfg.retries + 1) {
                  errors++;
                  await output.error(candidate.url, err, attempt);
                } else await pause(600 * attempt);
              }
            }
            if (!worked && errors >= 3 && succeeded === 0 && !offline) {
              warning =
                'Multiple detail requests failed; check connection and site access before rerunning';
            }
            await output.progress({
              at: new Date().toISOString(),
              total: pageCount,
              attempted,
              succeeded,
              errors,
              skippedCompleted,
            });
            if (cfg.delayMs > 0 && !offline) await pause(cfg.delayMs);
          }
        } finally {
          await page.close();
        }
      }
    } catch (err) {
      errors++;
      warning = `Category fetch/extraction failed: ${err instanceof Error ? err.message : String(err)}`;
      await output.error(cfg.startUrl, err, 1);
      console.error('[gamsgo][catalog]', warning);
    } finally {
      await listPage.close();
    }
  } finally {
    browser.off('disconnected',onDisconnected);
    if (ownsContext) await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
  const summary: CrawlSummary = {
    startedAt,
    finishedAt: new Date().toISOString(),
    startUrl: cfg.startUrl,
    offline,
    discoveredProducts: discovered,
    aiNavigationCount: menuCount,
    queuedProductPages: pageCount,
    marketplaceOffers: marketCount,
    attempted,
    succeeded,
    errors,
    skippedCompleted,
    durationMs: Date.now() - start,
    warning,
    childOffers,
    variants,
  };
  await output.summary(summary);
  const coverage = await exportMedusa(output.directory);
  summary.coverageComplete = coverage.complete;
  await output.summary(summary);
  return summary;
}
