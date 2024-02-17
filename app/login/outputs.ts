import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, signIn } from "next-auth/react";
import { Inputs } from "./constants";
import { useSearchParams } from "next/navigation";

export const useOutputs = (inputs: Inputs) => {
  const params = useSearchParams()!;
  return {
    onClickSignIn: async (providerId: LiteralUnion<BuiltInProviderType> | undefined) => {
      inputs.set({ showLoader: true });
      signIn(providerId, { callbackUrl: params.get('callbackUrl')! }).catch(error => {
        console.error(error);
        inputs.set({ showLoader: false });
      });
    },
  }
};