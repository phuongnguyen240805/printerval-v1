import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../../next-i18next.config';
import { PrimaryLayout } from '@/layouts';
import { CollectionCatalog } from '@/shared/features/page/collection/CollectionCatalog';

export const getServerSideProps: GetServerSideProps = async ({ params, locale = 'en' }) => ({
  props: { handle: String(params?.handle || ''), ...(await serverSideTranslations(locale, undefined, i18nConfig)) },
});

export default function CollectionPage({ handle }: { handle: string }) { return <CollectionCatalog handle={handle} />; }

CollectionPage.getLayout = (page: ReactElement) => (
  <PrimaryLayout appearance="liquid-glass" seo={{ title: 'Collection' }}>{page}</PrimaryLayout>
);
