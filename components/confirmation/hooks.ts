import { useState } from "react";
import { Props, Selection } from "./constants";

export const useHooks = (props: Props) => {

  const [selection, setSelection] = useState<Selection>('none');

  return {
    selection,
    setSelection,
    ...props,
  }
}