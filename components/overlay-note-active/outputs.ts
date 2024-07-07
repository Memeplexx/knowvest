import { createFlashCard } from "@/actions/flashcard";
import { archiveNote, createNote, duplicateNote } from "@/actions/note";
import { notesSorted, store } from "@/utils/store-utils";
import { Inputs } from "./constants";


export const useOutputs = ({ local, popupRef, notify }: Inputs) => {
  return {
    onClickCreateNote: async () => {
      const apiResponse = await createNote();
      store.notes.$push(apiResponse.note);
      store.activeNoteId.$set(apiResponse.note.id);
      store.synonymIds.$clear();
      notify.success('New note created');
      popupRef.current?.hide();
    },
    onClickConfirmRemoveNote: async () => {
      const apiResponse = await archiveNote(store.$state.activeNoteId);
      store.notes.$find.id.$eq(apiResponse.note.id).$delete();
      local.showConfirmDeleteDialog.$set(false);
      const nextMostRecentlyViewedNoteId = notesSorted.$state[0]!.id;
      store.activeNoteId.$set(nextMostRecentlyViewedNoteId);
      const tagIds = store.$state.searchResults.filter(r => r.noteId === nextMostRecentlyViewedNoteId).map(r => r.tagId);
      store.synonymIds.$set(store.$state.tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId).distinct().sort((a, b) => a - b));
      notify.success('Note deleted');
      popupRef.current?.hide();
    },
    onClickCancelRemoveNote: () => {
      local.showConfirmDeleteDialog.$set(false);
      popupRef.current?.hide();
    },
    onClickDuplicateNote: async () => {
      const apiResponse = await duplicateNote(store.$state.activeNoteId);
      store.notes.$push(apiResponse.note);
      popupRef.current?.hide();
    },
    onClickRequestDeleteNote: () => {
      local.showConfirmDeleteDialog.$set(true);
    },
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard(store.$state.activeNoteId);
      store.flashCards.$push(apiResponse.flashCard);
      popupRef.current?.hide();
      notify.success('Flash card created');
    },
  };
}