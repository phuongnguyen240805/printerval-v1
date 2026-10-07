import type { GetStaticProps } from 'next';
import { type ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../../next-i18next.config';
import { PrimaryLayout } from '@/layouts';
import { Hero } from '@/shared/features/page/HomePage/components/Hero';
import { SaleProduct } from '@/shared/features/page/HomePage/components/Promotions';
import { TopPick } from '@/shared/features/page/HomePage/components/TopPick';
import { Trending } from '@/shared/features/page/HomePage/components/Trending';
import { AdsSpace } from '@/shared/features/page/HomePage/components/HomeReferenceSpace';
import CreateYourOwn from '@/shared/features/page/HomePage/components/CreateYourOwn';
import Blog from '@/shared/features/page/HomePage/components/BlogClone';
import ReferAndSupport from '@/shared/features/page/HomePage/components/ReferAndSupport';
import { mockProducts } from '@/lib/mockProduct';
import { InStory } from '@/packages/in-story';
import { QuickGiftFinder } from '@/shared/layout/header/QuickGiftFinder';
import RecentlyViewedNew from '@/packages/browsing-history/components/RecentlyViewedNew';
import BasedOnWhatYouLove from '@/packages/BasedOnWhatYouLove/components/BasedOnWhatYouLove';
import { HomeGlassIntro } from '@/shared/features/page/HomePage/components/HomeGlassIntro';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => ({
  props: {
    ...(await serverSideTranslations(locale, undefined, i18nConfig)),
  },
});

const Home: NextPageWithLayout = () => {
  const products = mockProducts;
  const priceList = {
    price_lists: [
      { id: 'pl1', title: 'Sale' },
      { id: 'pl2', title: 'Top Picks For You' },
    ],
  };

  return (
    <>
      <HomeGlassIntro />
      <div className="home-glass-hero">
        <Hero calm />
      </div>

      <section id="home-gifts" className="home-glass-gifts" aria-label="Find a gift">
        <QuickGiftFinder />
      </section>

      <div className="home-glass-feed">
        <section id="home-deals" className="home-glass-deals" aria-label="Today's deals">
          <SaleProduct
            TopSale={products as any}
            title={priceList.price_lists[0]?.title as string}
          />
        </section>

        <div className="home-glass-sections">
          <section className="home-glass-section">
            <RecentlyViewedNew />
          </section>

          <section className="home-glass-section">
            <BasedOnWhatYouLove currentProductId="p1" category="t-shirt" limit={5} />
          </section>

          <section className="home-glass-section">
            <TopPick
              product={products as any}
              title={priceList.price_lists[1]?.title as string}
            />
          </section>

          <section className="home-glass-section">
            <CreateYourOwn />
          </section>

          <section className="home-glass-section">
            <Trending />
          </section>
        </div>
      </div>

      <div className="home-glass-sections home-glass-section">
        <AdsSpace />
      </div>

      <div className="home-glass-sections home-glass-section">
        <InStory />
      </div>

      <div className="home-glass-sections home-glass-section">
        <ReferAndSupport />
      </div>

      <div className="home-glass-sections home-glass-section">
        <Blog />
      </div>
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
