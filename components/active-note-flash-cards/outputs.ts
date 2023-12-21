import { FlashCardId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { writeToIndexedDB } from "@/utils/functions";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await trpc.flashCard.create.mutate({ noteId: store.$state.activeNoteId });
      await writeToIndexedDB({ flashCards: apiResponse.flashCard });
      store.flashCards.$push(apiResponse.flashCard);
    },
    onChangeFlashCardText: (id: FlashCardId) => async (text: string) => {
      const flashCard = await trpc.flashCard.updateText.mutate({ id, text });
      await writeToIndexedDB({ flashCards: flashCard.flashCard });
      store.flashCards.$mergeMatching.id.$withOne(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => () => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: (id: FlashCardId) => async () => {
      const apiResponse = await trpc.flashCard.archive.mutate({ id });
      await writeToIndexedDB({ flashCards: apiResponse.flashCard });
      store.flashCards.$mergeMatching.id.$withOne(apiResponse.flashCard);
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}