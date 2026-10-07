import type { GetStaticPaths, GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { AiAccountDetailPage } from '@/shared/features/page/AiAccountDetailPage/AiAccountDetailPage';
import { accountDetails, accountDetailSlugs, type AccountDetailData } from '@/shared/features/page/AiAccountDetailPage/mockDetailData';

type Props = { data: AccountDetailData };

const AiAccountDetail: NextPageWithLayout<Props> = ({ data }) => <AiAccountDetailPage data={data} />;

AiAccountDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      appearance="liquid-glass"
      seo={{
        title: 'Tài khoản AI | Printerval',
        canonical: '/tai-khoan-ai',
        description: 'Marketplace tài khoản AI với mock data frontend để đánh giá UI/UX.',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: accountDetailSlugs.map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug ?? '');
  const data = accountDetails[slug];
  if (!data) return { notFound: true };
  return { props: { data } };
};

export default AiAccountDetail;
