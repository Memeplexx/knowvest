import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { FlashCardId } from "@/actions/types";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store, local, notify } = inputs;
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
      local.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (flashCardId: FlashCardId) => {
      const apiResponse = await archiveFlashCard(flashCardId);
      await writeToStoreAndDb(store, { flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      local.confirmDeleteId.$set(null);
    },
  };
}