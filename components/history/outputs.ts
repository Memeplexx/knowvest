import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { Inputs, Props } from "./constants";


export const useOutputs = (props: Props, inputs: Inputs) => {
  const { local, store, router } = inputs;
  return {
    onScrolledToBottom: () => {
      local.index.$add(1);
    },
    onSelectNote: (noteId: NoteId) => async () => {
      local.index.$set(0);
      await onSelectNote(store, router, noteId);
      props.onSelectNote?.(noteId);
    }
  };
}