import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextPageWithLayout } from '../../../_app';
import { PrimaryLayout } from '@/layouts';
import {
  contracts,
  bundles,
  type ContractItem,
} from '@/shared/features/page/contract-clone/mockData';
import { ContractDetailPage } from '@/shared/features/page/contract-clone/ContractDetailPage';

type Props = { item: ContractItem };
const Page: NextPageWithLayout<Props> = ({ item }) => (
  <PrimaryLayout
    appearance="liquid-glass"
    seo={{
      title: item.title,
      canonical: `/collection/mau-hop-dong/chi-tiet/${item.id}`,
    }}
  >
    <ContractDetailPage item={item} />
  </PrimaryLayout>
);
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [...contracts, ...bundles].map(item => ({
    params: { id: String(item.id) },
  })),
  fallback: false,
});
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const item = [...contracts, ...bundles].find(
    item => String(item.id) === params?.id,
  );
  return item ? { props: { item } } : { notFound: true };
};
export default Page;
