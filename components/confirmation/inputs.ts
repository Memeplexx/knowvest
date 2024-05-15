import { useStore } from "@/utils/store-utils";
import { Props, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { localState, localStore } = useStore({ key: props.storeKey, value: initialState });

  return {
    localStore,
    ...localState
  };
}