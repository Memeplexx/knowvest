import { useContextForNestedStore } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { trpc } from "@/utils/trpc";
import { useContext, useMemo } from "react";
import { initialState } from "./constants";



export const useInputs = () => {

  const notify = useContext(NotificationContext)!;
  const store = useContextForNestedStore(initialState)!;
  const state = store.flashCards.$useState();
  const activeNoteId = store.activeNoteId.$useState();

  useMemo(() => {
    store.flashCards.loading.$set(true);
    trpc.flashCard.listForNote.query({ noteId: activeNoteId })
      .then(response => store.flashCards.items.$set(response.flashCards))
      .then(() => store.flashCards.loading.$set(false));
  }, [activeNoteId]);

  return {
    notify,
    store,
    ...state,
    activeNoteId,
  }
}

