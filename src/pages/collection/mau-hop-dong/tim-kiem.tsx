import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../../../next-i18next.config';
import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import { ContractSearch } from '@/shared/features/page/contract-clone/ContractSearch';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, undefined, i18nConfig)),
  },
});

const MauHopDongSearchPage: NextPageWithLayout = () => <ContractSearch />;

MauHopDongSearchPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout appearance="liquid-glass" seo={{ title: 'Tìm kiếm mẫu hợp đồng', canonical: '/collection/mau-hop-dong/tim-kiem' }}>
      {page}
    </PrimaryLayout>
  );
};

export default MauHopDongSearchPage;
