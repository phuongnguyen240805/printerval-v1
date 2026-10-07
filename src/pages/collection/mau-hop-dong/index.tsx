import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../../../next-i18next.config';
import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import { ContractHome } from '@/shared/features/page/contract-clone/ContractHome';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, undefined, i18nConfig)),
  },
});

const MauHopDongPage: NextPageWithLayout = () => <ContractHome />;

MauHopDongPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout appearance="liquid-glass" seo={{ title: 'Mẫu hợp đồng', canonical: '/collection/mau-hop-dong' }}>
      {page}
    </PrimaryLayout>
  );
};

export default MauHopDongPage;
