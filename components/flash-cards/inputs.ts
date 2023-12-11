import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { trpc } from "@/utils/trpc";
import { useContext, useEffect } from "react";
import { initialState } from "./constants";



export const useInputs = () => {
  const notify = useContext(NotificationContext)!;
  const store = useContextForNestedStore(initialState)!;
  const state = store.flashCards.$useState();
  const activeNoteId = store.activeNoteId.$useState();
  useEffect(() => {
    trpc.flashCard.listForNote
      .query({ noteId: activeNoteId })
      .then(response => store.flashCards.items.$set(response.flashCards));
  }, [activeNoteId]);
  return {
    notify,
    store,
    ...state,
    activeNoteId,
  }
}

