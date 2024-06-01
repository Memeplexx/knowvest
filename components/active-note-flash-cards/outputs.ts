import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { FlashCardId } from "@/actions/types";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store, local, notify, storage } = inputs;
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard(store.$state.activeNoteId);
      await storage.write({ flashCards: apiResponse.flashCard });
    },
    onChangeFlashCardText: async (flashCardId: FlashCardId, text: string) => {
      const apiResponse = await updateFlashCardText(flashCardId, text);
      await storage.write({ flashCards: apiResponse.flashCard });
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      local.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (flashCardId: FlashCardId) => {
      const apiResponse = await archiveFlashCard(flashCardId);
      await storage.write({ flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      local.confirmDeleteId.$set(null);
    },
  };
}