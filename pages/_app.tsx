import '@/styles/reset.css';
import '@/styles/application.css';
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import { augmentOlikForReact } from 'olik-react'
import '@/utils/array';
import { useEffect } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  augmentOlikForReact() // invoke before initializing store
  useEffect(() => {
    import('fastclick')
      .then(({ default: FastClick }) => (FastClick as unknown as { attach: (arg: HTMLElement) => void }).attach(document.body))
      .catch(console.error);
  }, []);
  return (
    <SessionProvider session={session} >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
