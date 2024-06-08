import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { FlashCardId } from "@/actions/types";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store, local, notify } = inputs;
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard(store.$state.activeNoteId);
      store.flashCards.$push(apiResponse.flashCard);
    },
    onChangeFlashCardText: async (flashCardId: FlashCardId, text: string) => {
      const apiResponse = await updateFlashCardText(flashCardId, text);
      store.flashCards.$mergeMatching.id.$with(apiResponse.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      local.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: async (flashCardId: FlashCardId) => {
      const apiResponse = await archiveFlashCard(flashCardId);
      store.flashCards.$find.id.$eq(apiResponse.flashCard.id).$delete();
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      local.confirmDeleteId.$set(null);
    },
  };
}