import { useEffect, useState } from "react";
import { Props } from "./constants";
import { store } from "@/utils/store";

export const useInputs = (props: Props) => {

  const state = store.historyPanel.$useState();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => setInitialized(true), [])

  return {
    props,
    state: {
      ...state,
      initialized
    }
  };
}
