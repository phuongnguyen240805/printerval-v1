import Link from 'next/link';
import { useState } from 'react';
import { ContractPreviewModal } from './ContractPreviewModal';
import { formatVnd, type ContractItem } from './mockData';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';

export function ContractDetailPage({ item }: { item: ContractItem }) {
  const [preview, setPreview] = useState(false);
  return (
    <main className={`${theme.page} min-h-[60vh] px-4 py-8 md:py-12`}>
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/collection/mau-hop-dong">Mẫu hợp đồng</Link>
          <span aria-hidden="true"> / </span>Chi tiết
        </nav>
        <article data-liquid-surface="" className="rounded-3xl p-6 md:p-10">
          <span className="text-sm text-green-700">{item.category}</span>
          <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-snug md:text-4xl">
            {item.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600">
            {item.description}
          </p>
          <dl className="my-8 grid gap-4 sm:grid-cols-3">
            {[
              ['Đối tượng', item.audience],
              [
                'Định dạng',
                item.fileType || (item.kind === 'bundle' ? 'ZIP' : 'DOCX'),
              ],
              ['Ngôn ngữ', item.language || 'Tiếng Việt'],
            ].map(([label, value]) => (
              <div data-liquid-card="" className="rounded-2xl p-4" key={label}>
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="mt-2 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-gray-200 pt-6">
            <div>
              <span className="text-sm text-gray-500 line-through">
                {formatVnd(item.oldPrice)}
              </span>
              <p className="mt-1 text-2xl font-semibold text-green-700">
                {formatVnd(item.price)}
              </p>
            </div>
            <button
              type="button"
              data-catalog-variant="primary"
              className="px-6 py-3"
              onClick={() => setPreview(true)}
            >
              Xem thông tin tài liệu
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-gray-500">
            Tài liệu gốc chưa được cung cấp. Chức năng tải và thanh toán sẽ khả
            dụng khi có tài liệu tương ứng.
          </p>
        </article>
        <Link
          href={{
            pathname: '/collection/mau-hop-dong',
            query: { category: item.category },
          }}
          className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-green-700"
        >
          Xem các hợp đồng cùng danh mục →
        </Link>
        <ContractPreviewModal
          item={preview ? item : null}
          onClose={() => setPreview(false)}
        />
      </div>
    </main>
  );
}
