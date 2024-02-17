import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";
import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/app/actions/flashcard";
import { FlashCardId } from "@/utils/types";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard({ noteId: store.$state.activeNoteId });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
    },
    onChangeFlashCardText: async (id: FlashCardId, text: string) => {
      const apiResponse = await updateFlashCardText({ id, text });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (id: FlashCardId) => {
      const apiResponse = await archiveFlashCard({ id });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}