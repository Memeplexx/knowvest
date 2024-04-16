import { NoteId } from "@/actions/types";
import { Inputs, Props } from "./constants";


export const useOutputs = (props: Props, inputs: Inputs) => {
  const { store, cardRef } = inputs;
  return {
    onScrolledToBottom: () => {
      store.historyItems.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      store.historyItems.index.$set(0);
      props.onSelectNote(noteId);
      cardRef.current!.scrollToTop();
    }
  };
}