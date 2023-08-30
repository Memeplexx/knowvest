import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from "styled-components";
import { Analytics } from '@vercel/analytics/react';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />), //gets the styles from all the components inside <App>
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {/*👇 insert the collected styles to the html document*/}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head
          children={
            <>
              <link
                rel="manifest"
                href="/manifest.webmanifest"
              />
              <link
                rel="apple-touch-icon"
                href="/icon.png"
              />
              <meta
                name="theme-color"
                content="#000"
              />
              <meta
                name="viewport"
                content="user-scalable=yes, width=device-width, initial-scale=1.0"
              />
              <meta
                name="apple-mobile-web-app-capable"
                content="yes"
              />
              <meta
                name="description"
                content="Knowledge Harvest is a note taking app that helps you organize your thoughts and ideas."
              />
            </>
          }
        />
        <body>
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    )
  }
}

