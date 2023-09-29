import { store } from "@/utils/store";
import { signOut } from "next-auth/react";

export const useOutputs = () => {
  return {
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
  };
}