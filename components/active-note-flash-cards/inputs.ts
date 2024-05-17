import { useStore } from "@/utils/store-utils";
import { useMemo } from "react";
import { useNotifier } from "../notifier";
import { initialState } from "./constants";



export const useInputs = () => {

  const notify = useNotifier();
  const { store, state } = useStore('activeFlashCards',  initialState);
  const { flashCards, activeNoteId } = state;
  const items = useMemo(() => {
    return flashCards.filter(fc => fc.noteId === activeNoteId);
  }, [flashCards, activeNoteId]);

  return {
    notify,
    store,
    state,
    items,
  }
}

