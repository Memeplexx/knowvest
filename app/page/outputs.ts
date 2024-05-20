import { signIn } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onClickSignIn: async () => {
      inputs.local.showLoader.$set(true);
      await signIn();
    },
  };
};