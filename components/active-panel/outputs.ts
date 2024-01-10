import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";
import { derivations } from "@/utils/derivations";


export const useOutputs = ({ store, notify, popupRef }: Inputs) => {
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.create.mutate();
      await indexeddb.write(store, { notes: apiResponse.note });
      store.activePanel.loadingNote.$set(false);
      store.activeNoteId.$set(apiResponse.note.id);
      store.synonymIds.$clear();
      store.activePanel.editorHasText.$set(false);
      notify.success('New note created');
      popupRef.current?.hide();
    },
    onClickConfirmRemoveNote: async () => {
      store.activePanel.allowNotePersister.$set(false);
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.archive.mutate({ noteId: store.$state.activeNoteId });
      await indexeddb.write(store, { notes: apiResponse.noteArchived, noteTags: apiResponse.archivedNoteTags })
      store.activePanel.loadingNote.$set(false);
      store.activePanel.confirmDelete.$set(false);
      const newNoteId = derivations.activeNotesSortedByDateViewed(store)[0].id;
      store.activeNoteId.$set(newNoteId);
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
      store.synonymIds.$set(store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
      popupRef.current?.hide();
    },
    onClickCancelRemoveNote: () => {
      store.activePanel.confirmDelete.$set(false);
      popupRef.current?.hide();
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.duplicate.mutate({ noteId: store.$state.activeNoteId });
      await indexeddb.write(store, { notes: apiResponse.noteCreated, noteTags: apiResponse.noteTagsCreated });
      store.activePanel.loadingNote.$set(false);
      popupRef.current?.hide();
    },
    onClickRequestDeleteNote: () => {
      store.activePanel.confirmDelete.$set(true);
    },
    onHideDialog: () => {

    },
  };
}