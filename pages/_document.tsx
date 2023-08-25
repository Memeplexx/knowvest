import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head
        children={
          <>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon.png" />
            <meta name="theme-color" content="#000" />
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
