"use server";
import { OverlayNotifier } from '@/components/overlay-notifier';
import '@/styles/application.css';
import '@/styles/reset.css';
import { NextAuthProvider } from '@/utils/auth-utils';
import { GlobalStylesProvider } from '@/utils/style-provider';
import StyledComponentsRegistry from '@/utils/style-utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";


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
                    <GlobalStylesProvider
                      children={
                        <OverlayNotifier
                          storeKey='notifier'
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
                <SpeedInsights debug={false} />
                <Analytics debug={false} />
              </>
            }
          />
        </>
      }
    />
  )
}