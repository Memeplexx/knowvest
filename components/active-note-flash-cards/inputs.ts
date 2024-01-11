import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useMemo } from "react";
import { initialState } from "./constants";
import { useStore } from "@/utils/hooks";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
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

