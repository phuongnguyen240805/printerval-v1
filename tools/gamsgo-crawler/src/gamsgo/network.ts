import type { Page, Response } from 'playwright';
import type { NetworkRecord } from './types.js';

const PRIVATE_ROUTE =
  /(?:^|[\/_.-])(?:auth|login|logout|session|captcha|challenge|checkout|payment|pay|cart|users?|orders?|profile|address|personal|wallet|billing|coupon|email|phone|verify|2fa|oauth)(?:[\/_.-]|$)/i;
const PUBLIC_ROUTE =
  /(?:product|goods|spu|sku|catalog|categor|home|recommend|prices?|details?|subscription|accounts|offers|seller|planList|webpage\/questions)/i;
const PRIVATE_KEY =
  /^(?:.*token|.*secret|password|passkey|authorization|cookie|session|csrf|email|phone|address|card_number|cardNumber|cvv|payment_method|access_key|refresh|jwt|otp|device|fingerprint)$/i;
const QUERY_ALLOWLIST = new Set([
  'category_id',
  'page',
  'size',
  'limit',
  'lang',
  'locale',
  'product_id',
  'goods_id',
  'spu_id',
  'sku_id',
  'id',
]);

function safeUrl(input: string): string {
  try {
    const url = new URL(input);
    const entries = [...url.searchParams.entries()].filter(([key]) =>
      QUERY_ALLOWLIST.has(key.toLowerCase()),
    );
    url.search = '';
    for (const [k, v] of entries) url.searchParams.append(k, v.slice(0, 80));
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

function scrub(value: unknown, depth = 0): unknown {
  if (depth > 20) return '[truncated:depth]';
  if (Array.isArray(value)) return value.map(x => scrub(x, depth + 1));
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return Object.fromEntries(
      entries
        .filter(([key]) => !PRIVATE_KEY.test(key))
        .map(([key, val]) => [key, scrub(val, depth + 1)]),
    );
  }
  if (typeof value === 'string')
    return value.length > 100000
      ? value.slice(0, 100000) + '[truncated:string]'
      : value;
  return value;
}

export class PublicNetworkCollector {
  private records: NetworkRecord[] = [];
  private pending: Promise<void>[] = [];
  private activeUrl = '';
  private active = false;

  constructor(private readonly captureBodies: boolean) {}

  attach(page: Page): void {
    if (this.active) return;
    this.active = true;
    page.on('response', (response: Response) => {
      const req = response.request();
      const type = req.resourceType();
      if (type !== 'document' && type !== 'xhr' && type !== 'fetch') return;
      const url = new URL(response.url());
      if (
        !['www.gamsgo.com', 'api.gamsgo.com', 'api.gamsgo2.com', 'mapi.gamsgo2.com'].includes(url.hostname) ||
        PRIVATE_ROUTE.test(url.pathname)
      )
        return;
      const mimeType = response.headers()['content-type'] || '';
      const record: NetworkRecord = {
        pageUrl: this.activeUrl,
        method: req.method(),
        resourceType: type,
        url: safeUrl(response.url()),
        status: response.status(),
        mimeType: mimeType.slice(0, 100),
        at: new Date().toISOString(),
      };
      this.records.push(record);
      if (
        !this.captureBodies ||
        !PUBLIC_ROUTE.test(url.pathname) ||
        type === 'document' ||
        !/json/i.test(mimeType)
      )
        return;
      const length = Number(response.headers()['content-length'] || 0);
      if (response.status() >= 400) return;
      if (length > 8_000_000) {
        record.bodyWarning = 'Public JSON body exceeds 8 MB; omitted';
        return;
      }
      const pending = response
        .body()
        .then(bytes => {
          if (bytes.byteLength > 8_000_000) {
            record.bodyWarning = 'Public JSON body exceeds 8 MB; omitted';
            return;
          }
          try {
            record.publicApiJson = scrub(JSON.parse(bytes.toString('utf8')));
          } catch {
            /* Ignore non-JSON. */
          }
        })
        .catch(() => undefined);
      this.pending.push(pending);
    });
  }

  begin(url: string): void {
    this.activeUrl = url;
    this.records = [];
    this.pending = [];
  }

  async complete(): Promise<NetworkRecord[]> {
    await Promise.allSettled(this.pending);
    return this.records.filter(entry => entry.pageUrl === this.activeUrl);
  }
}
