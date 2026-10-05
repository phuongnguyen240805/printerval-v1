import type { GetStaticProps } from 'next';
import type { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../../next-i18next.config';
import { PrimaryLayout } from '@/layouts';
import { CollectionCatalog } from '@/shared/features/page/collection/CollectionCatalog';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: { ...(await serverSideTranslations(locale, undefined, i18nConfig)) },
});

export default function CollectionsPage() { return <CollectionCatalog />; }

CollectionsPage.getLayout = (page: ReactElement) => (
  <PrimaryLayout appearance="liquid-glass" seo={{ title: 'Collections', canonical: '/collection' }}>{page}</PrimaryLayout>
);
