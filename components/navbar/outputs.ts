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
    onClickFlashCardsButton: () => {
      local.showFlashCardsDialog.$set(true);
    },
    onHideFlashCardsDialog: () => {
      local.showFlashCardsDialog.$set(false);
    },
  };
}