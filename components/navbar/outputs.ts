import { signOut } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store } = inputs;
  return {
    onClickUserButton: () => {
      store.$local.showOptions.$toggle()
    },
    onClickSignOut: async () => {
      await signOut();
    },
    onClickSearchButton: () => {
      store.$local.showSearchDialog.$set(true);
    },
    onHideSearchDialog: () => {
      store.$local.showSearchDialog.$set(false);
    },
    onClickFlashCardsButton: () => {
      store.$local.showFlashCardsDialog.$set(true);
    },
    onHideFlashCardsDialog: () => {
      store.$local.showFlashCardsDialog.$set(false);
    },
  };
}