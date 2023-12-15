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
      store.flashCards.$find.id.$eq(id).$set(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => () => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: (id: FlashCardId) => async () => {
      const flashCard = await trpc.flashCard.delete.mutate({ id });
      store.flashCards.$find.id.$eq(flashCard.flashCard.id).$delete();
      notify.success('Flash card deleted');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}