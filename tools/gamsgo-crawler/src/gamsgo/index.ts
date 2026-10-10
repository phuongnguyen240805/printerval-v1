#!/usr/bin/env node
import { loadGamsgoConfig } from './config.js';
import { runGamsgoCrawl } from './crawler.js';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
GamsGo AI public catalog crawler (Playwright/CDP, no login/session)
Usage:
  npm run crawl:gamsgo
  npm run crawl:gamsgo:test
  npx tsx src/gamsgo/index.ts --config config.gamsgo.json [flags]
Flags:
  --limit N              product-detail limit; 0 = all
  --max-attempts N       hard cap on product-detail requests
  --concurrency N        1..3 workers; default 1
  --delay MS             at least 350ms between products
  --scrolls N            max category scrolls
  --output DIR           output directory
  --headed               show browser window
  --no-resume            reset output directory
  --no-html              skip saving rendered HTML
  --no-network           skip public network metadata
  --api-bodies           opt-in: sanitized JSON bodies on public catalog/product API paths
  --no-media-block       fetch images/fonts/media during browser navigation
  --no-marketplace       omit optional marketplace offer cards
  --marketplace-api-only save child offers from public API; do not visit shop URLs
  --include-ai-menu      also crawl public AI menu detail/account pages
  --no-ai-menu           restrict discovery to visible AI category cards
  --cdp URL             local CDP endpoint; uses a fresh isolated context
  --reuse-cdp-context   use the existing browser context, keeping user tabs open
  --listing-pages N     maximum pages for each marketplace (default 100)
  --variants N          maximum option exploration states (default 200)
  --currency ISO        fallback only; never changes/converts observed prices
  --offline-html PATH    parse a previously saved category HTML without internet
  --offline-details DIR  load offline product HTML by slug (chatgpt.html etc.)
  --no-robots-check      disable the robots check (use only where authorized)
`);
} else {
  try {
    const cfg = await loadGamsgoConfig(process.argv.slice(2));
    console.log('[gamsgo] source=', cfg.startUrl, 'output=', cfg.outputDir);
    const summary = await runGamsgoCrawl(cfg);
    console.log('[gamsgo] finished', JSON.stringify(summary, null, 2));
    if (summary.errors || (!summary.offline && !summary.coverageComplete))
      process.exitCode = 2;
  } catch (err) {
    console.error('[gamsgo] fatal:', err);
    process.exitCode = 1;
  }
}
