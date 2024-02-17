"use client";
import { Loader } from "@/components/loader";
import { Snackbar } from "@/components/snackbar";
import { createPortal } from "react-dom";
import { LoginButton } from "./styles";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";


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
          showIf={inputs.showLoader}
        />,
        document.body
      )}
      {!inputs.initialized ? <></> : createPortal(
        <Snackbar
          message={inputs.message}
          status='error'
          onMessageClear={() => inputs.set({ message: '' })}
        />,
        document.body
      )}
    </>
  )
}