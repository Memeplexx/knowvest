import { useRecord } from "@/utils/hooks";
import { initialTransientState } from "./constants";
import { augmentOlikForReact } from "olik-react";
import { createStore } from "olik";
import { initialAppState } from "@/utils/constants";
import { useMemo } from "react";
import { getNotesSorted } from "@/utils/functions";


export const useInputs = () => {

  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);
  const state = useRecord(initialTransientState);
  const notes = store.notes.$useState();
  const notesSorted = useMemo(() => getNotesSorted(notes), [notes]);

  return {
    store,
    state,
    notesSorted,
  }

}
