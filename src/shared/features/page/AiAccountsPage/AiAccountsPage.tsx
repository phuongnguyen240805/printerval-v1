import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './AiAccountsPage.module.css';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import { AiAccountsCoupon } from './AiAccountsCoupon';
import {
  catalogTabs,
  faqs,
  products,
  reviews,
  whyItems,
  type AiProduct,
  type CatalogCategory,
} from './mockData';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function CardActions({ href, onPrimary, onSecondary, primaryLabel, secondaryLabel, ariaLabel }: {
  href?: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  ariaLabel?: string;
}) {
  return (
    <div className={styles.cardActions}>
      {href ? (
        <>
          <Link href={href} className={styles.buyButton} data-liquid-control="" data-liquid-shape="pill" aria-label={ariaLabel}>{primaryLabel}</Link>
          <Link href={href} className={styles.detailsButton}>{secondaryLabel}</Link>
        </>
      ) : (
        <>
          <button className={styles.buyButton} data-liquid-shape="pill" type="button" onClick={onPrimary}>{primaryLabel}</button>
          <button className={styles.detailsButton} type="button" onClick={onSecondary}>{secondaryLabel}</button>
        </>
      )}
    </div>
  );
}

function OfficialCard({
  product,
  expanded,
  onToggle,
  onBuy,
}: {
  product: AiProduct;
  expanded: boolean;
  onToggle: () => void;
  onBuy: () => void;
}) {
  return (
    <article className={styles.productCard}>
      <button className={styles.productVisual} type="button" onClick={onBuy} aria-label={`Mở ${product.name}`}>
        <div className={styles.productTop}>
          {product.badge && <span data-liquid-badge="" className={styles.productBadge}>{product.badge}</span>}
          <img src={product.logo} alt={product.name} />
          <span className={styles.productGlow} aria-hidden="true" />
        </div>
        <div className={styles.productPriceBand}>
          {product.joinedText && <span className={styles.joined}>{product.joinedText}</span>}
          <span className={styles.price}>{money.format(product.price)}</span>
          <span className={styles.duration}>{product.duration}</span>
        </div>
      </button>

      <div data-liquid-surface="" className={styles.productIntro}>
        <ul className={`${styles.featureList} ${expanded ? styles.featureListExpanded : ''}`}>
          {product.features.map((feature) => (
            <li key={feature}>
              <span className={styles.check}>✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <CardActions onPrimary={onBuy} onSecondary={onToggle} primaryLabel="Mua ngay" secondaryLabel="Xem thêm chi tiết" />
      </div>
    </article>
  );
}

function MarketplaceCard({ product, onBuy }: { product: AiProduct; onBuy: (price?: number, title?: string) => void }) {
  return (
    <article data-liquid-card="" className={styles.marketCard}>
      <span data-liquid-badge="" className={styles.marketLabel}>Thị trường🛒</span>
      <div className={styles.marketLogo}><img src={product.logo} alt={product.name} /></div>
      <div className={styles.offerPanel}>
        {product.offers?.slice(0, 3).map((offer) => (
          <button key={offer.id} className={styles.offerRow} type="button" onClick={() => onBuy(offer.price, offer.title)}>
            <span className={styles.offerThumb}><img src={product.logo} alt="" /></span>
            <span className={styles.offerInfo}>
              <strong>{offer.title}</strong>
              <span>{money.format(offer.price)}</span>
            </span>
          </button>
        ))}
      </div>
      <div className={styles.tags}>
        {product.tags?.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <CardActions
        href={product.detailSlug ? `/tai-khoan-ai/${product.detailSlug}` : undefined}
        onPrimary={() => onBuy()}
        onSecondary={() => onBuy()}
        primaryLabel="Xem TẤT CẢ"
        secondaryLabel={`${product.offerCount ?? 0} ưu đãi`}
        ariaLabel={`Xem tất cả ưu đãi ${product.name}`}
      />
    </article>
  );
}

export function AiAccountsPage() {
  const [category, setCategory] = useState<CatalogCategory>('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<AiProduct | null>(null);
  const [selectedOfferTitle, setSelectedOfferTitle] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [term, setTerm] = useState(1);
  const [toast, setToast] = useState('');

  const filtered = useMemo(
    () => products.filter((product) => category === 'all' || product.category === category),
    [category],
  );

  useEffect(() => setVisibleCount(8), [category]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const visibleReviews = Array.from({ length: 4 }, (_, index) => reviews[(reviewIndex + index) % reviews.length]);

  const openPurchase = (product: AiProduct, price?: number, title?: string) => {
    setSelectedProduct(product);
    setSelectedPrice(price ?? product.price);
    setSelectedOfferTitle(title ?? product.name);
    setTerm(1);
  };

  const total = Math.round((selectedPrice ?? 0) * term * (term >= 12 ? 0.78 : term >= 6 ? 0.86 : term >= 3 ? 0.93 : 1));

  const confirmMockPurchase = () => {
    setSelectedProduct(null);
    setToast('Đã thêm gói demo vào giỏ hàng frontend');
  };

  return (
    <div className={`${styles.page} ${theme.page}`}>
      <main id="top">
        <section data-catalog-hero="" className={styles.signboard}>
          <h1>Tiết kiệm đến 85% các gói tài khoản AI, xem phim &amp; game cao cấp cùng GamsGo.</h1>
          <p>Sự lựa chọn đáng tin cậy của hơn 10 triệu người dùng tại hơn 150 quốc gia trong suốt 7 năm qua.</p>
        </section>

        <section id="catalog" className={styles.catalog}>
          <div className={styles.tabsWrap}>
            <div className={styles.tabs} role="tablist" aria-label="Danh mục sản phẩm">
              {catalogTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={category === tab.id}
                  className={category === tab.id ? styles.activeTab : ''}
                  onClick={() => setCategory(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.brandSpace} />
          <div className={styles.productsWrap}>
            {visibleProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {visibleProducts.map((product) => product.type === 'official' ? (
                  <OfficialCard
                    key={product.id}
                    product={product}
                    expanded={Boolean(expanded[product.id])}
                    onToggle={() => setExpanded((value) => ({ ...value, [product.id]: !value[product.id] }))}
                    onBuy={() => openPurchase(product)}
                  />
                ) : (
                  <MarketplaceCard
                    key={product.id}
                    product={product}
                    onBuy={(price, title) => openPurchase(product, price, title)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <strong>Không tìm thấy sản phẩm phù hợp</strong>
                <span>Thử từ khóa khác hoặc chọn lại danh mục.</span>
              </div>
            )}

            {visibleCount < filtered.length && (
              <button className={styles.viewAll} type="button" onClick={() => setVisibleCount(filtered.length)}>Xem tất cả</button>
            )}
          </div>
        </section>

        <section className={styles.whySection}>
          <h2>Vì sao hàng triệu người lựa chọn <span>GamsGo</span>?</h2>
          <ul>
            {whyItems.map((item) => (
              <li key={item.title}>
                <article data-liquid-card="" className={styles.whyCard}>
                  <span className={styles.whyIcon}>{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.reviewsSection}>
          <h2>Hơn <span>10 triệu</span> người dùng hài lòng</h2>
          <div className={styles.reviewsTrack}>
            <button type="button" className={`${styles.reviewNav} ${styles.reviewPrev}`} onClick={() => setReviewIndex((value) => (value - 1 + reviews.length) % reviews.length)} aria-label="Đánh giá trước">‹</button>
            <div className={styles.reviewsGrid}>
              {visibleReviews.map((review, index) => (
                <article data-liquid-card="" className={styles.reviewCard} key={`${review.name}-${reviewIndex}-${index}`}>
                  <header>
                    <span className={styles.avatar}>{initials(review.name)}</span>
                    <span><strong>{review.name}</strong><small>{review.country}</small></span>
                  </header>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
            <button type="button" className={`${styles.reviewNav} ${styles.reviewNext}`} onClick={() => setReviewIndex((value) => (value + 1) % reviews.length)} aria-label="Đánh giá tiếp theo">›</button>
          </div>
        </section>

        <section id="faq" className={styles.faqSection}>
          <h2>Câu hỏi thường gặp</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article data-liquid-surface="" className={styles.faqItem} key={faq.question}>
                  <button type="button" className={styles.faqTrigger} onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{faq.question}</span>
                    <span>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && <div className={styles.faqAnswer}>{faq.answer}</div>}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {selectedProduct && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelectedProduct(null)}>
          <section data-liquid-surface="" className={styles.purchaseModal} role="dialog" aria-modal="true" aria-labelledby="purchase-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.modalClose} type="button" onClick={() => setSelectedProduct(null)} aria-label="Đóng">×</button>
            <div className={styles.modalProduct}>
              <img src={selectedProduct.logo} alt={selectedProduct.name} />
              <div><span>Gói đang chọn</span><h3 id="purchase-title">{selectedOfferTitle || selectedProduct.name}</h3></div>
            </div>
            <div className={styles.termLabel}>Thời hạn</div>
            <div className={styles.termGrid}>
              {[1, 3, 6, 12].map((month) => (
                <button key={month} type="button" className={term === month ? styles.termActive : ''} onClick={() => setTerm(month)}>{month} tháng</button>
              ))}
            </div>
            <div className={styles.summaryRow}><span>Giá gốc</span><strong>{money.format((selectedPrice ?? 0) * term)}</strong></div>
            <div className={styles.summaryRow}><span>Ưu đãi mock</span><strong>{term >= 12 ? '-22%' : term >= 6 ? '-14%' : term >= 3 ? '-7%' : '0%'}</strong></div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Tổng cộng</span><strong>{money.format(total)}</strong></div>
            <button className={styles.confirmButton} type="button" onClick={confirmMockPurchase}>Thêm vào giỏ demo</button>
            <p className={styles.modalNote}>Không tạo đơn thật, không gọi API thanh toán và không gửi dữ liệu ra ngoài.</p>
          </section>
        </div>
      )}

      <AiAccountsCoupon />

      {toast && <div className={styles.toast} role="status">{toast}</div>}
    </div>
  );
}
