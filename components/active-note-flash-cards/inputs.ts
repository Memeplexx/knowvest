import { useStore } from "@/utils/hooks";
import { useMemo } from "react";
import { initialState } from "./constants";
import { useNotifier } from "../notifier";



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

