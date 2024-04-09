import { useRecord } from "@/utils/react-utils";
import { Props, Selection } from "./constants";

export const useInputs = (props: Props) => {

  const localState = useRecord({
    selection: 'none' as Selection
  })

  return {
    props,
    ...localState,
  }
}