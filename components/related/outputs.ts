import { NoteId } from "@/actions/types";
import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { local, cardRef } = inputs;
  return {
    onScrolledToBottom: () => {
      local.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      local.index.$set(0);
      props.onSelectNote(noteId);
      cardRef.current!.scrollToTop();
    },
  };
}