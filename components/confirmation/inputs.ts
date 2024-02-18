import { useState } from "react";
import { Props, Selection } from "./constants";

export const useInputs = (props: Props) => {

  const [state, setState] = useState({
    selection: 'none' as Selection
  })

  return {
    props,
    state,
    setState,
  }
}