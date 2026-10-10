export type CatalogCategory =
  | "all"
  | "svod"
  | "ai"
  | "software"
  | "music"
  | "gaming"
  | "marketplace"
  | "topup"
  | "new";

export interface MarketplaceOffer {
  id: string;
  title: string;
  price: number;
  currencyCode?: string;
  hasPrice?: boolean;
}

export interface AiVariant extends MarketplaceOffer {
  duration?: string;
}

export interface AiProduct {
  id: string;
  handle?: string;
  name: string;
  category: Exclude<CatalogCategory, "all">;
  logo: string;
  price: number;
  currencyCode?: string;
  hasPrice?: boolean;
  duration?: string;
  badge?: string;
  type: "official" | "marketplace";
  features: string[];
  description?: string;
  tags?: string[];
  joinedText?: string;
  offerCount?: number;
  offers?: MarketplaceOffer[];
  variants?: AiVariant[];
  detailSlug?: string;
  isNew?: boolean;
}

export interface DetailOffer {
  id: string;
  meta: string;
  title: string;
  seller: string;
  sellerAvatar?: string;
  rating: number | null;
  positive: string;
  reviews: string;
  price: number;
  currencyCode?: string;
  hasPrice?: boolean;
  delivery: string;
  warranty: string;
  availability: string;
  duration: string;
  sharing: string;
  plan: string;
}

export interface FilterItem {
  label: string;
  count?: number;
}
export interface AccountDetailData {
  slug: string;
  name: string;
  title: string;
  logo: string;
  resultCount: number;
  warning: string;
  filters: Array<{ title: string; items: FilterItem[] }>;
  offers: DetailOffer[];
  introTitle: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: Array<{ title?: string; text: string }>;
  }>;
}

export interface AiCatalog {
  products: AiProduct[];
  details: Record<string, AccountDetailData>;
}

export interface StoreVariant {
  id: string;
  title?: string | null;
  metadata?: Record<string, unknown> | null;
  calculated_price?: {
    calculated_amount?: number | null;
    currency_code?: string | null;
  } | null;
}
export interface StoreProduct {
  id: string;
  title: string;
  handle?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  metadata?: Record<string, unknown> | null;
  images?: Array<{ url: string }>;
  variants?: StoreVariant[];
}
