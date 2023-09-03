import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { store } from "@/utils/store";
import { transact } from "olik";

export const useOutputs = (inputs: Inputs) => {
  const { props } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
      const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
      transact(() => {
        store.activeNoteId.$set(noteId);
        store.synonymIds.$set(synonymIds);
        store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      })
      props.onSelectNote(noteId);
      await trpc.note.view.mutate({ noteId });
    }
  };
}