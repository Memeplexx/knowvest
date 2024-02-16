"use client";
import { Loader } from "@/components/loader";
import { useRecord } from "@/utils/hooks";
import { ProviderButton } from "@/utils/pages/login/styles";
import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, getProviders, signIn } from "next-auth/react";
import { useEffect } from "react";
import { createPortal } from "react-dom";


export default function ProviderButtons() {

  const state = useRecord({
    showLoader: false,
    providers: {} as NonNullable<Awaited<ReturnType<typeof getProviders>>>,
  });

  useEffect(() => {
    getProviders().then(providers => state.set({ providers: providers! })).catch(console.error);
  }, [state]);

  const onClickSignIn = async (providerId: LiteralUnion<BuiltInProviderType> | undefined) => {
    state.set({ showLoader: true });
    signIn(providerId).catch(error => {
      console.error(error);
      state.set({ showLoader: false });
    });
  };
  
  return (
    <>
      {Object.values(state.providers).map(provider => (
        <ProviderButton
          key={provider.name}
          onClick={() => onClickSignIn(provider.id)}
          children={provider.name}
          aria-label={`Sign in with ${provider.name}`}
        />
      ))}
      {!state.showLoader ? <></> : createPortal(<Loader showIf={true} />, document.body)
      }
    </>
  )
}