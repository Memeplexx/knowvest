import { signIn, signOut } from "next-auth/react"

export const useEvents = () => ({
  onClickSignIn: async () => {
    await signIn();
  },
  onClickSignOut: async () => {
    await signOut();
  },
});