import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { store } from "@/utils/store-utils";
import { Inputs, Props } from "./constants";


export const useOutputs = (props: Props, inputs: Inputs) => {
  const { router } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      if (store.$state.previousNotesScrollIndex)
        store.previousNotesScrollIndex.$set(0);
      props.onSelectNote?.(noteId);
      await onSelectNote(router, noteId);
    }
  };
}