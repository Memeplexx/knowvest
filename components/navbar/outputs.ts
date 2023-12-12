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
      store.navBar.showSearchDialog.$set(true);
    },
    onHideSearchDialog: () => {
      store.navBar.showSearchDialog.$set(false);
    },
    onClickFlashCardsButton: () => {
      store.navBar.showFlashCardsDialog.$set(true);
    },
    onHideFlashCardsDialog: () => {
      store.navBar.showFlashCardsDialog.$set(false);
    },
  };
}