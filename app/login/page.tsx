"use client";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useOutputs } from "./outputs";
import { CenterContent, Divider, LoginWrapper, ProviderButton, Providers, SubTitle, Title } from "./styles";


export default function Page() {
  const outputs = useOutputs();
  return (
    <LoginWrapper
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
                  authOptions.providers.map(provider => (
                    <ProviderButton
                      key={provider.name}
                      aria-label={`Sign in with ${provider.name}`}
                      children={provider.name}
                      onClick={outputs.onClickProvider(provider.id)}
                    />
                  ))
                }
              />
            </>
          }
        />
      }
    />
  )
}