import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext } from "react";
import { initialState } from "./constants";
import { derive } from "olik/derive";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
  const store = useContextForNestedStore(initialState)!;
  const state = store.activeFlashCards.$useState();
  const items = derive(store.flashCards, store.activeNoteId)
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

