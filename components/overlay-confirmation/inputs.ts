import { useLocalStore } from "@/utils/store-utils";
import { Props, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { local, state } = useLocalStore(props.storeKey, initialState);

  return {
    local,
    ...state,
  };
}