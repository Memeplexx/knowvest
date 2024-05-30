import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";

export const useSharedFunctions = ({ store }: Inputs) => ({
  onSelectNote: async (noteId: NoteId) => {
    const tagIds = store.$state.noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
    const synonymIds = store.$state.tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId);
    store.activeNoteId.$set(noteId);
    store.synonymIds.$set(synonymIds);
    store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
    await viewNote(noteId);
  }
});
