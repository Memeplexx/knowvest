import { signIn } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { state } = inputs;
  return {
    onClickSignIn: async () => {
      state.set({ showLoader: true });
      await signIn();
    },
  };
};