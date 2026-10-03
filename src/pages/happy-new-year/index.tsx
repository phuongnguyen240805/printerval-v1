"use client"
import HeroComponent from "@/shared/components/Hero";
import { PrimaryLayout } from "@/layouts";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18nConfig from '../../../next-i18next.config';
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { api } from "@/utils/api";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import Recently from "@/packages/browsing-history/components/recently";
import ListStory from "@/shared/components/ListStory";
import CollectStore from "@/shared/components/CollectionStore";
import CreateYourOwn from "@/shared/features/page/HomePage/components/CreateYourOwn";
import Reviews from "@/packages/reviews/Reviews";
import SaleCodeComponent from "@/shared/components/SaleCode";
export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, undefined, i18nConfig)),
    },
  };
};
const ThanksgivingPage: NextPageWithLayout = () => {
  const regionID = typeof window !== 'undefined' ? localStorage.getItem("selected_region") : "";
  const { data: product } = api.medusa.getProducts.useQuery(regionID ? { regionID } : {});
  const { data: categories } = api.medusa.listCategories.useQuery()
  const { data: collection } = api.medusa.listCampaigns.useQuery();

  return (
    <div className="lg:max-w-7xl lg:mx-auto w-full">
      <SaleCodeComponent campaign={collection?.[0]} />
      <HeroComponent product={product as any} categories={categories as any} />
      <CreateYourOwn />
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full px-2"
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-2/3 md:basis-1/2 lg:basis-1/3 pl-4">
              <Reviews star={4} date="11/2/2025" productId="" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="px-2 lg:flex lg:gap-4 lg:items-stretch my-6">
        <ListStory />
        <CollectStore />
      </div>
      <Recently />
    </div>
  )
}
ThanksgivingPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout seo={{ title: 'Happy New Year', canonical: '/happy-new-year' }}>
      {page}
    </PrimaryLayout>
  );
};
export default ThanksgivingPage;
