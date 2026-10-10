import Link from 'next/link';
import { useState } from 'react';
import { AiCheckoutDialog } from '../AiCheckout/AiCheckoutDialog';
import { productCheckout } from '../AiCheckout/adapters';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import type { AiProduct } from '../../ai-catalog/types';
import { formatAiPrice } from '../../ai-catalog/price';

export function AiProductDetailPage({ product }: { product: AiProduct }) {
  const [open, setOpen] = useState(false);
  const [variantId, setVariantId] = useState('');
  const selectedVariant = product.variants?.find(v => v.id === variantId)
    || product.variants?.find(v => v.hasPrice && v.price === product.price)
    || product.variants?.[0];
  const selectedProduct = selectedVariant ? { ...product, price:selectedVariant.price, currencyCode:selectedVariant.currencyCode, hasPrice:selectedVariant.hasPrice, duration:selectedVariant.duration } : product;
  return (
    <main className={`${theme.page} min-h-[60vh] px-4 py-8 md:py-12`}>
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/collection/tai-khoan-ai">Tài khoản AI</Link>
          <span aria-hidden="true"> / </span>
          {product.name}
        </nav>
        <article
          data-liquid-card=""
          className="grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10"
        >
          <div
            data-liquid-surface=""
            className="flex min-h-56 items-center justify-center rounded-3xl p-8"
          >
            <img
              src={product.logo}
              alt={product.name}
              className="max-h-40 w-full max-w-xs object-contain"
            />
          </div>
          <div>
            <span className="text-sm text-green-700">Gói đăng ký</span>
            <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-4 text-3xl font-semibold text-green-700">
              {formatAiPrice(selectedProduct.price, selectedProduct.currencyCode, selectedProduct.hasPrice)}{' '}
              <span className="text-sm font-normal text-gray-500">
                {selectedProduct.duration}
              </span>
            </p>
            {product.variants && product.variants.length > 1 && (
              <label className="mt-4 block text-sm">
                Lựa chọn gói
                <select className="mt-2 w-full rounded-xl border p-3" value={selectedVariant?.id} onChange={event => setVariantId(event.target.value)}>
                  {product.variants.map(v => <option key={v.id} value={v.id}>{v.title} — {formatAiPrice(v.price, v.currencyCode, v.hasPrice)}</option>)}
                </select>
              </label>
            )}
            {product.description && <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">{product.description}</p>}
            <ul className="my-6 space-y-3">
              {product.features.map(feature => (
                <li key={feature} className="flex gap-3 text-sm leading-6">
                  <span className="text-green-600" aria-hidden="true">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={selectedProduct.hasPrice === false}
              data-catalog-variant="primary"
              className="w-full px-6 py-3"
              onClick={() => {
                setOpen(true);
              }}
            >
              Chọn gói
            </button>
          </div>
        </article>
        <section className="mt-8 rounded-3xl p-6" data-liquid-surface="">
          <h2 className="text-xl font-semibold">Trước khi lựa chọn</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Đối chiếu thời hạn, quyền truy cập, hình thức tài khoản và thông tin
            bảo hành. Giá và quyền lợi hiển thị là dữ liệu tham khảo; chưa có
            thanh toán thực tế.
          </p>
        </section>
      </div>
      {open && <AiCheckoutDialog item={productCheckout(selectedProduct, selectedProduct.price, selectedVariant?.title || product.name)} onClose={() => setOpen(false)} />}
    </main>
  );
}
