"use client";

import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array';
import { NotificationContext, StoreContext } from '@/utils/constants'
import { useInputs } from './inputs';
import { SessionProvider } from 'next-auth/react';
import { useOutputs } from './outputs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider
          children={
            <StoreContext.Provider
              value={{ store: inputs.store, notesSorted: inputs.notesSorted }}
              children={
                <NotificationContext.Provider
                  value={{
                    error: outputs.onNotifyError,
                    success: outputs.onNotifySuccess,
                    info: outputs.onNotifyInfo,
                  }}
                  children={children}
                />
              }
            />
          }
        />
      </body>
    </html>
  )
}