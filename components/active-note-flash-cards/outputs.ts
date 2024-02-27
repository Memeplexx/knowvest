import { Inputs } from "./constants";
import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { FlashCardId } from "@/actions/types";
import { writeToStoreAndDb } from "@/utils/storage-utils";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard(store.$state.activeNoteId);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
    },
    onChangeFlashCardText: async (flashCardId: FlashCardId, text: string) => {
      const apiResponse = await updateFlashCardText(flashCardId, text);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (flashCardId: FlashCardId) => {
      const apiResponse = await archiveFlashCard(flashCardId);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}