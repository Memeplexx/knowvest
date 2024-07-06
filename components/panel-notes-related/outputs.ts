import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { store } from "@/utils/store-utils";
import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { router } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      if (store.$state.relatedNotesScrollIndex)
        store.relatedNotesScrollIndex.$set(0);
      await onSelectNote(router, noteId);
      props.onSelectNote?.(noteId);
    },
  };
}