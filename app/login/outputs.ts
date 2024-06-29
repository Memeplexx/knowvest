import { signIn } from "next-auth/react";

export const useOutputs = () => ({
  onClickProvider: (providerId: string) => async () => {
    await signIn(providerId);
  }
});
