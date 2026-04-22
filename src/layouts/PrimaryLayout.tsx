import React from 'react';
import { NextSeo, type NextSeoProps } from 'next-seo';
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { AppSidebar } from '@/shared/ui/app-sidebar';
import { Footer } from '@/shared/layout/footer/Footer';
import { Toaster } from 'sonner';
import { Header } from '@/shared/layout/header/Header';



interface PrimaryLayoutProps extends React.PropsWithChildren {
  seo: NextSeoProps;
}

export const PrimaryLayout = ({ seo, children }: PrimaryLayoutProps) => {
  const data = undefined;

  return (
    <>
      <NextSeo noindex={true} nofollow={true} {...seo} />
      <Header />
      {children}
      <Toaster />
      <Footer />
    </>
  );
};
