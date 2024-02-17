import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, signIn } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => ({
  onClickSignIn: async (providerId: LiteralUnion<BuiltInProviderType> | undefined) => {
    inputs.set({ showLoader: true });
    signIn(providerId).catch(error => {
      console.error(error);
      inputs.set({ showLoader: false });
    });
  },
});