import { useRecord } from "@/utils/hooks";
import { initialTransientState } from "./constants";
import { augmentOlikForReact } from "olik-react";
import { createStore } from "olik";
import { initialAppState } from "@/utils/constants";
import { useMemo } from "react";


export const useInputs = () => {

  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);
  const state = useRecord(initialTransientState);

  return {
    store,
    state,
  }

}
