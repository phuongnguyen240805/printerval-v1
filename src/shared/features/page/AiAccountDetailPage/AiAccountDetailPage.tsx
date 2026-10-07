import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AiAccountDetailPage.module.css';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import type { AccountDetailData, DetailOffer } from './mockDetailData';

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
const CURSOR_COUPON_SEEN_KEY = 'printerval-ai-cursor-coupon-seen';
const CURSOR_COUPON_COLLECTED_KEY = 'printerval-ai-cursor-coupon-collected';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function CouponHeroArt() {
  return (
    <svg viewBox="0 0 420 170" className={styles.couponHeroSvg} aria-hidden="true">
      <ellipse cx="210" cy="145" rx="155" ry="21" fill="#f6a43b" opacity=".32" />
      <polygon points="72,16 79,32 96,34 83,46 87,64 72,55 57,64 61,46 48,34 65,32" fill="#ffd62a" />
      <polygon points="337,18 344,34 361,36 348,48 352,65 337,56 322,65 326,48 313,36 330,34" fill="#ffd62a" />
      <polygon points="271,2 278,18 295,20 282,32 286,49 271,40 256,49 260,32 247,20 264,18" fill="#ffe054" opacity=".95" />
      <path d="M108 53 129 45 141 91 113 96Z" fill="#ff963d" />
      <path d="m103 58-17 9 15 28 19-10Z" fill="#ff7f3d" />
      <path d="m312 52-22-9-13 50 29 7Z" fill="#ff973d" />
      <path d="m319 58 17 8-14 30-20-10Z" fill="#ff783d" />
      <rect x="151" y="72" width="118" height="70" rx="9" fill="#ff6b35" />
      <path d="M151 91h118v51H151Z" fill="#ff4f38" />
      <rect x="198" y="72" width="24" height="70" fill="#ffb91c" />
      <rect x="151" y="84" width="118" height="19" fill="#ff9b1e" />
      <path d="M210 77c-31-9-43-34-24-43 18-8 31 13 24 43Z" fill="#ffc51d" />
      <path d="M210 77c31-9 43-34 24-43-18-8-31 13-24 43Z" fill="#ffd32b" />
      <circle cx="210" cy="73" r="12" fill="#ffab16" />
      <path d="M260 75c8-20 25-29 35-17 10 13-3 31-35 31Z" fill="#ff7761" />
      <circle cx="286" cy="64" r="16" fill="#ff6a56" />
      <path d="M162 110c-27 2-49 13-58 29h214c-7-17-27-28-55-30Z" fill="#f6a34b" opacity=".28" />
      <path d="m122 15 10 9-8 11-10-9Z" fill="#ffcf2a" opacity=".8" />
      <path d="m308 88 11 7-7 12-11-7Z" fill="#ffd32b" opacity=".9" />
      <circle cx="101" cy="111" r="7" fill="#ffba23" />
      <circle cx="328" cy="109" r="6" fill="#ffb221" />
    </svg>
  );
}

function CouponTicketGift() {
  return (
    <svg viewBox="0 0 150 110" className={styles.couponTicketGift} aria-hidden="true">
      <ellipse cx="76" cy="101" rx="58" ry="8" fill="#f4b24f" opacity=".28" />
      <circle cx="53" cy="48" r="11" fill="#ffc24a" /><circle cx="72" cy="39" r="9" fill="#ffd05a" /><circle cx="93" cy="48" r="11" fill="#ffb93d" />
      <circle cx="108" cy="42" r="7" fill="#ffd76a" /><circle cx="40" cy="60" r="7" fill="#ffd76a" />
      <rect x="48" y="59" width="66" height="43" rx="4" fill="#ff6a3d" />
      <rect x="45" y="57" width="72" height="14" rx="4" fill="#ff8c30" />
      <rect x="76" y="57" width="12" height="45" fill="#ffc126" />
      <path d="M82 58c-19-5-27-19-15-24 11-5 19 7 15 24Z" fill="#ffd32b" />
      <path d="M82 58c20-5 28-19 16-24-11-5-20 7-16 24Z" fill="#ffbf1f" />
      <path d="M33 74c-8-5-11-10-6-14 6-4 12 2 13 11Z" fill="#ffb223" />
      <path d="M119 68c10-6 16-6 18 0 1 7-8 10-18 8Z" fill="#ffbd28" />
    </svg>
  );
}

function CouponTicket({ title, date, discount }: { title: string; date: string; discount: string }) {
  return (
    <article className={styles.couponTicket}>
      <div className={styles.couponTicketCopy}>
        <strong>{title}</strong>
        <span>{date}</span>
      </div>
      <div className={styles.couponTicketDeal}>
        <b>{discount}</b>
        <CouponTicketGift />
      </div>
    </article>
  );
}

function CursorCouponExperience({
  open,
  collected,
  onOpen,
  onClose,
  onCollect,
}: {
  open: boolean;
  collected: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCollect: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <button type="button" className={styles.floatingCoupon} onClick={onOpen} aria-label="Mở phiếu giảm giá">
        <img src="/assets/ai-accounts/detail/coupon.svg" alt="Coupon" />
      </button>

      {open && (
        <div className={`${styles.couponBackdrop} ${theme.scope}`} onMouseDown={onClose} role="presentation">
          <section className={styles.couponDialog} role="dialog" aria-modal="true" aria-label="Phiếu giảm giá" onMouseDown={(event) => event.stopPropagation()}>
            <div className={styles.couponHeroArt}><CouponHeroArt /></div>
            <button type="button" className={styles.couponClose} onClick={onClose} aria-label="Đóng phiếu giảm giá">×</button>

          <div data-liquid-surface="" className={styles.couponShell}>
              <div className={styles.couponTickets}>
                <CouponTicket title="New User – 6% OFF on Top-Ups" date="2026/05/01–2026/12/31" discount="6% OFF" />
                <CouponTicket title="Marketplace Subscription Welcome Gift" date="2026/08/31–2026/12/31" discount="15% OFF" />
              </div>
              <div className={styles.couponFooter}>
                <strong>Phiếu giảm giá sắp hết hạn</strong>
                <button type="button" onClick={onCollect} disabled={collected}>
                  {collected ? 'Đã thu thập phiếu giảm giá' : 'Thu thập phiếu giảm giá'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>,
    document.body,
  );
}

function OfferCard({ offer, logo, onSelect }: { offer: DetailOffer; logo: string; onSelect: () => void }) {
  return (
    <article data-liquid-card="" className={styles.offerCard} onClick={onSelect} tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect();
      }
    }}>
      <div className={styles.warrantyBadge}><span>♢</span> {offer.warranty} <b>›</b></div>

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
            <strong>{offer.rating.toFixed(1)}</strong>
          </div>
        </div>
        <span className={styles.positive}>{offer.positive}</span>
        <span className={styles.reviews}>{offer.reviews}</span>
      </div>

      <div className={styles.cardDivider} />
      <div className={styles.offerFooter}>
        <strong className={styles.price}>{money.format(offer.price)}</strong>
        <span className={styles.delivery}>{offer.delivery === 'Ngay lập tức' ? 'ϟ' : '◷'} {offer.delivery}</span>
      </div>
    </article>
  );
}

export function AiAccountDetailPage({ data }: { data: AccountDetailData }) {
  const [sort, setSort] = useState<'recommended' | 'low' | 'high'>('recommended');
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [selected, setSelected] = useState<DetailOffer | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCollected, setCouponCollected] = useState(false);

  const couponEnabled = data.slug === 'cursor';

  useEffect(() => {
    if (!couponEnabled) {
      setCouponOpen(false);
      return;
    }
    try {
      setCouponCollected(window.sessionStorage.getItem(CURSOR_COUPON_COLLECTED_KEY) === '1');
      setCouponOpen(window.sessionStorage.getItem(CURSOR_COUPON_SEEN_KEY) !== '1');
    } catch {
      setCouponOpen(true);
    }
  }, [couponEnabled, data.slug]);

  useEffect(() => {
    if (!couponOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCouponOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [couponOpen]);

  const closeCoupon = () => {
    setCouponOpen(false);
    try { window.sessionStorage.setItem(CURSOR_COUPON_SEEN_KEY, '1'); } catch { /* noop */ }
  };

  const collectCoupons = () => {
    if (couponCollected) return;
    setCouponCollected(true);
    setToast('Đã thu thập 2 phiếu giảm giá demo');
    try {
      window.sessionStorage.setItem(CURSOR_COUPON_COLLECTED_KEY, '1');
      window.sessionStorage.setItem(CURSOR_COUPON_SEEN_KEY, '1');
    } catch { /* noop */ }
    window.setTimeout(() => setCouponOpen(false), 700);
    window.setTimeout(() => setToast(''), 2400);
  };

  const offers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = data.offers.filter((offer) => !query || `${offer.meta} ${offer.title} ${offer.seller}`.toLowerCase().includes(query));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    return list;
  }, [data.offers, search, sort]);

  const pageOffers = useMemo(() => offers.map((offer, index) => {
    if (page === 1) return offer;
    const multiplier = 1 + (page - 1) * 0.035 + index * 0.002;
    return {
      ...offer,
      id: `${offer.id}-page-${page}`,
      price: Math.round(offer.price * multiplier),
      reviews: `(${Number(offer.reviews.replace(/[^0-9]/g, '') || 20) + page * 17 + index})`,
    };
  }), [offers, page]);

  const confirm = () => {
    setSelected(null);
    setToast('Đã thêm ưu đãi demo vào giỏ frontend');
    window.setTimeout(() => setToast(''), 2200);
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
          <button type="button" onClick={() => setMobileFilters((value) => !value)}>☰ Bộ lọc</button>
          <span>{data.resultCount} mục</span>
        </div>

        <div className={styles.marketLayout}>
          <aside className={`${styles.filters} ${mobileFilters ? styles.filtersOpen : ''}`}>
            <div className={styles.filterSearchBlock}>
              <h2>Tên mục</h2>
              <label className={styles.searchBox}>
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm kiếm mục" />
                <span>⌕</span>
              </label>
            </div>

            {data.filters.map((filter) => (
              <section className={styles.filterGroup} key={filter.title}>
                <h2>{filter.title}<span>⌄</span></h2>
                <div className={styles.filterItems}>
                  {filter.items.map((item, index) => filter.title === 'Khoảng giá (VND)' ? (
                    <div className={styles.priceField} key={item.label}>{item.label}</div>
                  ) : (
                    <label key={item.label} className={styles.filterItem}>
                      <input type="checkbox" defaultChecked={index === 0 && filter.title === 'Tình trạng có sẵn'} />
                      <span>{item.label}</span>{typeof item.count === 'number' && <small>{item.count}</small>}
                    </label>
                  ))}
                </div>
              </section>
            ))}
            <button type="button" className={styles.applyFilter} onClick={() => setMobileFilters(false)}>Áp dụng bộ lọc</button>
          </aside>

          <main className={styles.results}>
            <div className={styles.resultHeader}>
              <strong><span>{data.resultCount}</span> đã tìm thấy mục</strong>
              <label><b>⇵</b> Sắp xếp theo:
                <select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}>
                  <option value="recommended">Được đề xuất</option>
                  <option value="low">Giá thấp đến cao</option>
                  <option value="high">Giá cao đến thấp</option>
                </select>
              </label>
            </div>

            <div className={styles.offerGrid}>
              {pageOffers.map((offer) => <OfferCard key={offer.id} offer={offer} logo={data.logo} onSelect={() => setSelected(offer)} />)}
            </div>

            <div className={styles.pagination} aria-label="Phân trang">
              <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Trước</button>
              {[1, 2, 3].map((item) => <button type="button" key={item} className={page === item ? styles.pageActive : ''} onClick={() => setPage(item)}>{item}</button>)}
              <button type="button" disabled={page === 3} onClick={() => setPage((value) => Math.min(3, value + 1))}>Tiếp theo</button>
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

      {selected && (
        <div className={styles.modalBackdrop} onMouseDown={() => setSelected(null)} role="presentation">
          <section data-liquid-surface="" className={styles.modal} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className={styles.modalClose} onClick={() => setSelected(null)} aria-label="Đóng">×</button>
            <div className={styles.modalHead}><img src={data.logo} alt={data.name} /><div><span>{selected.meta}</span><h2>{selected.title}</h2></div></div>
            <div className={styles.modalSeller}><span>Người bán</span><strong>{selected.seller}</strong></div>
            <div className={styles.modalLine}><span>Giao hàng</span><strong>{selected.delivery}</strong></div>
            <div className={styles.modalLine}><span>Bảo hành</span><strong>{selected.warranty}</strong></div>
            <div className={styles.modalTotal}><span>Tổng cộng</span><strong>{money.format(selected.price)}</strong></div>
            <button type="button" className={styles.confirmButton} onClick={confirm}>Thêm vào giỏ demo</button>
            <p>Mock frontend: không tạo đơn và không gọi API thanh toán.</p>
          </section>
        </div>
      )}

      {couponEnabled && (
        <CursorCouponExperience
          open={couponOpen}
          collected={couponCollected}
          onOpen={() => setCouponOpen(true)}
          onClose={closeCoupon}
          onCollect={collectCoupons}
        />
      )}

      {toast && <div className={styles.toast} role="status">{toast}</div>}
    </div>
  );
}
