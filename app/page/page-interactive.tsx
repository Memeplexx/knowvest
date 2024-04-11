"use client";
import { Loader } from "@/components/loader";
import { createPortal } from "react-dom";
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
        children="Sign in"
      />
      {!inputs.initialized ? <></> : createPortal(
        <Loader
          if={inputs.showLoader}
        />,
        document.body
      )}
    </>
  )
}