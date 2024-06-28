import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";
import { useSharedFunctions } from "./shared";

export const useOutputs = (inputs: Inputs) => {
  const shared = useSharedFunctions(inputs);
  return {
    onClickRelatedNote: async (noteId: NoteId) => {
      await shared.onSelectNote(noteId);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      await shared.onSelectNote(noteId);
    },
  }
};