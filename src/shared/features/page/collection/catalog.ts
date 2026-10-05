import type { HttpTypes } from '@medusajs/types';
import { categories as navigationCategories } from '@/shared/layout/header/data';

export type CatalogProduct = HttpTypes.StoreProduct;
export type CatalogCategory = { handle: string; name: string; count: number };
export type CatalogSort = 'relevant' | 'newest' | 'price-asc' | 'price-desc';

const aliases: Record<string, string> = {
  'custom-tshirts': 't-shirt', 't-shirts': 't-shirt', tshirt: 't-shirt',
  'custom-mugs': 'mug', 'custom-tumblers': 'tumbler',
  'custom-sweatshirts': 'sweatshirt', 'custom-posters': 'poster',
  'custom-doormats': 'doormat', 'custom-metal-signs': 'metal-sign',
  'custom-ornaments': 'ornament', 'custom-garden-flags': 'garden-flag',
  'custom-door-signs': 'door-sign', 'custom-aprons': 'apron',
  'custom-pillows': 'pillow', hoodies: 'hoodie',
};

export function normalizeCategory(handle: string) {
  const value = handle.trim().toLowerCase();
  return aliases[value] || value;
}

export function belongsToCategory(product: CatalogProduct, handle: string, categories: HttpTypes.StoreProductCategory[]) {
  if (handle === 'all') return true;
  const key = normalizeCategory(handle);
  const matchingIds = new Set(categories.filter(category => normalizeCategory(category.handle) === key).map(category => category.id));
  // A parent collection includes products in its nested categories.
  for (let previous = -1; previous !== matchingIds.size;) {
    previous = matchingIds.size;
    categories.forEach(category => {
      if (category.parent_category_id && matchingIds.has(category.parent_category_id)) matchingIds.add(category.id);
    });
  }
  return product.categories?.some(category => matchingIds.has(category.id) || normalizeCategory(category.handle) === key)
    || normalizeCategory(String(product.metadata?.category || '')) === key;
}

export function buildCategories(products: CatalogProduct[], categories: HttpTypes.StoreProductCategory[]): CatalogCategory[] {
  const merged = new Map<string, { handle: string; name: string }>();
  navigationCategories.forEach(category => merged.set(normalizeCategory(category.handle), category));
  categories.forEach(category => merged.set(normalizeCategory(category.handle), { handle: category.handle, name: category.name }));
  return Array.from(merged.values()).map(category => ({
    handle: category.handle, name: category.name,
    count: products.filter(product => belongsToCategory(product, category.handle, categories)).length,
  }));
}

export function productPrice(product: CatalogProduct) {
  const prices = product.variants?.map(variant => variant.calculated_price).filter(price => price?.calculated_amount != null) || [];
  return prices.reduce<(typeof prices)[number] | undefined>((lowest, price) =>
    !lowest || price!.calculated_amount! < lowest.calculated_amount! ? price : lowest, undefined);
}

export function sortProducts(products: CatalogProduct[], sort: CatalogSort) {
  return [...products].sort((a, b) => {
    if (sort === 'newest') return (Date.parse(b.created_at || '') || 0) - (Date.parse(a.created_at || '') || 0);
    if (sort === 'price-asc' || sort === 'price-desc') {
      const left = productPrice(a)?.calculated_amount;
      const right = productPrice(b)?.calculated_amount;
      if (left == null) return right == null ? 0 : 1;
      if (right == null) return -1;
      return sort === 'price-asc' ? left - right : right - left;
    }
    return 0;
  });
}

export function readWishlist(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}
