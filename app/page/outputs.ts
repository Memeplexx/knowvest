import { signIn } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onClickSignIn: async () => {
      inputs.setState(s => ({ ...s, showLoader: true }));
      await signIn();
    },
  };
};