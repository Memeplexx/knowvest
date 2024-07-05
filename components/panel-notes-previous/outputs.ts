import { NoteId } from "@/actions/types";
import { onSelectNote } from "@/utils/app-utils";
import { Inputs, Props } from "./constants";


export const useOutputs = (props: Props, inputs: Inputs) => {
  const { local, router } = inputs;
  return {
    onScrolledToBottom: () => {
      local.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      local.index.$set(0);
      await onSelectNote(router, noteId);
      props.onSelectNote?.(noteId);
    }
  };
}