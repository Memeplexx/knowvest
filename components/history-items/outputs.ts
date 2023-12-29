import { NoteId } from "@/server/dtos";
import { Inputs } from "./constants";

export const useOutputs = ({ store, props }: Inputs) => {
  return {
    onSelectNote: (noteId: NoteId) => async () => {
      store.historyItems.index.$set(0);
      props.onSelectNote(noteId);
    }
  };
}