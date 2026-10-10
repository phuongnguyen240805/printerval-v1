import type { MarketplaceOffer, NetworkRecord, ProductDetail } from './types.js';
import { cleanProductUrl } from './config.js';
import { parsePrice } from './price.js';

// Only the public planList response used by the visible marketplace paginator.
export function marketplaceApiOffers(entries: Array<Pick<NetworkRecord, 'url' | 'publicApiJson'>>, parentUrl: string): MarketplaceOffer[] {
  const found=new Map<string,MarketplaceOffer>();
  for(const entry of entries) {
    if(new URL(entry.url).hostname!=='mapi.gamsgo2.com'||new URL(entry.url).pathname!=='/index/planList')continue;
    const payload=entry.publicApiJson as { data?: { currency?: string; list?: Array<Record<string,unknown>> } } | undefined;
    if(!Array.isArray(payload?.data?.list))continue;
    for(const row of payload.data.list) {
      if(typeof row.type_plan_id!=='string')continue;
      const url=cleanProductUrl('https://www.gamsgo.com/vi/shop/'+row.type_plan_id);if(!url)continue;
      const text=(key:string)=>row[key]==null?'':String(row[key]);
      const meta=text('attribute_name'),parts=meta.split('-').map(value=>value.trim());
      const duration=parts.find(value=>/\d+\s*(ngày|tháng|năm|days?|months?|years?)/i.test(value))||'';
      const sharing=parts.find(value=>/truy cập|chia sẻ|dùng chung|riêng|chỗ ngồi|mã kích hoạt|shared|private|activation|seat/i.test(value))||'';
      const attrs:Record<string,string>={meta,duration,sharing,plan:parts.filter(value=>value!==duration&&value!==sharing).join(' · '),
        delivery:text('shipping_time_name')||text('shipping_time'),warranty:text('warranty_period'),
        rating:text('merchant_star_level'),positive:text('merchant_comment_rate'),reviews:text('merchant_comment_num'),
        sellerAvatar:text('merchant_avatar_url'),image:text('type_image'),availability:text('inventory_quantity'),
        inventory_quantity:text('inventory_quantity'),close_status:text('close_status')};
      const currency=payload.data.currency || (text('currency_icon1')==='₫'?'VND':null);
      found.set(url,{url,parentUrl,title:text('title'),seller:text('merchant_name'),attributes:attrs,publicApiRow:row,
        price:parsePrice(text('total_price')+' '+(currency||text('currency_icon1')),currency,'marketplace'),rawText:meta});
    }
  }
  return [...found.values()];
}

// This is an API offer record, not a claim that the shop detail page was visited.
export function marketplaceApiProduct(offer: MarketplaceOffer, offline = false): ProductDetail | null {
  if (!offer.publicApiRow) return null;
  const attrs = offer.attributes || {};
  const id = new URL(offer.url).pathname.split('/').pop()!;
  const reasons: string[] = [];
  if (!offer.title) reasons.push('API offer title missing');
  if (offer.price?.amount == null || !offer.price.currency) reasons.push('API offer price or currency missing');
  const options = Object.fromEntries(['duration', 'sharing', 'plan'].filter(key => attrs[key]).map(key => [key, attrs[key]]));
  if (!Object.keys(options).length) options.Gói = offer.title;
  return {
    sourceScope: 'public-marketplace-api', requestedUrl: offer.url, finalUrl: offer.url, canonicalUrl: offer.url,
    slug: id, title: offer.title, documentTitle: offer.title, description: '', intro: '', breadcrumb: [], tags: [],
    priceOnDetail: offer.price, listingPrice: offer.price, features: [], sections: [], planOptions: Object.values(options),
    images: attrs.image ? [{src: attrs.image, alt: offer.title}] : [], media: [], faqs: [], jsonLd: [],
    meta: {parentUrl: offer.parentUrl || '', seller: offer.seller || ''}, contentHtml: '', contentText: offer.rawText || '',
    offerDetails: {attributes: attrs, description: '', descriptionHtml: ''},
    publicCatalogData: [{url: 'https://mapi.gamsgo2.com/index/planList', data: offer.publicApiRow}],
    crawl: {extractorVersion: 5, fetchedAt: new Date().toISOString(), status: null, elapsedMs: 0, networkEntries: 1, offline},
    variants: [{sourceId: id, options, price: offer.price, rawText: offer.rawText || '', evidence: 'public-api', selectionVerified: true}],
    coverage: {kind: 'offer', complete: !reasons.length, reasons, pagesVisited: 0},
  };
}
