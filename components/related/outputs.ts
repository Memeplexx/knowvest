import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";


export const useOutputs = ({ store, props, cardRef }: Inputs) => {
  return {
    onSelectNote: async (noteId: NoteId) => {
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      // store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      props.onSelectNote(noteId);
      const apiResponse = await trpc.note.view.mutate({ noteId });
      await indexeddb.write(store, { notes: apiResponse.note });
      cardRef.current!.scrollToTop();
    }
  };
}