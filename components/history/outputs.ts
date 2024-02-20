import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";

export const useOutputs = ({ store, props }: Inputs) => {
  return {
    onSelectNote: async (noteId: NoteId) => {
      store.historyItems.index.$set(0);
      props.onSelectNote(noteId);
    }
  };
}