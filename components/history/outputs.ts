import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";


export const useOutputs = ({ store, cardRef, props }: Inputs) => {
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