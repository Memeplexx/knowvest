import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { local, cardRef, store } = inputs;
  return {
    onScrolledToBottom: () => {
      local.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      local.index.$set(0);
      await onSelectNote(store, noteId);
      cardRef.current!.scrollToTop();
    },
  };
}