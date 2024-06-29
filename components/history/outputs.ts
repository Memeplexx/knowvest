import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { Inputs } from "./constants";


export const useOutputs = (inputs: Inputs) => {
  const { local, cardRef, store, router } = inputs;
  return {
    onScrolledToBottom: () => {
      local.index.$add(1);
    },
    onSelectNote: (noteId: NoteId) => async () => {
      local.index.$set(0);
      await onSelectNote(store, router, noteId);
      cardRef.current!.scrollToTop();
    }
  };
}