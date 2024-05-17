import { useStore } from "@/utils/store-utils";
import { Props, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { store, state } = useStore( props.storeKey,  initialState);

  return {
    store,
    state,
  };
}