import { store } from "@/utils/store-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onScrolledToBottom: () => {
      switch (inputs.routerPathName) {
        case '/app/related':
          store.relatedNotesScrollIndex.$add(1);
          break;
        case '/app/history':
          store.relatedNotesScrollIndex.$add(1);
          break;
      }
    }
  }
}