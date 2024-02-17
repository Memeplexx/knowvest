"use client";
import { CenterContent, Divider, ProviderButton, ProviderButtonContent, Providers, SubTitle, Title, Wrapper } from "./styles";
import { Loader } from "@/components/loader";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";


export default function PageInteractive() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
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
                  $count={Object.keys(inputs.providers).length}
                  children={
                    Object.values(inputs.providers).map(provider => (
                      <ProviderButton
                        key={provider.name}
                        onClick={() => outputs.onClickSignIn(provider.id)}
                        children={
                          <ProviderButtonContent
                            children={provider.name}
                          />
                        }
                        aria-label={`Sign in with ${provider.name}`}
                      />
                    ))
                  }
                />
              </>
            }
          />
        }
      />
      <Loader
        showIf={inputs.showLoader}
      />
    </>
  )
}