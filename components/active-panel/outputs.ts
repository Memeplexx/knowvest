import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";
import { archiveNote, createNote, duplicateNote } from "@/app/actions/note";
import { getNotesSorted } from "@/utils/functions";


export const useOutputs = ({ store, notify, popupRef }: Inputs) => {
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await createNote({});
      await indexeddb.write(store, { notes: apiResponse.note });
      store.activePanel.loadingNote.$set(false);
      store.activeNoteId.$set(apiResponse.note.id);
      store.synonymIds.$clear();
      store.activePanel.editorHasText.$set(false);
      notify.success('New note created');
      popupRef.current?.hide();
    },
    onClickConfirmRemoveNote: async () => {
      store.activePanel.$patch({ allowNotePersister: false, loadingNote: true })
      const apiResponse = await archiveNote({ noteId: store.$state.activeNoteId });
      await indexeddb.write(store, { notes: apiResponse.noteArchived, noteTags: apiResponse.archivedNoteTags })
      store.activePanel.$patch({ loadingNote: false, confirmDelete: false });
      const newNoteId = getNotesSorted(store.$state.notes)[0].id;
      store.activeNoteId.$set(newNoteId);
      const tagIds = store.noteTags.$filter.noteId.$eq(newNoteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.synonymIds.$set(synonymIds);
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
      popupRef.current?.hide();
    },
    onClickCancelRemoveNote: () => {
      store.activePanel.confirmDelete.$set(false);
      popupRef.current?.hide();
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await duplicateNote({ noteId: store.$state.activeNoteId })
      await indexeddb.write(store, { notes: apiResponse.noteCreated, noteTags: apiResponse.noteTagsCreated });
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