import { FlashCardId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const flashCard = await trpc.flashCard.create.mutate({ noteId: store.$state.activeNoteId });
      store.flashCards.$push(flashCard.flashCard);
    },
    onChangeFlashCardText: (id: FlashCardId) => async (text: string) => {
      const flashCard = await trpc.flashCard.updateText.mutate({ id, text });
      store.flashCards.$mergeMatching.id.$withOne(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => () => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: (id: FlashCardId) => async () => {
      const apiResponse = await trpc.flashCard.archive.mutate({ id });
      store.flashCards.$mergeMatching.id.$withOne(apiResponse.flashCard);
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}