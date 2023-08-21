import { signOut } from "next-auth/react"
import { useHooks } from "./hooks";

export const useEvents = (hooks: ReturnType<typeof useHooks>) => ({
  onClickUserButton: () => {
    hooks.store.showOptions.$toggle()
  },
  onClickSignOut: async () => {
    await signOut();
  },
  onClickSearchButton: () => {
    hooks.store.showDialog.$set(true);
  },
  onHideDialog: () => {
    hooks.store.showDialog.$set(false);
  },
})