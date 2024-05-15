import { NoteId } from "@/actions/types";
import { Inputs, Props } from "./constants";


export const useOutputs = (props: Props, inputs: Inputs) => {
  const { localStore, cardRef } = inputs;
  return {
    onScrolledToBottom: () => {
      localStore.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      localStore.index.$set(0);
      props.onSelectNote(noteId);
      cardRef.current!.scrollToTop();
    }
  };
}