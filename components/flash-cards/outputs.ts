import { trpc } from "@/utils/trpc";
import { State } from "./constants";
import { FlashCardId } from "@/server/dtos";

export const useOutputs = (state: State) => {
  return {
    onClickCreateFlashCard: async () => {
      const flashCard = await trpc.flashCard.create.mutate({ noteId: state.store.$state.activeNoteId });
      state.store.flashCards.$push(flashCard.flashCard);
    },
    onChangeFlashCardText: async (id: FlashCardId, text: string) => {
      const flashCard = await trpc.flashCard.updateText.mutate({ id, text });
      state.store.flashCards.$find.id.$eq(id).$set(flashCard.flashCard);
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => {
      state.store.flashCardPanel.confirmDeleteFlashCardId.$set(id);
    },
    onClickRemoveFlashCard: async (id: FlashCardId) => {
      const flashCard = await trpc.flashCard.delete.mutate({ id });
      state.store.flashCards.$find.id.$eq(flashCard.flashCard.id).$delete();
      state.notify.success('Flash card deleted');
    },
  };
}