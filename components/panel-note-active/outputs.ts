import { archiveFlashCard, createFlashCard, updateFlashCardText } from "@/actions/flashcard";
import { splitNote } from "@/actions/note";
import { createTagFromActiveNote } from "@/actions/tag";
import { FlashCardId } from "@/actions/types";
import { routes } from "@/utils/app-utils";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { store } from "@/utils/store-utils";
import { tupleIncludes } from "olik";
import { Inputs } from "./constants";


export const useOutputs = ({ local, popupRef, editor, editorRef, notify, router }: Inputs) => {
  return {
    onClickConfigureSelectedTag: () => {
      store.configureTags.$set(store.$state.tags.findOrThrow(t => t.text === local.$state.selection).id);
      router.push('./tags');
    },
    onClickCreateNewTagFromSelection: async () => {
      local.loadingSelection.$set(true);
      const apiResponse = await createTagFromActiveNote(local.$state.selection);
      local.loadingSelection.$set(false);
      if (apiResponse.status === 'BAD_REQUEST')
        return notify.error(apiResponse.fields.tagText);
      if (apiResponse.status === 'CONFLICT')
        return notify.error(apiResponse.fields.tagText);
      store.tags.$push(apiResponse.tag);
      store.synonymIds.$push(apiResponse.tag.synonymId);
      local.selection.$set('');
      editor!.dispatch({ selection: { anchor: editor!.state.selection.ranges[0]!.anchor } });
      notify.success(`Tag "${apiResponse.tag.text}" created`);
    },
    onClickFilterNotesFromSelection: () => {
      const { from, to } = editor!.state.selection.ranges[0]!;
      const selection = editor!.state.doc.sliceString(from, to).toLowerCase();
      const synonymIds = store.$state.searchResults
        .filter(r => r.noteId === store.$state.activeNoteId && selection.includes(r.text.toLowerCase()))
        .map(r => r.synonymId!)
        .distinct()
        .sort((a, b) => a - b);
      store.synonymIds.$set(synonymIds);
      local.selection.$set('');
      notify.success(`Filtered related notes`);
      if (store.$state.isMobileWidth)
        router.push(routes.related);
    },
    onClickSplitNoteFromSelection: async () => {
      const range = editor!.state.selection.ranges[0]!;
      local.loadingSelection.$set(true);
      const apiResponse = await splitNote(range.from, range.to, store.$state.activeNoteId);
      store.notes.$mergeMatching.id.$with(apiResponse.notes);
      store.activeNoteId.$set(apiResponse.notes[0]!.id);
      local.$patch({
        loadingSelection: false,
        selection: '',
      })
      notify.success(`Note split`);
    },
    onClickTextEditorWrapper: () => {
      editorRef.current!.focus();
    },
    onDocumentClick: useEventHandlerForDocument('click', event => {
      if (event.target.hasAncestor(editorRef.current))
        return;
      if (local.$state.selection === '')
        return;
      local.selection.$set('');
    }),
    onDocumentKeyDown: useEventHandlerForDocument('keydown', event => {
      if (event.target.hasAncestor(editorRef.current))
        return;
      if (event.key.startsWith('F') || event.ctrlKey || event.altKey || event.metaKey)
        return;
      if (event.target.hasAncestorMatching(e => !!e.querySelector('[data-id=backdrop]')))
        return;
      if (tupleIncludes(event.target.tagName, ['INPUT', 'TEXTAREA']))
        return;
      editor!.focus();
      editor!.dispatch({
        selection: {
          anchor: editor!.state.selection.ranges[0]!.anchor,
        }
      });
    }),
    onClickCreateFlashCard: async () => {
      const apiResponse = await createFlashCard(store.$state.activeNoteId);
      store.flashCards.$push(apiResponse.flashCard);
      popupRef.current?.hide();
    },
    onChangeFlashCardText: async (flashCardId: FlashCardId, text: string) => {
      if (!flashCardId) {
        const apiResponse = await createFlashCard(store.$state.activeNoteId);
        store.flashCards.$push(apiResponse.flashCard);
      } else {
        const apiResponse = await updateFlashCardText(flashCardId, text);
        store.flashCards.$find.id.$eq(apiResponse.flashCard.id).$set(apiResponse.flashCard);
      }
    },
    onClickRequestDeleteFlashCard: async () => {
      local.confirmDeleteFashCard.$set(true);
    },
    onClickConfirmDeleteFlashCard: async (flashCardId: FlashCardId) => {
      const apiResponse = await archiveFlashCard(flashCardId);
      store.flashCards.$find.id.$eq(apiResponse.flashCard.id).$delete();
      local.confirmDeleteFashCard.$set(false);
    },
    onClickCancelRemoveFlashCard: () => {
      local.confirmDeleteFashCard.$set(false);
    }
  };
}