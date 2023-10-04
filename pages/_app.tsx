import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array';
import { StoreContext, initialAppState } from '@/utils/constants';
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { createStore } from 'olik';
import { augmentOlikForReact } from 'olik-react';
import { useMemo } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);
  return (
    <SessionProvider
      session={session}
      children={
        <StoreContext.Provider
          value={store}
          children={
            <Component
              {...pageProps}
            />
          }
        />
      }
    />
  )
}
