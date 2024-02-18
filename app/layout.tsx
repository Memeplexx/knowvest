"use server";
import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array';
import { NextAuthProvider } from '@/utils/nextauth.provider';
import StyledComponentsRegistry from '@/utils/style-registry';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { NotifierProvider } from '@/components/notifier';
import StoreProvider from '@/utils/store.provider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"
      children={
        <body
          suppressHydrationWarning={true}
          children={
            <>
              <NextAuthProvider
                children={
                  <StoreProvider
                    children={
                      <NotifierProvider
                        children={
                          <StyledComponentsRegistry
                            children={children}
                          />
                        }
                      />
                    }
                  />
                }
              />
              <SpeedInsights />
              <Analytics />
            </>
          }
        />
      }
    />
  )
}