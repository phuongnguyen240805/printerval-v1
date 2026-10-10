import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import type {
  CatalogRecord,
  CrawlSummary,
  GamsgoConfig,
  NetworkRecord,
  ProductDetail,
} from './types.js';

interface Completed {
  url: string;
  at: string;
}

export class GamsgoOutput {
  readonly directory: string;
  private chain = Promise.resolve();
  constructor(private readonly config: GamsgoConfig) {
    this.directory = resolve(config.outputDir);
  }
  async prepare(): Promise<Set<string>> {
    if (!this.config.resume) {
      // Reset owned output files only; never recursively delete a user-selected directory.
      for (const name of [
        'crawler-meta.json',
        'products.jsonl',
        'products.json',
        'completed.jsonl',
        'errors.jsonl',
        'network.jsonl',
        'catalog.json',
        'urls.json',
        'progress.json',
        'summary.json',
        'coverage-report.json',
        'printerval-ui-report.json',
        'medusa-products.json',
        'medusa-products.csv',
        'medusa-preview.json',
      ]) {
        await rm(join(this.directory, name), { force: true });
      }
    }
    await mkdir(join(this.directory, 'html'), { recursive: true });
    const manifestPath = join(this.directory, 'crawler-meta.json');
    const manifest = await readFile(manifestPath, 'utf8')
      .then(v => JSON.parse(v) as { schemaVersion: number })
      .catch(() => null);
    if (manifest && manifest.schemaVersion !== 2)
      throw new Error(
        'Incompatible GamsGo output format; use --no-resume or a different output dir',
      );
    if (!manifest)
      await writeFile(
        manifestPath,
        JSON.stringify(
          {
            schemaVersion: 2,
            engine: this.config.cdpEndpoint ? 'playwright-cdp' : 'playwright',
            target: 'gamsgo-vi-ai',
            createdAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
    const done = new Set<string>();
    if (this.config.resume) {
      const lines = await readFile(
        join(this.directory, 'products.jsonl'),
        'utf8',
      ).catch(() => '');
      for (const line of lines.split(/\r?\n/)) {
        try {
          const entry = JSON.parse(line) as ProductDetail;
          if (entry.requestedUrl) done.delete(entry.requestedUrl);
          if (
            entry.requestedUrl &&
            entry.crawl.extractorVersion === 5 &&
            (!this.config.marketplaceApiOnly || entry.coverage?.kind !== 'marketplace' || entry.offers?.every(offer => !!offer.publicApiRow)) &&
            entry.coverage?.complete &&
            (entry.coverage.kind === 'marketplace' || (entry.variants?.length && entry.variants.every(quote => quote.selectionVerified === true))) &&
            entry.crawl.offline === Boolean(this.config.offlineHtml)
          )
            done.add(entry.requestedUrl);
        } catch {}
      }
    }
    return done;
  }
  async html(url: string, content: string): Promise<string> {
    const safe =
      basename(new URL(url).pathname)
        .replace(/[^a-z0-9_-]/gi, '-')
        .slice(0, 70) || 'index';
    const digest = createHash('sha256').update(url).digest('hex').slice(0, 12);
    const rel = `html/${safe}-${digest}.html`;
    await writeFile(join(this.directory, rel), content, 'utf8');
    return rel;
  }
  async records(): Promise<ProductDetail[]> {
    const lines = await readFile(
      join(this.directory, 'products.jsonl'),
      'utf8',
    ).catch(() => '');
    const unique = new Map<string, ProductDetail>();
    for (const line of lines.split(/\r?\n/)) {
      try {
        const record = JSON.parse(line) as ProductDetail;
        if (record.requestedUrl) unique.set(record.requestedUrl, record);
      } catch {}
    }
    return [...unique.values()];
  }
  async catalog(record: CatalogRecord): Promise<void> {
    await writeFile(
      join(this.directory, 'catalog.json'),
      JSON.stringify(record, null, 2),
      'utf8',
    );
    await writeFile(
      join(this.directory, 'urls.json'),
      JSON.stringify(
        {
          source: record.sourceUrl,
          generatedAt: record.fetchedAt,
          count: record.products.length,
          urls: record.products.map(p => p.url),
        },
        null,
        2,
      ),
      'utf8',
    );
  }
  async urls(urls: string[], includeMenu: boolean): Promise<void> {
    await writeFile(
      join(this.directory, 'urls.json'),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          includeAiMenu: includeMenu,
          count: urls.length,
          urls,
        },
        null,
        2,
      ),
      'utf8',
    );
  }
  async product(record: ProductDetail): Promise<void> {
    await this.enqueue(async () => {
      await appendFile(
        join(this.directory, 'products.jsonl'),
        JSON.stringify(record) + '\n',
        'utf8',
      );
      await appendFile(
        join(this.directory, 'completed.jsonl'),
        JSON.stringify({
          url: record.requestedUrl,
          at: record.crawl.fetchedAt,
        }) + '\n',
        'utf8',
      );
    });
  }
  async network(records: NetworkRecord[]): Promise<void> {
    if (!records.length) return;
    await this.enqueue(() =>
      appendFile(
        join(this.directory, 'network.jsonl'),
        records.map(e => JSON.stringify(e)).join('\n') + '\n',
        'utf8',
      ),
    );
  }
  async progress(progress: Record<string, unknown>): Promise<void> {
    await this.enqueue(() =>
      writeFile(
        join(this.directory, 'progress.json'),
        JSON.stringify(progress, null, 2),
        'utf8',
      ),
    );
  }
  async error(url: string, error: unknown, attempts: number): Promise<void> {
    await this.enqueue(() =>
      appendFile(
        join(this.directory, 'errors.jsonl'),
        JSON.stringify({
          url,
          at: new Date().toISOString(),
          attempts,
          message: error instanceof Error ? error.message : String(error),
        }) + '\n',
        'utf8',
      ),
    );
  }
  async summary(summary: CrawlSummary): Promise<void> {
    await this.chain;
    await writeFile(
      join(this.directory, 'summary.json'),
      JSON.stringify({ summary, config: this.config }, null, 2),
      'utf8',
    );
    const products = await readFile(
      join(this.directory, 'products.jsonl'),
      'utf8',
    ).catch(() => '');
    const uniq = new Map<string, ProductDetail>();
    for (const line of products.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const product = JSON.parse(line) as ProductDetail;
        uniq.set(product.requestedUrl, product);
      } catch {}
    }
    await writeFile(
      join(this.directory, 'products.json'),
      JSON.stringify([...uniq.values()], null, 2),
      'utf8',
    );
  }
  private enqueue(operation: () => Promise<unknown>): Promise<void> {
    this.chain = this.chain.then(
      async () => {
        await operation();
      },
      async () => {
        await operation();
      },
    );
    return this.chain;
  }
}
