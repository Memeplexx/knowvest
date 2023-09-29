import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { store } from "@/utils/store";


export const useOutputs = (inputs: Inputs) => {
  const { notify } = inputs;
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const created = await trpc.note.create.mutate();
      store.activePanel.loadingNote.$set(false);
      store.notes.$push(created);
      store.activeNoteId.$set(created.id);
      store.synonymIds.$clear();
      store.activePanel.editorHasText.$set(false);
      notify.success('New note created');
    },
    onClickRemoveNote: async () => {
      store.activePanel.allowNotePersister.$set(false);
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.delete.mutate({ noteId: store.$state.activeNoteId });
      store.activePanel.loadingNote.$set(false);
      store.activePanel.confirmDelete.$set(false);
      store.noteTags.$filter.noteId.$in(apiResponse.noteTagsDeleted.map(nt => nt.noteId)).$delete();
      store.notes.$find.id.$eq(apiResponse.noteDeleted.id).$delete();
      const newNoteId = store.$state.notes.slice().sort((a, b) => b.dateViewed!.toString().localeCompare(a.dateViewed!.toString()))[0].id!;
      store.activeNoteId.$set(newNoteId);
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
      store.synonymIds.$set(store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.duplicate.mutate({ noteId: store.$state.activeNoteId });
      store.activePanel.loadingNote.$set(false);
      store.noteTags.$push(apiResponse.noteTagsCreated);
      store.notes.$push(apiResponse.noteCreated);
    },
    onClickRequestDeleteNote: () => {
      store.activePanel.confirmDelete.$set(true);
    },
  };
}