import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { GamsgoConfig } from './types.js';

const DEFAULTS: GamsgoConfig = {
  startUrl: 'https://www.gamsgo.com/vi?category_id=ai',
  baseUrl: 'https://www.gamsgo.com',
  outputDir: 'output/gamsgo-ai',
  headless: true,
  locale: 'vi-VN',
  maxProducts: 0,
  maxAttempts: 0,
  concurrency: 1,
  delayMs: 900,
  retries: 1,
  navigationTimeoutMs: 45000,
  listingSettleMs: 1700,
  detailSettleMs: 1200,
  maxScrolls: 8,
  saveHtml: true,
  captureNetwork: true,
  capturePublicApiBodies: true,
  blockHeavyResources: true,
  respectRobots: true,
  resume: true,
  includeMarketplace: true,
  crawlAiNavigation: true,
  maxListingPages: 100,
  maxVariants: 200,
  variantSettleMs: 600,
  currencyHint: null,
};

const flagValue = (args: string[], flag: string): string | undefined => {
  const n = args.lastIndexOf(flag);
  return n >= 0 ? args[n + 1] : undefined;
};

export async function loadGamsgoConfig(args: string[]): Promise<GamsgoConfig> {
  const configFile = flagValue(args, '--config');
  const fromFile: Partial<GamsgoConfig> = configFile
    ? (JSON.parse(
        await readFile(resolve(configFile), 'utf8'),
      ) as Partial<GamsgoConfig>)
    : {};
  const cfg: GamsgoConfig = { ...DEFAULTS, ...fromFile };
  const values: Array<[keyof GamsgoConfig, string]> = [
    ['startUrl', '--url'],
    ['outputDir', '--output'],
    ['locale', '--locale'],
    ['offlineHtml', '--offline-html'],
    ['offlineDetailsDir', '--offline-details'],
    ['cdpEndpoint', '--cdp'],
    ['currencyHint', '--currency'],
  ];
  for (const [key, flag] of values) {
    const value = flagValue(args, flag);
    if (value !== undefined)
      (cfg as unknown as Record<string, unknown>)[key] = value;
  }
  const numbers: Array<[keyof GamsgoConfig, string, number, number]> = [
    ['maxProducts', '--limit', 0, 10000],
    ['maxAttempts', '--max-attempts', 0, 10000],
    ['concurrency', '--concurrency', 1, 3],
    ['delayMs', '--delay', 350, 30000],
    ['maxScrolls', '--scrolls', 0, 50],
    ['maxListingPages', '--listing-pages', 1, 1000],
    ['maxVariants', '--variants', 1, 2000],
  ];
  for (const [key, flag, min, max] of numbers) {
    const value = flagValue(args, flag);
    if (value !== undefined) {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
        throw new Error(`${flag} must be an integer in ${min}..${max}`);
      }
      (cfg as unknown as Record<string, unknown>)[key] = parsed;
    }
  }
  if (args.includes('--headed')) cfg.headless = false;
  if (args.includes('--marketplace-api-only')) cfg.marketplaceApiOnly = true;
  if (args.includes('--reuse-cdp-context')) cfg.reuseCdpContext = true;
  if (cfg.reuseCdpContext && !cfg.cdpEndpoint)
    throw new Error('--reuse-cdp-context requires --cdp for a user-opened browser');
  if (args.includes('--no-resume')) cfg.resume = false;
  if (args.includes('--no-html')) cfg.saveHtml = false;
  if (args.includes('--no-network')) cfg.captureNetwork = false;
  if (args.includes('--api-bodies')) cfg.capturePublicApiBodies = true;
  if (args.includes('--no-media-block')) cfg.blockHeavyResources = false;
  if (args.includes('--no-marketplace')) cfg.includeMarketplace = false;
  if (args.includes('--include-ai-menu')) cfg.crawlAiNavigation = true;
  if (args.includes('--no-ai-menu')) cfg.crawlAiNavigation = false;
  if (args.includes('--no-robots-check')) cfg.respectRobots = false;
  if (cfg.marketplaceApiOnly && (!cfg.captureNetwork || !cfg.capturePublicApiBodies))
    throw new Error('marketplaceApiOnly requires captureNetwork and capturePublicApiBodies');

  const start = new URL(cfg.startUrl);
  const base = new URL(cfg.baseUrl);
  if (
    base.origin !== 'https://www.gamsgo.com' ||
    start.origin !== base.origin
  ) {
    throw new Error('Only the public www.gamsgo.com origin is allowed');
  }
  if (
    start.pathname !== '/vi' ||
    start.searchParams.get('category_id') !== 'ai'
  ) {
    throw new Error('startUrl must be /vi?category_id=ai');
  }
  const dir = resolve(cfg.outputDir);
  if (dir === resolve('.') || dir === resolve('/') || dir === resolve('..')) {
    throw new Error('Unsafe output directory');
  }
  cfg.outputDir = dir;
  for (const [key, , min, max] of numbers) {
    const value = cfg[key];
    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < min ||
      value > max
    )
      throw new Error(`Invalid config ${key}`);
  }
  if (cfg.currencyHint && !/^[A-Z]{3}$/.test(cfg.currencyHint))
    throw new Error('currency must be an ISO code such as VND, USD or JPY');
  if (cfg.cdpEndpoint) {
    const endpoint = new URL(cfg.cdpEndpoint);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(endpoint.hostname))
      throw new Error('CDP endpoint must be local');
  }
  return cfg;
}

export const isAllowedProductUrl = (input: string): boolean => {
  try {
    const url = new URL(input, 'https://www.gamsgo.com');
    return (
      url.origin === 'https://www.gamsgo.com' &&
      /^\/vi\/(?:details|accounts|shop|product)\/[a-z0-9][a-z0-9_-]*\/?$/i.test(
        url.pathname,
      )
    );
  } catch {
    return false;
  }
};

export const cleanProductUrl = (input: string): string | null => {
  if (!isAllowedProductUrl(input)) return null;
  const url = new URL(input, 'https://www.gamsgo.com');
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.replace(/\/$/, '');
  return url.toString();
};
