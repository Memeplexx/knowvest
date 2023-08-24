import { Props, Selection } from "./constants";
import { useRecord } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const state = useRecord({ selection: 'none' as Selection })

  return {
    state,
    props,
  }
}