import { useRecord } from "@/utils/react-utils";
import { Selection } from "./constants";

export const useInputs = () => {

  const localState = useRecord({
    selection: 'none' as Selection
  })

  return localState;
}