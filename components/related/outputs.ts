import { NoteId } from "@/actions/types";
import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, { store, cardRef }: Inputs) => {
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