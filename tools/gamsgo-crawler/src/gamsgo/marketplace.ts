import type { Page } from 'playwright';
import { cleanProductUrl } from './config.js';
import { parsePrice, PRICE_PATTERN } from './price.js';
import type { Coverage, GamsgoConfig, MarketplaceOffer } from './types.js';

const SNAPSHOT = String.raw`(() => {
  const compact=s=>(s||'').replace(/\s+/g,' ').trim();
  const priceReg=new RegExp(__PRICE__,'i');
  const root=document.querySelector('main,[role="main"]')||document.body;
  const offers=[]; const seen=new Set();
  for(const a of root.querySelectorAll('a[href]')) {
    if(a.closest('header,nav,footer,aside,[role="navigation"],[role="menu"]')) continue;
    const url=new URL(a.getAttribute('href'),document.baseURI);
    if(url.origin!=='https://www.gamsgo.com'||!/^\/vi\/(shop|product)\/[^/]+\/?$/i.test(url.pathname)) continue;
    if(getComputedStyle(a).display==='none'||a.closest('[hidden]'))continue;
    let box=a; for(let n=0;n<3;n++) { if(priceReg.test(compact(box.innerText||box.textContent)))break; if(!box.parentElement)break;box=box.parentElement; }
    const text=compact(box.innerText||box.textContent);
    if(!priceReg.test(text)||seen.has(url.href))continue;
    seen.add(url.href);
    const attributes={};
    for(const field of ['duration','sharing','plan','delivery','warranty','availability','rating','positive','reviews']) {
      const value=box.getAttribute('data-'+field)||box.querySelector('[data-'+field+']')?.getAttribute('data-'+field)||compact(box.querySelector('[class*="'+field+'" i]')?.textContent);
      if(value)attributes[field]=value;
    }
    if(!attributes.duration)attributes.duration=text.match(/\d+\s*(tháng|năm|months?|years?)/i)?.[0]||'';
    if(!attributes.sharing)attributes.sharing=text.match(/Toàn quyền truy cập|Tài khoản riêng|Đã chia sẻ|Shared|Private|Full access/i)?.[0]||'';
    const get=selector=>compact(box.querySelector(selector)?.textContent);
    const meta=get('.sku-type');
    if(meta){
      const parts=meta.split('-').map(compact);
      attributes.duration=parts.find(t=>/\d+\s*(ngày|tháng|năm|days?|months?|years?)/i.test(t))||attributes.duration;
      attributes.sharing=parts.find(t=>/truy cập|chia sẻ|dùng chung|riêng|shared|private/i.test(t))||attributes.sharing;
      attributes.plan=parts.filter(t=>t!==attributes.duration&&t!==attributes.sharing).join(' · ');
      attributes.meta=meta;
    }
    const fields={delivery:'.sku-time',warranty:'.sku-warranty-period',rating:'.sku-seller-left .appraisal-rate',positive:'.sku-seller > .appraisal .appraisal-rate',reviews:'.appraisal-count'};
    for(const [key,selector] of Object.entries(fields))if(get(selector))attributes[key]=get(selector);
    const avatar=box.querySelector('.sku-seller-avatar img')?.getAttribute('src');if(avatar)attributes.sellerAvatar=avatar;
    const img=box.querySelector('.sku-info-image')?.getAttribute('src');if(img)attributes.image=img;
    const title=get('.sku-info-name')||compact(box.querySelector('[data-offer-title],[class*="product-title" i],[class*="offer-title" i],h3,h2')?.textContent)||compact(a.getAttribute('aria-label'))||text;
    const seller=box.getAttribute('data-seller')||get('.sku-seller-name')||compact(box.querySelector('[class*="seller" i]')?.textContent)||null;
    offers.push({url:url.href,title,priceRaw:text.match(priceReg)?.[0]||'',seller,attributes,rawText:text});
  }
  const text=compact(root.innerText||root.textContent);
  const count=text.match(/(\d[\d,.]*)\s*(?:đã tìm thấy mục|mục được tìm thấy|items? found|ưu đãi|offers?)/i);
  return {offers,expected:count?Number(count[1].replace(/[,.]/g,'')):null};
})`;
const snapshotFunction = new Function(
  `return (${SNAPSHOT.replace('__PRICE__', JSON.stringify(PRICE_PATTERN))})`,
)() as () => {
  offers: Array<{
    url: string;
    title: string;
    priceRaw: string;
    seller: string | null;
    attributes: Record<string, string>;
    rawText: string;
  }>;
  expected: number | null;
};
const changedFunction = new Function(
  'previous',
  `const snapshot = (${SNAPSHOT.replace('__PRICE__', JSON.stringify(PRICE_PATTERN))});
   return snapshot.offers.map(offer => { const u = new URL(offer.url); u.search=''; u.hash=''; return u.href.replace(/\\/$/,''); }).sort().join('|') !== previous;`,
) as (previous: string) => boolean;

export async function marketplaceSnapshot(
  page: Page,
  parentUrl: string,
  currency: string | null,
) {
  const raw = await page.evaluate(snapshotFunction);
  return {
    expected: raw.expected,
    offers: raw.offers
      .map(row => ({
        ...row,
        url: cleanProductUrl(row.url)!,
        parentUrl,
        price: parsePrice(row.priceRaw, currency, 'marketplace'),
      }))
      .filter(row => row.url),
  };
}

export async function collectMarketplace(
  page: Page,
  cfg: GamsgoConfig,
  url: string,
  currency: string | null,
): Promise<{ offers: MarketplaceOffer[]; coverage: Coverage }> {
  const found = new Map<string, MarketplaceOffer>();
  const signatures = new Set<string>();
  let expected: number | null = null;
  let pages = 0;
  let terminal = false;
  const reasons: string[] = [];
  // Refresh SSR page 1 via the site's paginator. Cached SSR and live page 2
  // can have different orderings, which otherwise skips offers at the boundary.
  if (!cfg.offlineHtml) {
    const endpoint='https://mapi.gamsgo2.com/index/planList';
    await page.unroute(endpoint);
    await page.route(endpoint,async route=>{
      // The public endpoint supports 50 rows. Larger stable pages avoid
      // overlap caused by ranking changes between small pagination requests.
      let body;try{body=route.request().postDataJSON();}catch{}
      if(body && Number.isInteger(body.page) && typeof body.type_category_id==='string')
        await route.continue({postData:JSON.stringify({...body,limit:50})});
      else await route.continue();
    });
    const sort = page.getByRole('button', {name: /Sắp xếp theo/});
    if (cfg.marketplaceApiOnly && await sort.isVisible().catch(() => false)) {
      // Use the public UI's deterministic price sort. This also requests API
      // data for single-page listings that otherwise only render cached SSR.
      await sort.click();
      await page.getByText('Giá: thấp đến cao', {exact: true}).dispatchEvent('click');
      await page.waitForTimeout(cfg.detailSettleMs);
    } else {
    const second = page.locator('.v-pagination__item button').filter({ hasText: /^2$/ }).first();
    if (await second.isVisible().catch(() => false)) {
      await second.click();
      await page.waitForTimeout(cfg.detailSettleMs);
      const first = page.locator('.v-pagination__item button').filter({ hasText: /^1$/ }).first();
      await first.click();
      await page.waitForTimeout(cfg.detailSettleMs);
    }
    }
  }
  for (; pages < cfg.maxListingPages; ) {
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(cfg.offlineHtml ? 10 : cfg.detailSettleMs);
    const snap = await marketplaceSnapshot(page, url, currency);
    expected = snap.expected ?? expected;
    pages++;
    for (const offer of snap.offers) found.set(offer.url, offer);
    const signature = snap.offers
      .map(offer => offer.url)
      .sort()
      .join('|');
    if (signatures.has(signature)) {
      reasons.push('Pagination repeated the same offer set');
      break;
    }
    signatures.add(signature);
    if (expected !== null && found.size >= expected) {
      terminal = true;
      break;
    }
    const paginator = page.locator('.v-pagination__next button');
    const next = await paginator.count() ? paginator : page.locator(
      'a[rel="next"],button[aria-label*="next" i],button[aria-label*="tiếp" i],a[aria-label*="next" i],.el-pagination .btn-next,.ant-pagination-next button,.ant-pagination-next a,[data-next-page],button:has-text("Trang sau"),button:has-text("Xem thêm"),button:has-text("Load more")',
    );
    let target = null;
    for (let i = 0; i < (await next.count()); i++) {
      const candidate = next.nth(i);
      if (
        (await candidate.isVisible()) &&
        (await candidate.isEnabled()) &&
        (await candidate.getAttribute('aria-disabled')) !== 'true' &&
        !(await candidate.evaluate(
          el => !!el.closest('.disabled,.ant-pagination-disabled'),
        ))
      ) {
        target = candidate;
        break;
      }
    }
    if (!target) {
      terminal = true;
      break;
    }
    const href = await target.getAttribute('href');
    if (href && new URL(href, url).origin !== 'https://www.gamsgo.com') {
      reasons.push('Pagination points outside GamsGo');
      break;
    }
    await target.click();
    await page
      .waitForFunction(changedFunction, signature, {
        timeout: cfg.navigationTimeoutMs,
      })
      .catch(() => undefined);
    await page.waitForTimeout(cfg.offlineHtml ? 10 : cfg.delayMs);
  }
  if (!terminal && pages >= cfg.maxListingPages)
    reasons.push('Listing page limit reached');
  if (expected === null)
    reasons.push(
      'Total offer count not observable; completeness cannot be verified',
    );
  else if (found.size !== expected)
    reasons.push(`Expected ${expected} offers, captured ${found.size}`);
  if (!found.size) reasons.push('No priced offer cards found');
  if (!cfg.offlineHtml) await page.unroute('https://mapi.gamsgo2.com/index/planList');
  return {
    offers: [...found.values()],
    coverage: {
      kind: 'marketplace',
      complete: terminal && reasons.length === 0,
      reasons,
      pagesVisited: pages,
      expectedOffers: expected,
      discoveredOffers: found.size,
    },
  };
}
