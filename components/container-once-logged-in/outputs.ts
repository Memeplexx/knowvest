import { routes } from "@/utils/app-utils";
import { store } from "@/utils/store-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  return {
    onScrolledToBottom: () => {
      switch (inputs.routerPathName) {
        case routes.related:
          store.relatedNotesScrollIndex.$add(1);
          break;
        case routes.previous:
          store.relatedNotesScrollIndex.$add(1);
          break;
      }
    }
  }
}