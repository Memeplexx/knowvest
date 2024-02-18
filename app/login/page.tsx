"use server";
import { getProviders } from "next-auth/react";
import { Suspense } from "react";
import { LoginEvents } from "./events";
import { CenterContent, Divider, ProviderButton, Providers, SubTitle, Title, Wrapper } from "./styles";


export default async function PageInteractive() {
  const providers = Object.values((await getProviders())!);
  return (
    <>
      <Wrapper
        children={
          <CenterContent
            children={
              <>
                <Title
                  children="know-vest"
                />
                <SubTitle
                  children="sign in options"
                />
                <Divider />
                <Providers
                  children={
                    providers.map(provider => (
                      <ProviderButton
                        key={provider.name}
                        aria-label={`Sign in with ${provider.name}`}
                        data-provider-id={provider.id}
                        children={provider.name}
                      />
                    ))
                  }
                />
              </>
            }
          />
        }
      />
      <Suspense
        children={<LoginEvents />}
      />
    </>
  )
}