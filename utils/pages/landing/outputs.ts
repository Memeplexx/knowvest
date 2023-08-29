import { signIn, signOut } from "next-auth/react"

export const useOutputs = () => ({
  onClickSignIn: async () => {
    await signIn();
  },
  onClickSignOut: async () => {
    await signOut();
  },
});