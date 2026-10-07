import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiFileText, FiPackage, FiSearch } from 'react-icons/fi';
import { ContractCard } from './ContractCard';
import { ContractPreviewModal } from './ContractPreviewModal';
import { ContractSidebar } from './ContractSidebar';
import { bundles, contracts, type ContractAudience, type ContractItem, type ContractKind } from './mockData';

const PAGE_SIZE = 8;

export function ContractSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<ContractKind>('contract');
  const [audience, setAudience] = useState<'Tất cả' | ContractAudience>('Tất cả');
  const [category, setCategory] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<ContractItem | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setQuery(typeof router.query.q === 'string' ? router.query.q : '');
    setCategory(typeof router.query.category === 'string' ? router.query.category : 'Tất cả');
    setKind(router.query.type === 'bundle' ? 'bundle' : 'contract');
    setAudience(router.query.audience === 'Cá nhân' || router.query.audience === 'Doanh nghiệp' ? router.query.audience : 'Tất cả');
    const pageFromUrl = Number(router.query.page);
    setPage(Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1);
  }, [router.isReady, router.query.q, router.query.category, router.query.type, router.query.audience, router.query.page]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('vi');
    return (kind === 'bundle' ? bundles : contracts).filter((item) => {
      const searchable = `${item.title} ${item.description} ${item.category} ${item.audience} ${(item.tags || []).join(' ')} ${item.language || ''} ${item.fileType || ''}`.toLocaleLowerCase('vi');
      const matchesKeyword = !keyword || searchable.includes(keyword);
      const matchesAudience = audience === 'Tất cả' || item.audience === audience;
      const matchesCategory = category === 'Tất cả' || item.category === category;
      return matchesKeyword && matchesAudience && matchesCategory;
    });
  }, [query, kind, audience, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const syncUrl = (next: Partial<{ q: string; category: string; type: ContractKind; audience: 'Tất cả' | ContractAudience; page: number }>) => {
    const state = {
      q: next.q ?? query,
      category: next.category ?? category,
      type: next.type ?? kind,
      audience: next.audience ?? audience,
      page: next.page ?? 1,
    };
    const urlQuery: Record<string, string> = {};
    if (state.q.trim()) urlQuery.q = state.q.trim();
    if (state.category !== 'Tất cả') urlQuery.category = state.category;
    if (state.type === 'bundle') urlQuery.type = 'bundle';
    if (state.audience !== 'Tất cả') urlQuery.audience = state.audience;
    if (state.page > 1) urlQuery.page = String(state.page);
    router.replace({ pathname: '/collection/mau-hop-dong/tim-kiem', query: urlQuery }, undefined, { shallow: true });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setPage(1);
    syncUrl({ q: query, page: 1 });
  };

  const setCategoryAndSync = (value: string) => {
    setCategory(value);
    setPage(1);
    syncUrl({ category: value, page: 1 });
  };

  const setKindAndSync = (value: ContractKind) => {
    setKind(value);
    setPage(1);
    syncUrl({ type: value, audience: value === 'bundle' ? 'Doanh nghiệp' : audience, page: 1 });
    if (value === 'bundle') setAudience('Doanh nghiệp');
  };

  const setAudienceAndSync = (value: 'Tất cả' | ContractAudience) => {
    setAudience(value);
    setPage(1);
    syncUrl({ audience: value, page: 1 });
  };

  const setPageAndSync = (value: number) => {
    setPage(value);
    syncUrl({ page: value });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resultLabel = query.trim()
    ? `Kết quả tìm kiếm cho “${query.trim()}”`
    : category !== 'Tất cả'
      ? `Kết quả tìm kiếm trong danh mục “• ${category}”`
      : 'Kết quả tìm kiếm';

  return (
    <main className={`${theme.page} min-h-screen`}>
      <div className="container relative mx-auto max-w-screen-2xl px-0 py-2 md:px-4 lg:px-6">
        <nav className="flex items-center space-x-2 px-4 py-4 text-sm text-gray-600 md:px-0">
          <button type="button" onClick={() => router.push('/collection/mau-hop-dong')} className="flex items-center transition hover:text-green-600"><FiChevronLeft className="mr-1" />Mẫu hợp đồng</button>
          <span>/</span>
          <span className="font-medium text-gray-800">{resultLabel}</span>
        </nav>

        <div className="px-4 md:px-0">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
            <div className="order-2 space-y-3 md:space-y-4 lg:order-1 lg:col-span-3">
              <ContractSidebar selected={category} onSelect={setCategoryAndSync} showBanner />
            </div>

            <div className="order-1 space-y-3 md:space-y-4 lg:order-2 lg:col-span-9">
              <form onSubmit={submit} className="rounded-xl bg-white p-3 md:p-4">
                <div data-liquid-surface="" className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
                  <FiSearch className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm hợp đồng..." className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
                  <button type="submit" className="rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 md:text-sm">Tìm kiếm</button>
                </div>
              </form>

              <div data-liquid-surface="" className="rounded-xl bg-white p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xs font-medium text-gray-700 md:text-sm">Lọc theo:</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setKindAndSync('contract')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors md:gap-2 md:px-4 md:py-2 md:text-sm ${kind === 'contract' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><FiFileText /><span>Hợp đồng</span></button>
                    <button type="button" onClick={() => setKindAndSync('bundle')} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors md:gap-2 md:px-4 md:py-2 md:text-sm ${kind === 'bundle' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><FiPackage /><span>Gói</span></button>
                  </div>
                </div>
              </div>

              <div data-liquid-surface="" className="rounded-xl bg-white p-3 md:p-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="text-xs font-medium text-gray-700 md:text-sm">Đối tượng:</span>
                  <div className="flex gap-2">
                    {(['Tất cả', 'Cá nhân', 'Doanh nghiệp'] as const).map((value) => (
                      <button key={value} type="button" disabled={kind === 'bundle' && value !== 'Doanh nghiệp'} onClick={() => setAudienceAndSync(value)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors md:px-4 md:py-2 md:text-sm ${audience === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:cursor-not-allowed disabled:opacity-35`}>{value}</button>
                    ))}
                  </div>
                  <div className="ml-auto text-xs text-gray-500 md:text-sm"><strong className="text-gray-800">{filtered.length}</strong> kết quả</div>
                </div>
              </div>

              {visible.length ? (
                <div className="space-y-2">
                  {visible.map((item) => <ContractCard key={item.id} item={item} onPreview={setPreview} />)}
                </div>
              ) : (
                <div data-liquid-surface="" className="rounded-xl bg-white py-20 text-center">
                  <FiSearch className="mx-auto h-8 w-8 text-gray-300" />
                  <h3 className="mt-4 font-semibold text-gray-900">Không tìm thấy kết quả phù hợp</h3>
                  <p className="mt-2 text-sm text-gray-500">Hãy thử từ khóa khác, đổi đối tượng hoặc chọn danh mục khác.</p>
                  <button type="button" onClick={() => { setQuery(''); setCategory('Tất cả'); setAudience(kind === 'bundle' ? 'Doanh nghiệp' : 'Tất cả'); setPage(1); syncUrl({ q: '', category: 'Tất cả', audience: kind === 'bundle' ? 'Doanh nghiệp' : 'Tất cả', page: 1 }); }} className="mt-5 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white">Xóa bộ lọc</button>
                </div>
              )}

              {totalPages > 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 py-5">
                  <button type="button" disabled={safePage === 1} onClick={() => setPageAndSync(Math.max(1, safePage - 1))} className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 disabled:opacity-40"><FiChevronLeft /> Trước</button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => <button key={value} type="button" onClick={() => setPageAndSync(value)} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${safePage === value ? 'bg-green-500 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>{value}</button>)}
                  <button type="button" disabled={safePage === totalPages} onClick={() => setPageAndSync(Math.min(totalPages, safePage + 1))} className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 disabled:opacity-40">Sau <FiChevronRight /></button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ContractPreviewModal item={preview} onClose={() => setPreview(null)} />
    </main>
  );
}
