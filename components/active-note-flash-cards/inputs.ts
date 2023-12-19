import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext } from "react";
import { initialState, tag } from "./constants";
import { derive } from "olik/derive";
import { useNestedStore } from "@/utils/hooks";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
  const store = useNestedStore(initialState)!;
  const state = store.activeFlashCards.$useState();
  const items = derive(tag)
    .$from(store.flashCards, store.activeNoteId)
    .$with((flashCards, activeNoteid) => flashCards.filter(fc => !fc.isArchived && fc.noteId === activeNoteid))
    .$useState();

  return {
    notify,
    store,
    ...state,
    items,
    confirmDeleteId: store.activeFlashCards.confirmDeleteId.$useState(),
  }
}

