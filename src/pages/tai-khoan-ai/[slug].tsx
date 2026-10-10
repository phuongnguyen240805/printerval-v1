import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../_app';
import { PrimaryLayout } from '@/layouts';
import { AiCatalogDetailRoute } from '@/shared/features/ai-catalog/AiCatalogDetailRoute';

const Page: NextPageWithLayout = () => <AiCatalogDetailRoute param="slug" />;
Page.getLayout = (page: ReactElement) => (
  <PrimaryLayout appearance="liquid-glass" seo={{title:'Tài khoản AI | Printerval',description:'Các gói AI được cập nhật từ Medusa.'}}>{page}</PrimaryLayout>
);
export default Page;
