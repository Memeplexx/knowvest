import { signOut } from "next-auth/react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { local, store } = inputs;
  return {
    onClickUserButton: () => {
      local.showOptions.$toggle()
    },
    onClickSignOut: async () => {
      await signOut();
    },
    onClickNavigate: () => {
      store.showLoader.$set(true);
    }
  };
}