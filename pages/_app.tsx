import '@/styles/reset.css';
import '@/styles/application.css';
import '@/styles/codemirror.css';
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "styled-components";
import { theme } from '@/utils/styles';
import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import { augmentOlikForReact } from 'olik-react'
import '@/utils/array';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  augmentOlikForReact() // invoke before initializing store
  return (
    <SessionProvider session={session} >
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
