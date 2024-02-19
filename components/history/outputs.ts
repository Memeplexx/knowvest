import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs } from "./constants";


export const useOutputs = ({ store, cardRef, props }: Inputs) => {
  return {
    onSelectNote: async (noteId: NoteId) => {
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      props.onSelectNote(noteId);
      const apiResponse = await viewNote({ noteId });
      await writeToStoreAndDb(store, { notes: apiResponse.note });
      cardRef.current!.scrollToTop();
    }
  };
}