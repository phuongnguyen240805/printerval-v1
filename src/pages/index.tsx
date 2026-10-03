import type { GetStaticProps } from 'next';
import { type ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../next-i18next.config';
import { PrimaryLayout } from '@/layouts';
import FadeIn from '@/shared/components/FadeIn';
import { Hero } from '@/shared/features/page/HomePage/components/Hero';
import { SaleProduct } from '@/shared/features/page/HomePage/components/Promotions';
import Collection, { TopPick } from '@/shared/features/page/HomePage/components/TopPick';
import { Trending } from '@/shared/features/page/HomePage/components/Trending';
import { AdsSpace } from '@/shared/features/page/HomePage/components/SpaceAds';
import CreateYourOwn from '@/shared/features/page/HomePage/components/CreateYourOwn';

// 1. IMPORT mảng mockProducts (có chữ s) TỪ FILE LIB
import { mockProducts } from "@/lib/mockProduct";

// 2. IMPORT INSTORY
import { InStory } from '@/packages/in-story';
import { Fandom } from '@/shared/features/page/HomePage/components/Fandom';
import { QuickGiftFinder } from '@/shared/layout/header/QuickGiftFinder';
import RecentlyViewedNew from '@/packages/browsing-history/components/RecentlyViewedNew';
import BasedOnWhatYouLove from '@/packages/BasedOnWhatYouLove/components/BasedOnWhatYouLove';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, undefined, i18nConfig)),
    },
  };
};

type VideoProps = {
  productVideo: object[]
}

const Home: NextPageWithLayout = () => {
  // MOCK DATA FE ONLY
  // const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : "";
  // const { data: products } = api.medusa.getProducts.useQuery(regionID ? { regionID } : {});
  // const { data: collection } = api.medusa.listCampaigns.useQuery();
  // const { data: priceList } = api.medusa.getPriceList.useQuery();
  // const { data: video } = api.medusa.getVideo.useQuery<VideoProps>();

  // Mock các biến cần thiết cho UI
  const products = mockProducts;
  const collection = [{ id: 'c1', title: 'Mock Campaign' }];
  const priceList = { price_lists: [{ id: 'pl1', title: 'Sale' }, { id: 'pl2', title: 'Top Picks For You' }] };
  const video = { productVideo: [] };

  const productSales = products;
  const productTopPick = products;
  const productSalesData = productSales;
  const productTopPickData = productTopPick;

  return (
    <>
      <Hero />
      <QuickGiftFinder />
      <div >

        <SaleProduct TopSale={productSalesData as any} title={priceList?.price_lists?.[0]?.title as string} />
        <div className='px-[30px]'>
          <RecentlyViewedNew />
          <BasedOnWhatYouLove
            currentProductId="p1"
            category="t-shirt"
            limit={5}
          />

          {/* <Fandom /> */}
          <TopPick product={productTopPickData as any} title={priceList?.price_lists?.[1]?.title as string} />
          <InStory />
          <CreateYourOwn />
          <Trending />

        </div>
      </div>
      <div className='px-[30px]'>
        <AdsSpace />
      </div>

      {/*<Blog /> */}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Home', canonical: '/' }}>
      {page}
    </PrimaryLayout>
  );
};

export default Home;
