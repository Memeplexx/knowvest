import { Inputs } from "./constants";
import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { FlashCardId } from "@/actions/types";
import { writeToStoreAndDb } from "@/utils/storage-utils";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard({ noteId: store.$state.activeNoteId });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
    },
    onChangeFlashCardText: async (id: FlashCardId, text: string) => {
      const apiResponse = await updateFlashCardText({ id, text });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (id: FlashCardId) => {
      const apiResponse = await archiveFlashCard({ id });
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}