import { LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { state } = inputs;
  return {
    onClickSignIn: async (providerId: LiteralUnion<BuiltInProviderType> | undefined) => {
      state.set({ showLoader: true });
      await signIn(providerId);
    },
  };
};