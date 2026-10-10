import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CatalogCarousel } from '@/shared/ui/liquid/CatalogCarousel';
import { AiCheckoutDialog } from '../AiCheckout/AiCheckoutDialog';
import { productCheckout } from '../AiCheckout/adapters';
import styles from './AiAccountsPage.module.css';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import { AiAccountsCoupon } from './AiAccountsCoupon';
import { useAiCatalog } from '../../ai-catalog/useAiCatalog';
import { formatAiPrice } from '../../ai-catalog/price';
import type { AiProduct, CatalogCategory } from '../../ai-catalog/types';
import {
  catalogTabs,
  faqs,
} from './mockData';

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
          <Link href={href} className={styles.buyButton} data-catalog-variant="primary" data-liquid-control="" data-liquid-shape="pill" aria-label={ariaLabel}>{primaryLabel}</Link>
          <Link href={href} data-catalog-variant="text" className={styles.detailsButton}>{secondaryLabel}</Link>
        </>
      ) : (
        <>
          <button className={styles.buyButton} data-catalog-variant="primary" data-liquid-shape="pill" type="button" onClick={onPrimary}>{primaryLabel}</button>
          <button className={styles.detailsButton} data-catalog-variant="text" type="button" onClick={onSecondary}>{secondaryLabel}</button>
        </>
      )}
    </div>
  );
}

function OfficialCard({
  product,
  onBuy,
}: {
  product: AiProduct;
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
          <span className={styles.price}>{formatAiPrice(product.price, product.currencyCode, product.hasPrice)}</span>
          <span className={styles.duration}>{product.duration}</span>
        </div>
      </button>

      <div data-liquid-surface="" className={styles.productIntro}>
        <ul className={styles.featureList}>
          {product.features.map((feature) => (
            <li key={feature}>
              <span className={styles.check}>✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={styles.cardActions}>
          <button className={styles.buyButton} data-catalog-variant="primary" type="button" disabled={product.hasPrice === false} onClick={onBuy}>Mua ngay</button>
          <Link href={`/tai-khoan-ai/goi/${encodeURIComponent(product.handle || product.id)}`} data-catalog-variant="text" className={styles.detailsButton}>Xem thêm chi tiết</Link>
        </div>
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
        <CatalogCarousel label={`Các gói ${product.name}`} compact>
        {Array.from({ length: Math.ceil((product.offers?.length || 0) / 2) }, (_, index) => (
          <div key={index} className={styles.offerSlide}>
          {product.offers?.slice(index * 2, index * 2 + 2).map((offer) => (
          <button key={offer.id} className={styles.offerRow} type="button" disabled={offer.hasPrice === false} onClick={() => onBuy(offer.price, offer.title)}>
            <span className={styles.offerThumb}><img src={product.logo} alt="" /></span>
            <span className={styles.offerInfo}>
              <strong>{offer.title}</strong>
              <span>{formatAiPrice(offer.price, offer.currencyCode, offer.hasPrice)}</span>
            </span>
          </button>
          ))}
          </div>
        ))}
        </CatalogCarousel>
      </div>
      <div className={styles.tags}>
        {product.tags?.map((tag) => <Link key={tag} data-catalog-variant="secondary" href={{ pathname: `/tai-khoan-ai/${product.detailSlug}`, query: { q: tag } }}>{tag}</Link>)}
      </div>
      <CardActions
        href={product.detailSlug ? `/tai-khoan-ai/${product.detailSlug}` : undefined}
        onPrimary={() => onBuy()}
        onSecondary={() => onBuy()}
        primaryLabel="Xem TẤT CẢ"
        secondaryLabel={`${product.offerCount ?? product.offers?.length ?? 0} ưu đãi`}
        ariaLabel={`Xem tất cả ưu đãi ${product.name}`}
      />
    </article>
  );
}

export function AiAccountsPage() {
  const catalog = useAiCatalog();
  const products = catalog.data?.products;
  const [category, setCategory] = useState<CatalogCategory>('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<AiProduct | null>(null);
  const [selectedOfferTitle, setSelectedOfferTitle] = useState('');
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const filtered = useMemo(
    () => (products || []).filter((product) => category === 'all' || product.category === category || (category === 'marketplace' && product.type === 'marketplace') || (category === 'topup' && (product.handle || product.id).includes('recharge')) || (category === 'new' && product.isNew)),
    [category, products],
  );

  useEffect(() => setVisibleCount(8), [category]);
  const visibleProducts = filtered.slice(0, visibleCount);

  const openPurchase = (product: AiProduct, price?: number, title?: string) => {
    if (product.hasPrice === false) return;
    setSelectedProduct(product);
    setSelectedPrice(price ?? product.price);
    setSelectedOfferTitle(title ?? product.name);
  };

  return (
    <div className={`${styles.page} ${theme.page}`}>
      <main id="top">
        <h1 className="sr-only">Tài khoản AI</h1>

        <section id="catalog" className={styles.catalog}>
          <div className={styles.tabsWrap}>
            <div className={styles.tabs} role="group" aria-label="Danh mục sản phẩm">
              {catalogTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={category === tab.id}
                  className={category === tab.id ? styles.activeTab : ''}
                  onClick={() => setCategory(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.productsWrap}>
            {catalog.isLoading ? (
              <div className={styles.emptyState} role="status" aria-live="polite">Đang tải các gói AI từ Medusa…</div>
            ) : catalog.isError ? (
              <div className={styles.emptyState} role="alert">
                <strong>Không tải được các gói AI</strong>
                <span>{catalog.error instanceof Error ? catalog.error.message : 'Vui lòng thử lại.'}</span>
                <button className={styles.viewAll} type="button" onClick={() => void catalog.refetch()}>Thử lại</button>
              </div>
            ) : visibleProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {visibleProducts.map((product) => product.type === 'official' ? (
                  <OfficialCard
                    key={product.id}
                    product={product}
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
                <strong>{products?.length ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có gói AI được hiển thị từ Medusa'}</strong>
                <span>{products?.length ? 'Thử từ khóa khác hoặc chọn lại danh mục.' : 'Kiểm tra các gói đã Published và thuộc Sales Channel được gắn với Publishable API key.'}</span>
              </div>
            )}

            {visibleCount < filtered.length && (
              <button className={styles.viewAll} type="button" onClick={() => setVisibleCount(filtered.length)}>Xem tất cả</button>
            )}
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

      {selectedProduct && <AiCheckoutDialog item={productCheckout(selectedProduct, selectedPrice ?? selectedProduct.price, selectedOfferTitle)} onClose={() => setSelectedProduct(null)} />}

      <AiAccountsCoupon />

    </div>
  );
}
