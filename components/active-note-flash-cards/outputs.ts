import { FlashCardId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";

export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateFlashCard: async () => {
      const apiResponse = await trpc.flashCard.create.mutate({ noteId: store.$state.activeNoteId });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
    },
    onChangeFlashCardText: (id: FlashCardId) => async (text: string) => {
      const apiResponse = await trpc.flashCard.updateText.mutate({ id, text });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
    },
    onClickRequestDeleteFlashCard: (id: FlashCardId) => () => {
      store.activeFlashCards.confirmDeleteId.$set(id);
    },
    onConfirmRemoveFlashCard: (id: FlashCardId) => async () => {
      const apiResponse = await trpc.flashCard.archive.mutate({ id });
      await indexeddb.write(store, { flashCards: apiResponse.flashCard });
      notify.success('Flash card archived');
    },
    onCancelRemoveFlashCard: () => {
      store.activeFlashCards.confirmDeleteId.$set(null);
    },
  };
}