import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { State } from "./constants";

export const useSharedFunctions = ({ store }: State) => ({
  onSelectNote: async (noteId: NoteId) => {
    const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
    const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
    store.activeNoteId.$set(noteId);
    store.synonymIds.$setUnique(synonymIds);
    store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
    const apiResponse = await viewNote({ noteId });
    await writeToStoreAndDb(store, { notes: apiResponse.note });
  }
});
