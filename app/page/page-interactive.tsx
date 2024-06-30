"use client";
import { OverlayLoader } from "@/components/overlay-loader";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { LoginButton } from "./styles";


export default function PageInteractive() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <>
      <LoginButton
        onClick={outputs.onClickSignIn}
        children='Sign in'
      />
      <OverlayLoader
        if={inputs.showLoader}
      />
    </>
  )
}