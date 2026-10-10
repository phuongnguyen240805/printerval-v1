export interface GamsgoConfig {
  startUrl: string;
  baseUrl: string;
  outputDir: string;
  headless: boolean;
  locale: string;
  maxProducts: number;
  maxAttempts: number;
  concurrency: number;
  delayMs: number;
  retries: number;
  navigationTimeoutMs: number;
  listingSettleMs: number;
  detailSettleMs: number;
  maxScrolls: number;
  saveHtml: boolean;
  captureNetwork: boolean;
  capturePublicApiBodies: boolean;
  blockHeavyResources: boolean;
  respectRobots: boolean;
  resume: boolean;
  includeMarketplace: boolean;
  crawlAiNavigation: boolean;
  offlineHtml?: string;
  offlineDetailsDir?: string;
  cdpEndpoint?: string;
  reuseCdpContext?: boolean;
  marketplaceApiOnly?: boolean;
  maxListingPages: number;
  maxVariants: number;
  variantSettleMs: number;
  currencyHint: string | null;
}

export interface PriceInfo {
  raw: string;
  amount: number | null;
  currency: string | null;
  period: string | null;
  source: 'listing' | 'detail' | 'marketplace';
}

export interface ImageInfo {
  src: string;
  alt: string;
  srcset?: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface CatalogItem {
  url: string;
  slug: string;
  name: string;
  teaser: string;
  highlights: string[];
  price: PriceInfo | null;
  image: string | null;
  badge: string | null;
  confidence: 'card' | 'fallback';
}

export interface MarketplaceOffer {
  publicApiRow?: Record<string, unknown>;
  url: string;
  title: string;
  price: PriceInfo | null;
  parentUrl?: string;
  seller?: string | null;
  attributes?: Record<string, string>;
  rawText?: string;
}

export interface VariantQuote {
  selectionVerified?: boolean;
  sourceId: string;
  options: Record<string, string>;
  price: PriceInfo | null;
  renewalPrice?: PriceInfo | null;
  rawText: string;
  evidence: 'selected-dom' | 'offer-card' | 'offer-detail' | 'public-api';
}

export interface Coverage {
  kind: 'subscription' | 'marketplace' | 'offer';
  complete: boolean;
  reasons: string[];
  pagesVisited: number;
  expectedOffers?: number | null;
  discoveredOffers?: number;
}

export interface AiMenuItem {
  name: string;
  url: string;
  type: 'subscription' | 'marketplace';
}

export interface CatalogRecord {
  sourceUrl: string;
  finalUrl: string;
  fetchedAt: string;
  title: string;
  currency: string | null;
  productCount: number;
  products: CatalogItem[];
  marketplaceOffers: MarketplaceOffer[];
  aiNavigation: AiMenuItem[];
  linksInspected: number;
  scrolls: number;
  httpStatus?: number;
  rawHtmlPath?: string;
  extractionWarning?: string;
}

export interface ContentSection {
  level: number;
  heading: string;
  text: string;
}

export interface ProductDetail {
  sourceScope?: 'public-marketplace-api';
  offerDetails?: { attributes: Record<string,string>; description: string; descriptionHtml: string };
  publicCatalogData?: Array<{ url: string; data: unknown }>;
  requestedUrl: string;
  finalUrl: string;
  canonicalUrl: string;
  slug: string;
  title: string;
  documentTitle: string;
  description: string;
  intro: string;
  breadcrumb: string[];
  tags: string[];
  priceOnDetail: PriceInfo | null;
  listingPrice: PriceInfo | null;
  features: string[];
  sections: ContentSection[];
  planOptions: string[];
  images: ImageInfo[];
  media: Array<{ type: string; src: string }>;
  faqs: Array<{ question: string; answer: string; answerHtml?: string }>;
  jsonLd: unknown[];
  meta: Record<string, string>;
  contentHtml: string;
  contentText: string;
  crawl: {
    extractorVersion?: number;
    fetchedAt: string;
    status: number | null;
    elapsedMs: number;
    rawHtmlPath?: string;
    networkEntries: number;
    offline: boolean;
  };
  variants?: VariantQuote[];
  offers?: MarketplaceOffer[];
  coverage?: Coverage;
}

export interface NetworkRecord {
  pageUrl: string;
  method: string;
  resourceType: string;
  url: string;
  status: number;
  mimeType: string;
  at: string;
  publicApiJson?: unknown;
  bodyWarning?: string;
}

export interface CrawlSummary {
  startedAt: string;
  finishedAt: string;
  startUrl: string;
  offline: boolean;
  discoveredProducts: number;
  aiNavigationCount: number;
  queuedProductPages: number;
  marketplaceOffers: number;
  attempted: number;
  succeeded: number;
  errors: number;
  skippedCompleted: number;
  durationMs: number;
  warning?: string;
  coverageComplete?: boolean;
  variants?: number;
  childOffers?: number;
}
