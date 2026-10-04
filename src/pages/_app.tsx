import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { api } from '@/utils/api';
import { Inter } from 'next/font/google';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { DefaultSeo } from 'next-seo';
import NextNProgress from 'nextjs-progressbar';
import SEO from '../../next-seo.config';
import i18nConfig from '../../next-i18next.config';
import '@/styles/globals.css';
import '@/styles/liquid-tokens.css';
import '@/styles/home-glass.css';
import '@/styles/liquid-site.css';
import { LiquidTheme } from '@/shared/ui/liquid/LiquidTheme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export type NextPageWithLayout<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <main className={`${inter.variable} font-sans home-glass`}>
      <LiquidTheme>
        <DefaultSeo {...SEO} />
        {getLayout(
          <>
            <NextNProgress
              color="#8b5cf6"
              height={3}
              options={{ showSpinner: false }}
            />
            <Component {...pageProps} />
          </>
        )}
        <Analytics />
      </LiquidTheme>
    </main>
  );
}

export default api.withTRPC(appWithTranslation(MyApp, i18nConfig));
