"use server";
import { getProviders } from "next-auth/react";
import { Suspense } from "react";
import { LoginInteractive } from "./page-interactive";
import { CenterContent, Divider, ProviderButton, ProviderButtonContent, Providers, SubTitle, Title, Wrapper } from "./styles";


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
                  $count={providers.length}
                  children={
                    providers.map(provider => (
                      <ProviderButton
                        key={provider.name}
                        aria-label={`Sign in with ${provider.name}`}
                        data-provider-id={provider.id}
                        children={
                          <ProviderButtonContent
                            children={provider.name}
                          />
                        }
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
        children={<LoginInteractive />}
      />
    </>
  )
}