import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import styles from './AiAccountDetailPage.module.css';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import type { AccountDetailData, DetailOffer } from '../../ai-catalog/types';
import { formatAiPrice } from '../../ai-catalog/price';
import { AiAccountsCoupon } from '../AiAccountsPage/AiAccountsCoupon';
import { AiCheckoutDialog } from '../AiCheckout/AiCheckoutDialog';
import { offerCheckout } from '../AiCheckout/adapters';
import { CatalogDialog } from '@/shared/ui/liquid/CatalogDialog';
import { filterOffers, offerFacet, type OfferFilters } from './offerFilters';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function OfferCard({ offer, logo, onSelect, onWarranty }: { offer: DetailOffer; logo: string; onSelect: () => void; onWarranty: () => void }) {
  return (
    <article data-liquid-card="" className={styles.offerCard}>
      <button type="button" className={styles.offerSelect} disabled={offer.hasPrice === false} aria-label={`Xem ưu đãi ${offer.title} từ ${offer.seller}`} onClick={onSelect} />
      <button type="button" data-catalog-variant="secondary" className={styles.warrantyBadge} onClick={onWarranty} aria-label={`Thông tin bảo hành ${offer.warranty}`}><span>♢</span> {offer.warranty} <b>›</b></button>

      <div className={styles.offerTop}>
        <div className={styles.offerCopy}>
          <h2 className={styles.offerHeading}>{offer.meta}</h2>
          <p className={styles.offerDescription}>{offer.title}</p>
        </div>
        <div className={styles.productLogo}><img src={logo} alt="" aria-hidden="true" /></div>
      </div>

      <div className={styles.sellerLine}>
        <span className={styles.avatar}>
          {offer.sellerAvatar ? <img src={offer.sellerAvatar} alt="" /> : initials(offer.seller)}
        </span>
        <div className={styles.sellerInfo}>
          <span className={styles.sellerName}>{offer.seller}</span>
          <div className={styles.sellerStats}>
            <span className={styles.star}>★</span>
            <strong>{offer.rating === null ? 'Chưa có đánh giá' : offer.rating.toFixed(1)}</strong>
          </div>
        </div>
        <span className={styles.positive}>{offer.positive}</span>
        <span className={styles.reviews}>{offer.reviews}</span>
      </div>

      <div className={styles.cardDivider} />
      <div className={styles.offerFooter}>
        <strong className={styles.price}>{formatAiPrice(offer.price, offer.currencyCode, offer.hasPrice)}</strong>
        <span className={styles.delivery}>{offer.delivery === 'Ngay lập tức' ? 'ϟ' : '◷'} {offer.delivery}</span>
      </div>
    </article>
  );
}

export function AiAccountDetailPage({ data }: { data: AccountDetailData }) {
  const router = useRouter();
  const [sort, setSort] = useState<'recommended' | 'low' | 'high'>('recommended');
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [selected, setSelected] = useState<DetailOffer | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<OfferFilters>({});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [warranty, setWarranty] = useState<DetailOffer | null>(null);
  const pageSize = 6;

  useEffect(() => { setFilters({}); setSearch(''); setMinPrice(''); setMaxPrice(''); setPage(1); setSelected(null); setWarranty(null); }, [data.slug]);
  useEffect(() => {
    if (!router.isReady) return;
    const value = typeof router.query.q === 'string' ? router.query.q : '';
    const group = data.filters.find((filter) => !filter.title.startsWith('Khoảng giá') && filter.items.some((item) => item.label === value));
    setFilters(group ? { [group.title]: [value] } : {});
    setSearch(group ? '' : value);
    setPage(1);
  }, [router.isReady, router.query.q, data.slug, data.filters]);

  const couponEnabled = data.slug === 'cursor';

  const offers = useMemo(() => {
    const list = filterOffers(data.offers, search, filters, minPrice, maxPrice);
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    return list;
  }, [data.offers, search, sort, filters, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(offers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageOffers = offers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const resetFilters = () => {
    setFilters({}); setSearch(''); setMinPrice(''); setMaxPrice(''); setPage(1);
    if (router.query.q) { const { q, ...query } = router.query; void q; void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true }); }
  };
  const toggleFilter = (group: string, value: string) => {
    setFilters((previous) => ({ ...previous, [group]: previous[group]?.includes(value) ? previous[group].filter((item) => item !== value) : [...(previous[group] || []), value] }));
    setPage(1);
  };

  return (
    <div className={`${styles.page} ${theme.page}`}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Printerval</Link><span>/</span>
          <Link href="/tai-khoan-ai">Gói đăng ký kỹ thuật số</Link><span>/</span>
          <strong>{data.name}</strong>
        </nav>

        <div className={styles.mobileToolbar}>
          <button type="button" aria-expanded={mobileFilters} aria-controls="account-filters" onClick={() => setMobileFilters((value) => !value)}>☰ Bộ lọc</button>
          <span aria-live="polite">{offers.length} mục</span>
        </div>

        <div className={styles.marketLayout}>
          <aside id="account-filters" aria-label="Lọc ưu đãi" className={`${styles.filters} ${mobileFilters ? styles.filtersOpen : ''}`}>
            <div className={styles.filterSearchBlock}>
              <h2>Tên mục</h2>
              <label className={styles.searchBox}>
                <input aria-label="Tìm tên gói hoặc người bán" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm kiếm mục" />
                <span>⌕</span>
              </label>
            </div>

            {data.filters.map((filter, groupIndex) => (
              <section className={styles.filterGroup} key={filter.title}>
                <h2><button type="button" data-catalog-variant="text" className={styles.filterToggle} aria-expanded={!collapsed.includes(filter.title)} aria-controls={`filter-group-${groupIndex}`} onClick={() => setCollapsed((previous) => previous.includes(filter.title) ? previous.filter((item) => item !== filter.title) : [...previous, filter.title])}>{filter.title}<span>{collapsed.includes(filter.title) ? '+' : '−'}</span></button></h2>
                <div id={`filter-group-${groupIndex}`} className={styles.filterItems} hidden={collapsed.includes(filter.title)}>
                  {filter.items.map((item, index) => filter.title.startsWith('Khoảng giá') ? (
                    <label key={item.label} className={styles.priceLabel}><span>{index === 0 ? 'Giá từ' : 'Giá đến'}</span><input type="number" min="0" step="1000" inputMode="numeric" className={styles.priceField} value={index === 0 ? minPrice : maxPrice} placeholder={index === 0 ? '0' : 'Không giới hạn'} onChange={(event) => { (index === 0 ? setMinPrice : setMaxPrice)(event.target.value); setPage(1); }} /></label>
                  ) : (
                    <label key={item.label} className={styles.filterItem}>
                      <input type="checkbox" checked={filters[filter.title]?.includes(item.label) || false} onChange={() => toggleFilter(filter.title, item.label)} />
                      <span>{item.label}</span><small>{data.offers.filter((offer) => offerFacet(offer, filter.title) === item.label).length}</small>
                    </label>
                  ))}
                </div>
              </section>
            ))}
            {minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice) && <p role="alert">Giá đến cần lớn hơn hoặc bằng giá từ.</p>}
            <button type="button" data-catalog-variant="text" className={styles.resetFilter} onClick={resetFilters}>Xóa bộ lọc</button>
            <button type="button" className={styles.applyFilter} onClick={() => setMobileFilters(false)}>Áp dụng bộ lọc</button>
          </aside>

          <main className={styles.results}>
            <div className={styles.resultHeader}>
              <strong role="status"><span>{offers.length}</span> ưu đãi phù hợp</strong>
              <label><b>⇵</b> Sắp xếp theo:
                <select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}>
                  <option value="recommended">Được đề xuất</option>
                  <option value="low">Giá thấp đến cao</option>
                  <option value="high">Giá cao đến thấp</option>
                </select>
              </label>
            </div>

            <div className={styles.activeFilters} aria-label="Bộ lọc đã chọn">
              {Object.entries(filters).flatMap(([group, values]) => values.map((value) => <button type="button" data-catalog-variant="secondary" key={`${group}-${value}`} onClick={() => toggleFilter(group, value)} aria-label={`Bỏ lọc ${group}: ${value}`}>{value} <span aria-hidden="true">×</span></button>))}
            </div>

            <div className={styles.offerGrid}>
              {pageOffers.map((offer) => <OfferCard key={offer.id} offer={offer} logo={data.logo} onSelect={() => setSelected(offer)} onWarranty={() => setWarranty(offer)} />)}
            </div>
            {!offers.length && <div data-liquid-surface="" className={styles.emptyState}><h2>Không có ưu đãi phù hợp</h2><p>Thử khoảng giá rộng hơn hoặc xóa một số bộ lọc.</p><button type="button" data-catalog-variant="primary" onClick={resetFilters}>Xóa bộ lọc</button></div>}

            <div className={styles.pagination} aria-label="Phân trang">
              <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Trước</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => <button type="button" key={item} aria-current={safePage === item ? 'page' : undefined} className={safePage === item ? styles.pageActive : ''} onClick={() => setPage(item)}>{item}</button>)}
              <button type="button" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Tiếp theo</button>
            </div>
          </main>
        </div>

        <article data-liquid-surface="" className={styles.description}>
          <h2>{data.introTitle}</h2>
          {data.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {data.sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((bullet) => <li key={`${bullet.title}-${bullet.text}`}><strong>{bullet.title ? `${bullet.title}: ` : ''}</strong>{bullet.text}</li>)}</ul>}
            </section>
          ))}
        </article>
      </div>

      {selected && <AiCheckoutDialog item={offerCheckout(data, selected)} onClose={() => setSelected(null)} />}

      <CatalogDialog open={!!warranty} onClose={() => setWarranty(null)} title="Thông tin bảo hành" className={styles.modal}>
        <button type="button" className={styles.modalClose} onClick={() => setWarranty(null)} aria-label="Đóng">×</button>
        <h2>Bảo hành {warranty?.warranty}</h2><p>Người bán: {warranty?.seller}</p><p>Kiểm tra phạm vi bảo hành, điều kiện hỗ trợ và thông tin gói trước khi xác nhận. Thời hạn hiển thị thuộc dữ liệu tham khảo; chưa có giao dịch thực tế.</p>
      </CatalogDialog>

      {couponEnabled && (
        <AiAccountsCoupon />
      )}

    </div>
  );
}
