import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";
import { viewNote } from "@/actions/note";
import { NoteId } from "@/actions/types";


export const useOutputs = ({ store, props, cardRef }: Inputs) => {
  return {
    onSelectNote: async (noteId: NoteId) => {
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      props.onSelectNote(noteId);
      const apiResponse = await viewNote({ noteId });
      await indexeddb.write(store, { notes: apiResponse.note });
      cardRef.current!.scrollToTop();
    }
  };
}