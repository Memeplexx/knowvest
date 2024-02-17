"use client";
import { Loader } from "@/components/loader";
import { ProviderButton } from "@/utils/pages/login/styles";
import { createPortal } from "react-dom";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";


export default function ProviderButtons() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      {Object.values(inputs.providers).map(provider => (
        <ProviderButton
          key={provider.name}
          onClick={() => outputs.onClickSignIn(provider.id)}
          children={provider.name}
          aria-label={`Sign in with ${provider.name}`}
        />
      ))}
      {!inputs.showLoader ? <></> : createPortal(<Loader showIf={true} />, document.body)
      }
    </>
  )
}