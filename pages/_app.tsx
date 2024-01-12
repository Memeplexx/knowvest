import { Snackbar } from '@/components/snackbar';
import '@/styles/application.css';
import '@/styles/reset.css';
import '@/utils/array';
import { NotificationContext, StoreContext } from '@/utils/constants';
import { useInputs } from '@/utils/pages/app/inputs';
import { useOutputs } from '@/utils/pages/app/outputs';
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <SessionProvider
      session={session}
      children={
        <StoreContext.Provider
          value={inputs.store}
          children={
            <NotificationContext.Provider
              value={{
                error: outputs.onNotifyError,
                success: outputs.onNotifySuccess,
                info: outputs.onNotifyInfo,
              }}
              children={
                <>
                  <Component
                    {...pageProps}
                  />
                  <Snackbar
                    message={inputs.state.message}
                    status={inputs.state.status}
                    onMessageClear={outputs.onMessageClear}
                  />
                </>
              }
            />
          }
        />
      }
    />
  )
}
