import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { useContext } from "react";
import { initialState } from "./constants";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
  const store = useContextForNestedStore(initialState)!;
  const state = store.activeFlashCards.$useState();

  return {
    notify,
    store,
    ...state,
    confirmDeleteId: store.activeFlashCards.confirmDeleteId.$useState(),
    flashCards: store.flashCards.$useState(),
  }
}

