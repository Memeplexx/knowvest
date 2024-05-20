import { signOut } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { local } = inputs;
  return {
    onClickUserButton: () => {
      local.showOptions.$toggle()
    },
    onClickSignOut: async () => {
      await signOut();
    },
    onClickSearchButton: () => {
      local.showSearchDialog.$set(true);
    },
    onHideSearchDialog: () => {
      local.showSearchDialog.$set(false);
    },
    onClickFlashCardsButton: () => {
      local.showFlashCardsDialog.$set(true);
    },
    onHideFlashCardsDialog: () => {
      local.showFlashCardsDialog.$set(false);
    },
  };
}