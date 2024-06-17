import { useLocalStore, useStore } from "@/utils/store-utils";
import { initialState } from "./constants";


export const useInputs = () => {
  const { store, state: { headerExpanded } } = useStore();
  const { local, state } = useLocalStore('home', initialState);
  return {
    store,
    local,
    headerExpanded,
    ...state
  };
}
