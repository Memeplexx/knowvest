import { NoteId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { writeToIndexedDB } from "@/utils/functions";


export const useOutputs = (inputs: Inputs) => {
  const { props, refs, store } = inputs;
  return {
    onSelectNote: async (noteId: NoteId) => {
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
      const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      store.notes.$find.id.$eq(noteId).dateViewed.$set(new Date());
      props.onSelectNote(noteId);
      const apiResponse = await trpc.note.view.mutate({ noteId });
      await writeToIndexedDB({ notes: apiResponse.note });
      store.notes.$mergeMatching.id.$withOne(apiResponse.note);
      refs.card.current!.scrollToTop();
    }
  };
}