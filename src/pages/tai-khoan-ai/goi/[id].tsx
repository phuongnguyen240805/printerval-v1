import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../../_app';
import { PrimaryLayout } from '@/layouts';
import { AiCatalogDetailRoute } from '@/shared/features/ai-catalog/AiCatalogDetailRoute';

const Page: NextPageWithLayout = () => <AiCatalogDetailRoute param="id" />;
Page.getLayout = (page: ReactElement) => (
  <PrimaryLayout appearance="liquid-glass" seo={{title:'Gói AI | Printerval'}}>{page}</PrimaryLayout>
);
export default Page;
