import { signOut } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store } = inputs;
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