import { trpc } from "@/utils/trpc";
import { FlashCardId } from "@/server/dtos";
import { Inputs } from "./constants";

export const useOutputs = ({ activeNoteId, store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const flashCard = await trpc.flashCard.create.mutate({ noteId: activeNoteId });
      store.flashCards.items.$push(flashCard.flashCard);
    },
    onChangeFlashCardText: async (id: FlashCardId, text: string) => {
      const flashCard = await trpc.flashCard.updateText.mutate({ id, text });
      store.flashCards.items.$find.id.$eq(id).$set(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      store.flashCards.confirmDeleteId.$set(id);
    },
    onClickRemoveFlashCard: async (id: FlashCardId) => {
      const flashCard = await trpc.flashCard.delete.mutate({ id });
      store.flashCards.items.$find.id.$eq(flashCard.flashCard.id).$delete();
      notify.success('Flash card deleted');
    },
    onFocusTextEditor: (id: FlashCardId) => {
      store.flashCards.focusId.$set(id);
    },
    onBlurTextEditor: () => {
      store.flashCards.focusId.$set(null);
    },
  };
}