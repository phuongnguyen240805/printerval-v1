import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { PrimaryLayout } from '@/layouts';
import { AiAccountsPage } from '@/shared/features/page/AiAccountsPage/AiAccountsPage';

const AiAccounts: NextPageWithLayout = () => <AiAccountsPage />;

AiAccounts.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      appearance="liquid-glass"
      seo={{
        title: 'Tài khoản AI',
        canonical: '/tai-khoan-ai',
        description: 'Các gói AI được cập nhật từ danh mục Medusa.',
      }}
    >
      {page}
    </PrimaryLayout>
  );
};

export default AiAccounts;
