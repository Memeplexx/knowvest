import { trpc } from "@/utils/trpc";
import { FlashCardId } from "@/server/dtos";
import { Inputs } from "./constants";

export const useOutputs = ({ activeNoteId, store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const flashCard = await trpc.flashCard.create.mutate({ noteId: activeNoteId });
      store.flashCards.items.$push(flashCard.flashCard);
    },
    onChangeFlashCardText: (id: FlashCardId) => async (text: string) => {
      const flashCard = await trpc.flashCard.updateText.mutate({ id, text });
      store.flashCards.items.$find.id.$eq(id).$set(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => () => {
      store.flashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: (id: FlashCardId) => async () => {
      const flashCard = await trpc.flashCard.delete.mutate({ id });
      store.flashCards.items.$find.id.$eq(flashCard.flashCard.id).$delete();
      notify.success('Flash card deleted');
    },
    onCancelRemoveFlashCard: () => {
      store.flashCards.confirmDeleteId.$set(null);
    },
  };
}