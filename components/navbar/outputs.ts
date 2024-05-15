import { signOut } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { localStore } = inputs;
  return {
    onClickUserButton: () => {
      localStore.showOptions.$toggle()
    },
    onClickSignOut: async () => {
      await signOut();
    },
    onClickSearchButton: () => {
      localStore.showSearchDialog.$set(true);
    },
    onHideSearchDialog: () => {
      localStore.showSearchDialog.$set(false);
    },
    onClickFlashCardsButton: () => {
      localStore.showFlashCardsDialog.$set(true);
    },
    onHideFlashCardsDialog: () => {
      localStore.showFlashCardsDialog.$set(false);
    },
  };
}