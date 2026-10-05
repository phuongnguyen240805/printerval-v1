import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Heart, Search, ShoppingBag } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { toast } from 'sonner';
import { LiquidSurface } from '@/shared/ui/liquid/LiquidSurface';
import RecentlyViewedNew from '@/packages/browsing-history/components/RecentlyViewedNew';
import { useCatalog } from './useCatalog';
import { belongsToCategory, buildCategories, normalizeCategory, productPrice, readWishlist, sortProducts, type CatalogProduct, type CatalogSort } from './catalog';

function ProductCard({ product, saved, toggle }: { product: CatalogProduct; saved: boolean; toggle: (id: string) => void }) {
  const price = productPrice(product);
  const amount = price?.calculated_amount;
  const original = price?.original_amount;
  // Medusa v2 calculated amounts are already in the currency's major unit.
  const format = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: price?.currency_code || 'USD' }).format(value);
  const discount = amount != null && original != null && original > amount ? Math.round((1 - amount / original) * 100) : 0;
  return (
    <LiquidSurface material="card" className="group relative flex h-full flex-col overflow-hidden">
      <Link href={`/product/${product.handle}`} className="relative block aspect-square overflow-hidden" aria-label={product.title}>
        {product.thumbnail ? <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 23vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
          : <span className="flex h-full items-center justify-center bg-orange-50 text-orange-300"><ShoppingBag size={48} aria-hidden="true" /></span>}
      </Link>
      {discount > 0 && <span data-liquid-badge="" className="absolute left-3 top-3 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">-{discount}%</span>}
      <button type="button" aria-label={`${saved ? 'Remove' : 'Add'} ${product.title} ${saved ? 'from' : 'to'} wishlist`} aria-pressed={saved} onClick={() => toggle(product.id)} className={`absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 ${saved ? 'text-red-600' : 'text-stone-600'}`}>
        <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/product/${product.handle}`} className="line-clamp-2 text-sm font-medium text-stone-800 hover:text-orange-700">{product.title}</Link>
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-stone-900">{amount == null ? 'Price unavailable' : format(amount)}</span>
          {discount > 0 && <span className="text-xs text-stone-500 line-through">{format(original!)}</span>}
        </div>
      </div>
    </LiquidSurface>
  );
}

/** Commerce collection routes adapted to Printerval's catalog and shared glass material. */
export function CollectionCatalog({ handle }: { handle?: string }) {
  const catalog = useCatalog();
  const [sort, setSort] = useState<CatalogSort>('relevant');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setWishlist(readWishlist());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('wishlist:updated', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('wishlist:updated', sync); };
  }, []);
  useEffect(() => { setQuery(''); setSort('relevant'); setVisibleCount(24); }, [handle]);
  const toggle = (id: string) => {
    const current = readWishlist();
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    try {
      localStorage.setItem('wishlist', JSON.stringify(next));
      setWishlist(next);
      window.dispatchEvent(new Event('wishlist:updated'));
    } catch { toast.error('Could not save your wishlist. Please enable browser storage.'); }
  };
  const products = catalog.data?.products || [];
  const apiCategories = catalog.data?.categories || [];
  const categories = buildCategories(products, apiCategories);
  const active = handle ? categories.find(category => normalizeCategory(category.handle) === normalizeCategory(handle)) : undefined;
  const title = !handle ? 'Explore our collections' : handle === 'all' ? 'All products' : active?.name || 'Collection not found';
  const filtered = sortProducts(products.filter(product => (!handle || belongsToCategory(product, handle, apiCategories)) && product.title.toLowerCase().includes(query.trim().toLowerCase())), sort);
  const card = (product: CatalogProduct) => <ProductCard key={product.id} product={product} saved={wishlist.includes(product.id)} toggle={toggle} />;
  const isUnknown = !!handle && handle !== 'all' && !active && catalog.isSuccess;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <NextSeo title={title} canonical={handle ? `/collection/${handle}` : '/collection'} />
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-700">Home</Link><ChevronRight size={14} aria-hidden="true" />
        {handle ? <><Link href="/collection" className="hover:text-orange-700">Collections</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{title}</span></> : <span aria-current="page">Collections</span>}
      </nav>
      <LiquidSurface className="relative mb-6 overflow-hidden px-6 py-10 text-center sm:py-14">
        <span className="home-glass-eyebrow">Made for everyday moments</span>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-800 sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-600">{handle ? 'Find your next favorite. Explore thoughtful designs and make them yours.' : 'Discover personalized gifts and custom designs, one collection at a time.'}</p>
        {!handle && <Link data-liquid-control="" href="/collection/all" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-100 px-5 text-sm font-semibold text-orange-900">Shop all products <ArrowRight size={16} aria-hidden="true" /></Link>}
      </LiquidSurface>
      {catalog.isLoading ? <LiquidSurface className="p-12 text-center" role="status"><span className="mx-auto mb-4 block h-8 w-8 animate-spin rounded-full border-2 border-orange-700 border-t-transparent motion-reduce:animate-none" />Loading collections…</LiquidSurface>
        : catalog.isError ? <LiquidSurface className="p-10 text-center" role="alert"><h2 className="text-lg font-semibold">We couldn’t load the collections</h2><p className="mt-2 text-sm text-stone-600">Please try again in a moment.</p><button type="button" className="mt-5 min-h-11 bg-orange-100 px-6 text-orange-900" onClick={() => void catalog.refetch()}>Try again</button></LiquidSurface>
        : isUnknown ? <LiquidSurface className="p-10 text-center"><p>This collection doesn’t exist.</p><Link data-liquid-control="" href="/collection" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-orange-100 px-5 text-orange-900">Browse collections</Link></LiquidSurface>
        : !handle ? <div className="space-y-8">
          {categories.filter(category => category.count > 0).map(category => <section key={category.handle} aria-label={category.name}>
            <LiquidSurface className="mb-4 flex flex-wrap items-center justify-between gap-4 p-5">
              <div><h2 className="text-xl font-semibold tracking-tight text-stone-800">{category.name}</h2><p className="mt-1 text-sm text-stone-600">{category.count} products</p></div>
              <Link data-liquid-control="" href={`/collection/${category.handle}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-100 px-4 text-sm font-semibold text-orange-900">View all <ArrowRight size={16} aria-hidden="true" /></Link>
            </LiquidSurface>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.filter(product => belongsToCategory(product, category.handle, apiCategories)).slice(0, 4).map(card)}</div>
          </section>)}
          {!categories.some(category => category.count > 0) && <LiquidSurface className="p-10 text-center"><p>No collections yet.</p><Link href="/collection/all" className="mt-4 inline-block text-orange-800 underline">Browse all products</Link></LiquidSurface>}
        </div> : <>
          <nav aria-label="Product categories" className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {[{ handle: 'all', name: 'All products', count: products.length }, ...categories].map(category => <Link key={category.handle} href={`/collection/${category.handle}`} data-liquid-control="" aria-current={normalizeCategory(category.handle) === normalizeCategory(handle) ? 'page' : undefined} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm ${normalizeCategory(category.handle) === normalizeCategory(handle) ? 'border-orange-300 bg-orange-100 text-orange-900' : 'border-white/90 bg-white/70 text-stone-700'}`}>{category.name}<span className="text-xs opacity-70">{category.count}</span></Link>)}
          </nav>
          <LiquidSurface className="mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex-1 sm:max-w-sm"><span className="sr-only">Search this collection</span><Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 text-stone-500" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(24); }} placeholder="Search this collection" className="min-h-11 w-full border py-2 pl-10 pr-3" /></label>
            <div className="flex flex-wrap items-center gap-3"><p role="status" className="text-sm text-stone-600">{filtered.length} results</p><label className="flex items-center gap-2 text-sm text-stone-700">Sort by<select value={sort} onChange={event => { setSort(event.target.value as CatalogSort); setVisibleCount(24); }} className="min-h-11 max-w-full border bg-white/70 px-3"><option value="relevant">Most relevant</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>
          </LiquidSurface>
          {filtered.length ? <><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{filtered.slice(0, visibleCount).map(card)}</div>{visibleCount < filtered.length && <div className="mt-8 text-center"><button type="button" className="min-h-11 bg-orange-100 px-6 font-medium text-orange-900" onClick={() => setVisibleCount(count => count + 24)}>Load more products</button></div>}</>
            : <LiquidSurface className="p-12 text-center"><ShoppingBag className="mx-auto mb-4 text-stone-400" size={36} aria-hidden="true" /><h2 className="text-xl font-semibold">No products found</h2><p className="mt-2 text-sm text-stone-600">{query ? 'Try another search term.' : 'Check back soon for new designs in this collection.'}</p>{query && <button type="button" className="mt-5 min-h-11 bg-orange-100 px-5 text-orange-900" onClick={() => setQuery('')}>Clear search</button>}</LiquidSurface>}
        </>}
      <section aria-label="Recently viewed" className="mt-10"><RecentlyViewedNew /></section>
    </div>
  );
}
