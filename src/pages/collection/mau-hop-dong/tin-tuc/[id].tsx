import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextPageWithLayout } from '../../../_app';
import { PrimaryLayout } from '@/layouts';
import theme from '@/shared/ui/liquid/CatalogTheme.module.css';
import { news } from '@/shared/features/page/contract-clone/mockData';

type Props = { item: (typeof news)[number]; id: number };
const Page: NextPageWithLayout<Props> = ({ item, id }) => (
  <PrimaryLayout
    appearance="liquid-glass"
    seo={{
      title: item.title,
      canonical: `/collection/mau-hop-dong/tin-tuc/${id}`,
    }}
  >
    <main className={`${theme.page} min-h-[60vh] px-4 py-10`}>
      <article
        data-liquid-surface=""
        className="mx-auto max-w-4xl rounded-3xl p-6 md:p-10"
      >
        <Link
          href="/collection/mau-hop-dong"
          className="text-sm text-green-700"
        >
          ← Mẫu hợp đồng
        </Link>
        <p className="mt-8 text-sm text-gray-500">
          {item.category} · {item.date}
        </p>
        <h1 className="mt-3 text-2xl font-semibold leading-snug md:text-4xl">
          {item.title}
        </h1>
        <p role="status" className="mt-6 text-base leading-7 text-gray-600">
          Nội dung bài viết đang được cập nhật.
        </p>
        <Link
          href="/collection/mau-hop-dong"
          data-catalog-variant="primary"
          className="mt-8 inline-flex items-center justify-center px-6 py-3"
        >
          Khám phá mẫu hợp đồng
        </Link>
      </article>
    </main>
  </PrimaryLayout>
);
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: news.map((_, id) => ({ params: { id: String(id) } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const id = Number(params?.id);
  return Number.isInteger(id) && news[id]
    ? { props: { item: news[id], id } }
    : { notFound: true };
};
export default Page;
