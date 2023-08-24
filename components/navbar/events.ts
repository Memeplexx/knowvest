import { signOut } from "next-auth/react"
import { store } from "@/utils/store";

export const useEvents = () => ({
  onClickUserButton: () => {
    store.navBar.showOptions.$toggle()
  },
  onClickSignOut: async () => {
    await signOut();
  },
  onClickSearchButton: () => {
    store.navBar.showDialog.$set(true);
  },
  onHideDialog: () => {
    store.navBar.showDialog.$set(false);
  },
})