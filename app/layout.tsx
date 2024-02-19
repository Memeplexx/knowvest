"use server";
import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array-utils';
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
        <>
          <head
            children={
              <>
                <title
                  children='Knowledge Harvest'
                />
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
                  content="user-scalable=no, width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1"
                />
                <meta
                  name="apple-mobile-web-app-capable"
                  content="yes"
                />
                <meta
                  name="description"
                  content="Knowledge Harvest is a note taking app that helps you organize your thoughts and ideas."
                />
                <link
                  rel="icon"
                  href="/images/farm.svg"
                  sizes="any"
                />
                <link
                  rel="icon"
                  href="/images/farm.svg?<generated>"
                  type="image/<generated>"
                  sizes="<generated>"
                />
                <link
                  rel="apple-touch-icon"
                  href="/images/farm.svg?<generated>"
                  type="image/<generated>"
                  sizes="<generated>"
                />
              </>
            }
          />
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
        </>
      }
    />
  )
}