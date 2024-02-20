import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";
import { viewNote } from "@/actions/note";
import { writeToStoreAndDb } from "@/utils/storage-utils";

export const useOutputs = ({ store, props, cardRef }: Inputs) => {
  return {
    onScrolledToBottom: () => {
      store.relatedItems.index.$add(1);
    },
    onSelectNote: async (noteId: NoteId) => {
      store.relatedItems.index.$set(0);
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      props.onSelectNote(noteId);
      const apiResponse = await viewNote({ noteId });
      await writeToStoreAndDb(store, { notes: apiResponse.note });
      cardRef.current!.scrollToTop();
    },
  };
}