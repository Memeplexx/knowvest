import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";

export const useOutputs = ({ store, props, cardRef }: Inputs) => {
  return {
    onScrolledToBottom: () => {
      store.relatedItems.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      store.relatedItems.index.$set(0);
      props.onSelectNote(noteId);
      cardRef.current!.scrollToTop();
    },
  };
}