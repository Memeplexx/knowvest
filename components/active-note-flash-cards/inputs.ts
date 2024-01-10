import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext, useMemo } from "react";
import { initialState, tag } from "./constants";
import { useNestedStore } from "@/utils/hooks";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
  const { store, state } = useNestedStore(tag, initialState)!;
  const flashCards = store.flashCards.$useState();
  const activeNoteId = store.activeNoteId.$useState();
  const items = useMemo(() => {
    return flashCards.filter(fc => !fc.isArchived && fc.noteId === activeNoteId);
  }, [flashCards, activeNoteId]);

  return {
    notify,
    store,
    ...state,
    items,
    confirmDeleteId: store.activeFlashCards.confirmDeleteId.$useState(),
  }
}

