import { useStore } from "@/utils/store-utils";
import { useMemo } from "react";
import { useNotifier } from "../notifier";
import { initialState } from "./constants";



export const useInputs = () => {

  const notify = useNotifier();
  const { store, activeFlashCards, flashCards, activeNoteId } = useStore(initialState);
  const items = useMemo(() => {
    return flashCards.filter(fc => !fc.isArchived && fc.noteId === activeNoteId);
  }, [flashCards, activeNoteId]);

  return {
    notify,
    store,
    ...activeFlashCards,
    items,
  }
}

