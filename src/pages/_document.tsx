import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';
import React from 'react';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render(): JSX.Element {
    return (
      <Html lang="en" className="liquid-site" data-scroll-behavior="smooth">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="format-detection" content="telephone=no" />
          <Script
            src="https://app.rybbit.io/api/script.js"
            data-site-id="fa248f9d5364"
            defer
          ></Script>
        </Head>
        <body className="font-sans">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
