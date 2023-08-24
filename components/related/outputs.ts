import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { store } from "@/utils/store";

export const useOutputs = (inputs: Inputs) => {
  const { props } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      trpc.note.view.mutate({ noteId }).catch(console.error);
      store.activeNoteId.$set(noteId);
      const tagIds = store.noteTags.$state.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
      const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
      store.synonymIds.$set(synonymIds);
      props.onSelectNote(noteId);
    }
  };
}