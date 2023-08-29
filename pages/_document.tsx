import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
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
      </body>
    </Html>
  )
}
