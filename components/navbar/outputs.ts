import { signOut } from "next-auth/react"
import { store } from "@/utils/store";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { refs } = inputs;
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
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (refs.floating.elements.domReference === event.target) { return; }
      store.$state.navBar.showOptions && store.navBar.showOptions.$set(false);
    }),
  };
}