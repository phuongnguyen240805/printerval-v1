import React from 'react';
import { NextSeo, type NextSeoProps } from 'next-seo';
import { Footer } from '@/shared/layout/footer/Footer';
import HeaderBlog from '@/shared/features/page/blog/header';



interface LayoutBlogProps extends React.PropsWithChildren {
  seo: NextSeoProps;
}

export const LayoutBlog = ({ seo, children }: LayoutBlogProps) => {
  // TODO: Add collection router
  // const { data } = api.collection.all.useQuery();
  const data = undefined;

  return (
    <>
      <NextSeo noindex={true} nofollow={true} {...seo} />
      <HeaderBlog />
      {children}
      <Footer />
    </>
  );
};
