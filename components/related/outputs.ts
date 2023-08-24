import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { store } from "@/utils/store";
import { transact } from "olik";

export const useOutputs = (inputs: Inputs) => {
  const { props } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      trpc.note.view.mutate({ noteId }).catch(console.error);
      const { noteTags, tags } = store.$state;
      const tagIds = noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
      const synonymIds = tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
      transact(() => {
        store.activeNoteId.$set(noteId);
        store.synonymIds.$set(synonymIds);
      })
      props.onSelectNote(noteId);
    }
  };
}