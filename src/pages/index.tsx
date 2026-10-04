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
import { HomeGlassIntro } from '@/shared/features/page/HomePage/components/HomeGlassIntro';

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
      <HomeGlassIntro />
      <div className="home-glass-hero"><Hero calm /></div>
      <section id="home-gifts" className="home-glass-gifts" aria-label="Find a gift"><QuickGiftFinder /></section>
      <div className="home-glass-feed">

        <section id="home-deals" className="home-glass-deals" aria-label="Today's deals"><SaleProduct TopSale={productSalesData as any} title={priceList?.price_lists?.[0]?.title as string} /></section>
        <div className="home-glass-sections">
          <section className="home-glass-section"><RecentlyViewedNew /></section>
          <section className="home-glass-section"><BasedOnWhatYouLove
            currentProductId="p1"
            category="t-shirt"
            limit={5}
          /></section>

          {/* <Fandom /> */}
          <section className="home-glass-section"><TopPick product={productTopPickData as any} title={priceList?.price_lists?.[1]?.title as string} /></section>
          <section className="home-glass-section"><InStory /></section>
          <section className="home-glass-section"><CreateYourOwn /></section>
          <section className="home-glass-section"><Trending /></section>

        </div>
      </div>
      <div className="home-glass-sections home-glass-section">
        <AdsSpace />
      </div>

      {/*<Blog /> */}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout appearance="liquid-glass" seo={{ title: 'Home', canonical: '/' }}>
      {page}
    </PrimaryLayout>
  );
};

export default Home;
