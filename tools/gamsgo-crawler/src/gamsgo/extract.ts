import type { Page } from 'playwright';
import type {
  CatalogItem,
  CatalogRecord,
  ImageInfo,
  MarketplaceOffer,
  ProductDetail,
} from './types.js';
import { cleanProductUrl } from './config.js';
import { parsePrice, PRICE_PATTERN } from './price.js';
export { parsePrice } from './price.js';

interface ListingRaw {
  title: string;
  currency: string | null;
  linksInspected: number;
  products: Array<{
    url: string;
    name: string;
    teaser: string;
    highlights: string[];
    priceRaw: string;
    image: string | null;
    badge: string | null;
    confidence: 'card' | 'fallback';
  }>;
  marketplace: Array<{ url: string; title: string; priceRaw: string }>;
  aiNavigation: Array<{
    name: string;
    url: string;
    type: 'subscription' | 'marketplace';
  }>;
}

// Raw browser-side JavaScript deliberately avoids TSX's injected __name helpers.
const LISTING_JS = String.raw`(() => {
  const compact = s => (s || '').replace(/\s+/g, ' ').trim();
  const priceRegex = new RegExp(__PRICE__, 'ig');
  const firstPrice = s => {
    const all = [...compact(s).matchAll(priceRegex)].map(m => m[0]);
    return all.find(s => /(?:tháng|month|mo)/i.test(s)) || all[0] || '';
  };
  const valid = u => {
    try { return /^\/vi\/(?:details|accounts)\/[a-z0-9][a-z0-9_-]*\/?$/i.test(new URL(u, location.href).pathname); }
    catch { return false; }
  };
  const anchorVisible = a => {
    const css = getComputedStyle(a);
    return css.display !== 'none' && css.visibility !== 'hidden' && !a.closest('[hidden],[aria-hidden="true"]');
  };
  const excluded = a => !!a.closest('header,nav,footer,aside,[role="navigation"],[role="menu"]');
  const imgSrc = e => {
    const img = e?.querySelector('img');
    if (!img) return null;
    const raw = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('src') || img.currentSrc || '';
    if (!raw || raw.startsWith('data:')) return null;
    try {return new URL(raw, document.baseURI).href;} catch {return null;}
  };
  const nameFrom = (a, box, url) => {
    const card=a.closest('.home-catalog__product');
    if(card?.querySelector('img[alt]'))return compact(card.querySelector('img[alt]').getAttribute('alt'));
    let name = compact(a.querySelector('h2,h3,h4,h5,[class*="title" i],[class*="name" i]')?.textContent);
    if (!name) name = compact(box?.querySelector('h2,h3,h4,[class*="product-name" i]')?.textContent);
    if (!name) name = compact(a.querySelector('img[alt]')?.getAttribute('alt'));
    if (!name) name = compact(a.textContent).replace(priceRegex, '').slice(0, 115);
    if (!name || name.length > 115) name = new URL(url, location.href).pathname.split('/').pop() || 'Unknown';
    return name;
  };
  const anchors = [...document.querySelectorAll('a[href]')];
  const products = [];
  const seen = new Set();
  for (const a of anchors) {
    if (!valid(a.href) || excluded(a) || !anchorVisible(a)) continue;
    let box = a.closest('.home-catalog__product');
    let current = a;
    for (let depth = 0; !box && depth < 6 && current; depth++, current = current.parentElement) {
      const rawText = compact(current.innerText || current.textContent);
      if (rawText.length > 1900) break;
      if (firstPrice(rawText) && (depth > 0 || rawText.length > 12)) { box = current; break; }
    }
    if (!box) continue;
    const url = new URL(a.href, location.href).href;
    if (seen.has(url)) continue;
    seen.add(url);
    const text = compact(box.innerText || box.textContent);
    const highlights = [...box.querySelectorAll('li')].map(x => compact(x.innerText || x.textContent)).filter(x => x.length > 9 && x.length < 430).slice(0, 12);
    const firstLine = compact(a.textContent).slice(0, 500);
    const teaser = highlights[0] || compact(box.querySelector('p')?.textContent) || firstLine.replace(priceRegex, '').slice(0, 450);
    const badge = compact(box.querySelector('[class*="badge" i],[class*="tag" i]')?.textContent).slice(0, 90) || null;
    const priceElement = box.querySelector('.third-card__plan-price');
    products.push({url, name: nameFrom(a, box, url), teaser, highlights, priceRaw: priceElement ? firstPrice(priceElement.textContent) : firstPrice(text), image: imgSrc(box), badge, confidence:'card'});
  }
  // Last-resort discovery: only links in main and never header/menu links.
  if (products.length === 0) {
    for (const a of [...document.querySelectorAll('main a[href], [role="main"] a[href]')]) {
      if (!valid(a.href) || excluded(a) || !anchorVisible(a)) continue;
      const url = new URL(a.href, location.href).href;
      if (seen.has(url)) continue;
      seen.add(url);
      products.push({url, name:nameFrom(a,a,url), teaser:'', highlights:[], priceRaw:'', image:imgSrc(a), badge:null, confidence:'fallback'});
    }
  }
  const market = [];
  const marketSeen = new Set();
  const marketHeadings = [...document.querySelectorAll('h2,h3,h4')].filter(h => /^(Thị trường|Marketplace|Market)(?:\s*🛒)?$/i.test(compact(h.textContent)));
  for (const heading of marketHeadings) {
    let container = heading.parentElement;
    for (let k=0;k<3 && container;k++,container=container.parentElement) {
      const offers = [...container.querySelectorAll('a[href]')].filter(a => !excluded(a) && anchorVisible(a) && !valid(a.href) && firstPrice(a.innerText || a.textContent));
      if (offers.length > 0 && offers.length < 120) {
        for (const a of offers) {
          const url = new URL(a.href, location.href).href;
          if (marketSeen.has(url) || !url.startsWith('https://www.gamsgo.com/')) continue;
          marketSeen.add(url);
          market.push({url, title:compact(a.textContent).slice(0,350), priceRaw:firstPrice(a.innerText || a.textContent)});
        }
        break;
      }
    }
  }
  const aiKnownNames = new Set([
    'chatgpt','gemini','suno','midjourney','perplexity ai','grok','claude','kling ai',
    'runway','elevenlabs','gama ai','higgsfield','poe','genspark','dreamina','meshy',
    'cursor','v0','openart','lumina','github copilot','windows copilot','leonardo ai',
    'hailuo ai','luma','invideo ai',
  ]);
  const aiNavigation = [];
  const aiSeen = new Set();
  let insideAiMenu = false;
  for (const a of anchors) {
    const name = compact(a.innerText || a.textContent);
    const link = new URL(a.href, document.baseURI);
    if (link.pathname === '/vi' && link.searchParams.has('category_id')) {
      insideAiMenu = link.searchParams.get('category_id') === 'ai';
      continue;
    }
    if (!insideAiMenu && !aiKnownNames.has(name.toLowerCase())) continue;
    if (!/\/vi\/(?:details|accounts)\//i.test(a.href)) continue;
    const url = new URL(a.href, document.baseURI);
    if (url.origin !== 'https://www.gamsgo.com') continue;
    url.search = ''; url.hash = '';
    if (aiSeen.has(url.href)) continue;
    aiSeen.add(url.href);
    aiNavigation.push({name,url:url.href,type:url.pathname.includes('/accounts/')?'marketplace':'subscription'});
  }
  const head = compact(document.body?.innerText).slice(0,50000);
  const detected = head.match(/\b(?:VI|EN|FR|DE)\s*[|/]\s*(USD|VND|JPY|KRW|EUR|GBP)\b/i);
  const currency = detected ? detected[1].toUpperCase() : null;
  return {title:document.title,currency,linksInspected:anchors.length,products,marketplace:market,aiNavigation};
})`;

interface DetailRaw {
  finalUrl: string;
  canonicalUrl: string;
  title: string;
  documentTitle: string;
  description: string;
  intro: string;
  breadcrumb: string[];
  tags: string[];
  priceRaw: string;
  features: string[];
  sections: Array<{ level: number; heading: string; text: string }>;
  planOptions: string[];
  images: ImageInfo[];
  media: Array<{ type: string; src: string }>;
  faqs: Array<{ question: string; answer: string }>;
  jsonLd: unknown[];
  meta: Record<string, string>;
  contentHtml: string;
  contentText: string;
}
const DETAIL_JS = String.raw`(() => {
  const compact = s => (s || '').replace(/\s+/g, ' ').trim();
  const absolute = src => {try {return new URL(src, document.baseURI).href;} catch {return '';}};
  const docTitle = document.title;
  const metaText = key => document.querySelector('meta[name="'+key+'"],meta[property="'+key+'"]')?.getAttribute('content') || '';
  const root = document.querySelector('main,[role="main"]') || document.body;
  const h1 = root.querySelector('h1') || document.querySelector('h1');
  const title = compact(h1?.textContent) || compact(metaText('og:title')) || docTitle;
  const description = compact(metaText('description')) || compact(metaText('og:description'));
  const introCandidates = h1?.parentElement?.parentElement || root;
  const intro = [...introCandidates.querySelectorAll('p')].map(e=>compact(e.textContent)).find(t=>t.length >= 40 && t.length < 1200) || description;
  const priceReg = new RegExp(__PRICE__, 'ig');
  const priceRaw = [...(h1?.parentElement?.parentElement?.innerText || '').matchAll(priceReg)].map(m=>m[0])[0] || '';
  const images = [];
  const imageSeen = new Set();
  for (const img of [...root.querySelectorAll('img')]) {
    const raw = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('src') || img.currentSrc || '';
    if (!raw || raw.startsWith('data:')) continue;
    const src = absolute(raw);
    if (!src || imageSeen.has(src)) continue;
    imageSeen.add(src);
    images.push({src,alt:compact(img.alt),...(img.getAttribute('srcset') ? {srcset:img.getAttribute('srcset')} : {}),...(img.title?{title:img.title}:{}),...(img.getAttribute('width')?{width:Number(img.getAttribute('width'))}:{}),...(img.getAttribute('height')?{height:Number(img.getAttribute('height'))}:{})});
  }
  const features = [...root.querySelectorAll('li')].map(li=>compact(li.textContent)).filter(s=>s.length >= 12 && s.length <= 460).filter((s,i,a)=>a.indexOf(s)===i).slice(0,120);
  const sections = [];
  for (const heading of [...root.querySelectorAll('h2,h3,h4')]) {
    const level = Number(heading.tagName[1]);
    const text = compact(heading.textContent);
    if (!text || text.length > 220) continue;
    let next = heading.nextElementSibling;
    let sectionText = '';
    for (; next;next=next.nextElementSibling) {
      if (/^H[234]$/.test(next.tagName) || next.querySelector('h2,h3')) break;
      sectionText += ' '+compact(next.innerText || next.textContent);
    }
    sections.push({level,heading:text,text:compact(sectionText)});
  }
  const opts = new Set();
  const optionAreas = [...root.querySelectorAll('[role="radiogroup"],[role="listbox"],[class*="sku" i],[class*="plan" i],[class*="package" i],[class*="period" i]')].filter(el=>compact(el.innerText).length<1800).slice(0,45);
  for (const area of optionAreas) for (const el of [...area.querySelectorAll('button,label,[role="radio"],[role="option"],[role="tab"]')]) {
    const label=compact(el.textContent);
    if (label && label.length<110 && !/(buy now|mua ngay|thanh toán|pay now|add to cart|đăng nhập)/i.test(label)) opts.add(label);
  }
  const faqs=[];
  for (const block of [...root.querySelectorAll('details')]) {
    const question=compact(block.querySelector('summary')?.textContent);
    const answer=compact(block.textContent).slice(question.length).trim();
    if (question) faqs.push({question,answer});
  }
  const breadcrumb = [...document.querySelectorAll('[aria-label*="breadcrumb" i] a,nav[class*="breadcrumb" i] a,[class*="breadcrumb" i] a')].map(a=>compact(a.textContent)).filter(Boolean).slice(0,20);
  const tags = [...(h1?.parentElement?.parentElement || root).querySelectorAll('[class*="tag" i],[class*="badge" i]')].map(x=>compact(x.textContent)).filter(x=>x.length<80).slice(0,25);
  const jsonLd=[];
  for (const node of [...document.querySelectorAll('script[type="application/ld+json"]')]) {try {jsonLd.push(JSON.parse(node.textContent || 'null'));}catch{}}
  const media = [...root.querySelectorAll('video[src],audio[src],iframe[src],source[src]')].map(x=>({type:x.tagName.toLowerCase(),src:absolute(x.getAttribute('src') || '')})).filter(x=>/^https?:/.test(x.src)).slice(0,40);
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || location.href;
  const meta={description,ogTitle:metaText('og:title'),ogImage:metaText('og:image'),robots:metaText('robots')};
  const cleanRoot = root.cloneNode(true);
  for (const n of [...cleanRoot.querySelectorAll('script,style,noscript,nav,header,footer,form')]) n.remove();
  return {
    finalUrl:location.href,canonicalUrl:absolute(canonical),title,documentTitle:docTitle,description,intro,breadcrumb,tags,priceRaw,
    features,sections,planOptions:[...opts].slice(0,70),images,media,faqs,jsonLd,meta,
    contentHtml:cleanRoot.innerHTML,contentText:compact(cleanRoot.innerText || cleanRoot.textContent)
  };
})`;

const listingFunction = new Function(
  `return (${LISTING_JS.replace('__PRICE__', JSON.stringify(PRICE_PATTERN))})`,
)() as () => ListingRaw;
const detailFunction = new Function(
  `return (${DETAIL_JS.replace('__PRICE__', JSON.stringify(PRICE_PATTERN))})`,
)() as () => DetailRaw;

export async function extractCatalog(
  page: Page,
  cfg: {
    startUrl: string;
    currencyHint?: string | null;
    includeMarketplace: boolean;
  },
  status?: number,
): Promise<CatalogRecord> {
  const raw = await page.evaluate(listingFunction);
  const currency = raw.currency || cfg.currencyHint || null;
  const seen = new Set<string>();
  const products: CatalogItem[] = [];
  for (const item of raw.products) {
    const url = cleanProductUrl(item.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    products.push({
      url,
      slug: new URL(url).pathname.split('/').pop() || '',
      name: item.name,
      teaser: item.teaser,
      highlights: item.highlights,
      image: item.image,
      badge: item.badge,
      confidence: item.confidence,
      price: parsePrice(item.priceRaw, currency, 'listing'),
    });
  }
  const marketplaceOffers: MarketplaceOffer[] = cfg.includeMarketplace
    ? raw.marketplace.map(o => ({
        url: o.url,
        title: o.title,
        price: parsePrice(o.priceRaw, currency, 'marketplace'),
      }))
    : [];
  return {
    sourceUrl: cfg.startUrl,
    finalUrl: page.url(),
    fetchedAt: new Date().toISOString(),
    title: raw.title,
    currency,
    productCount: products.length,
    products,
    marketplaceOffers,
    aiNavigation: raw.aiNavigation,
    linksInspected: raw.linksInspected,
    scrolls: 0,
    httpStatus: status,
    ...(!products.length
      ? {
          extractionWarning:
            'No product cards detected. Check if the page rendered correctly or if markup changed.',
        }
      : {}),
  };
}

export async function extractProduct(
  page: Page,
  product: CatalogItem,
  status: number | null,
  elapsedMs: number,
  currencyHint: string | null,
  offline: boolean,
): Promise<ProductDetail> {
  const raw = await page.evaluate(detailFunction);
  const canonicalUrl = cleanProductUrl(raw.canonicalUrl) || product.url;
  return {
    requestedUrl: product.url,
    finalUrl: offline ? product.url : raw.finalUrl,
    canonicalUrl,
    slug: product.slug,
    title: raw.title,
    documentTitle: raw.documentTitle,
    description: raw.description,
    intro: raw.intro,
    breadcrumb: raw.breadcrumb,
    tags: raw.tags,
    priceOnDetail: parsePrice(raw.priceRaw, currencyHint, 'detail'),
    listingPrice: product.price,
    features: raw.features,
    sections: raw.sections,
    planOptions: raw.planOptions,
    images: raw.images,
    media: raw.media,
    faqs: raw.faqs,
    jsonLd: raw.jsonLd,
    meta: raw.meta,
    contentHtml: raw.contentHtml,
    contentText: raw.contentText,
    crawl: {
      extractorVersion: 5,
      fetchedAt: new Date().toISOString(),
      status,
      elapsedMs,
      networkEntries: 0,
      offline,
    },
  };
}
