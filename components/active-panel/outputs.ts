import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { writeToIndexedDB } from "@/utils/functions";


export const useOutputs = ({ store, notify }: Inputs) => {
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.create.mutate();
      await writeToIndexedDB({ notes: apiResponse.note });
      store.activePanel.loadingNote.$set(false);
      store.notes.$push(apiResponse.note);
      store.activeNoteId.$set(apiResponse.note.id);
      store.synonymIds.$clear();
      store.activePanel.editorHasText.$set(false);
      notify.success('New note created');
    },
    onClickConfirmRemoveNote: async () => {
      store.activePanel.allowNotePersister.$set(false);
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.archive.mutate({ noteId: store.$state.activeNoteId });
      await writeToIndexedDB({ notes: apiResponse.noteArchived, noteTags: apiResponse.archivedNoteTags })
      store.activePanel.loadingNote.$set(false);
      store.activePanel.confirmDelete.$set(false);
      store.noteTags.$mergeMatching.id.$withMany(apiResponse.archivedNoteTags);
      store.notes.$mergeMatching.id.$withOne(apiResponse.noteArchived);
      const newNoteId = store.$state.notes.slice().sort((a, b) => b.dateViewed!.toString().localeCompare(a.dateViewed!.toString()))[0].id!;
      store.activeNoteId.$set(newNoteId);
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
      store.synonymIds.$set(store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
    },
    onClickCancelRemoveNote: () => {
      store.activePanel.confirmDelete.$set(false)
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.duplicate.mutate({ noteId: store.$state.activeNoteId });
      await writeToIndexedDB({ notes: apiResponse.noteCreated, noteTags: apiResponse.noteTagsCreated });
      store.activePanel.loadingNote.$set(false);
      store.noteTags.$push(apiResponse.noteTagsCreated);
      store.notes.$push(apiResponse.noteCreated);
    },
    onClickRequestDeleteNote: () => {
      store.activePanel.confirmDelete.$set(true);
    },
    onHideDialog: () => {

    },
  };
}