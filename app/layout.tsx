"use server";
import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array';
import { NextAuthProvider } from '@/utils/nextauth.provider';
import SnackBarProvider from '@/utils/snackbar.provider';
import StoreProvider from '@/utils/store.provider';
import StyledComponentsRegistry from '@/utils/style-registry';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <NextAuthProvider
          children={
            <StoreProvider
              children={
                <SnackBarProvider
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
      </body>
    </html>
  )
}