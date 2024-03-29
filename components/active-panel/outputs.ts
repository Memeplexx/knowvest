import { archiveNote, createNote, duplicateNote } from "@/actions/note";
import { writeToStoreAndDb } from "@/utils/storage-utils";
import { Inputs } from "./constants";


export const useOutputs = ({ store, notify, popupRef }: Inputs) => {
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await createNote();
      await writeToStoreAndDb(store, { notes: apiResponse.note });
      store.activePanel.loadingNote.$set(false);
      store.activeNoteId.$set(apiResponse.note.id);
      store.synonymIds.$clear();
      store.activePanel.editorHasText.$set(false);
      notify.success('New note created');
      popupRef.current?.hide();
    },
    onClickConfirmRemoveNote: async () => {
      store.activePanel.$patch({ allowNotePersister: false, loadingNote: true })
      const apiResponse = await archiveNote(store.$state.activeNoteId);
      await writeToStoreAndDb(store, apiResponse)
      store.activePanel.$patch({ loadingNote: false, confirmDelete: false });
      const mostRecentlyViewedNoteId = store.$state.notes
        .reduce((prev, curr) => prev!.dateViewed! > curr.dateViewed! ? prev : curr, store.$state.notes[0])!.id;
      store.activeNoteId.$set(mostRecentlyViewedNoteId);
      const tagIds = store.noteTags.$filter.noteId.$eq(mostRecentlyViewedNoteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.synonymIds.$setUnique(synonymIds);
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
      notify.success('Note deleted');
      popupRef.current?.hide();
    },
    onClickCancelRemoveNote: () => {
      store.activePanel.confirmDelete.$set(false);
      popupRef.current?.hide();
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await duplicateNote(store.$state.activeNoteId)
      await writeToStoreAndDb(store, { notes: apiResponse.note, noteTags: apiResponse.noteTags });
      store.activePanel.loadingNote.$set(false);
      popupRef.current?.hide();
    },
    onClickRequestDeleteNote: () => {
      store.activePanel.confirmDelete.$set(true);
    },
    selectionChanged: (selection: string) => {
      store.activePanel.selection.$set(selection);
    },
    editorHasTextChanged: (hasText: boolean) => {
      store.activePanel.editorHasText.$set(hasText);
    },
  };
}