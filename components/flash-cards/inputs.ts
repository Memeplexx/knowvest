import { StoreContext } from "@/utils/constants";
import { NotificationContext } from "@/utils/pages/home/constants";
import { trpc } from "@/utils/trpc";
import { useContext, useEffect } from "react";

export const useInputs = () => {
  const store = useContext(StoreContext)!;
  const activeNoteId = store.activeNoteId.$useState();
  useEffect(() => {
    trpc.flashCard.listForNote
      .query({ noteId: activeNoteId })
      .then(response => store.flashCards.$set(response.flashCards));
  }, [activeNoteId])
  return {
    flashCards: store.flashCards.$useState(),
    confirmDeleteFlashCardId: store.flashCardPanel.confirmDeleteFlashCardId.$useState(),
    notify: useContext(NotificationContext)!,
    store,
  }
}