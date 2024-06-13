import { archiveNote, createNote, duplicateNote, splitNote } from "@/actions/note";
import { createTagFromActiveNote } from "@/actions/tag";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { tupleIncludes } from "olik";
import { Inputs } from "./constants";


export const useOutputs = ({ store, local, popupRef, editor, editorRef, notify, notesSorted }: Inputs) => ({
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
    const nextMostRecentlyViewedNoteId = notesSorted[0]!.id;
    store.activeNoteId.$set(nextMostRecentlyViewedNoteId);
    const tagIds = store.$state.noteTags[nextMostRecentlyViewedNoteId]!.map(tag => tag.id);
    const synonymIds = store.$state.tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId).distinct();
    store.synonymIds.$set(synonymIds);
    notify.success('Note deleted');
    popupRef.current?.hide();
  },
  onClickCancelRemoveNote: () => {
    local.showConfirmDeleteDialog.$set(false);
    popupRef.current?.hide();
  },
  onClickDuplicateNote: async () => {
    const apiResponse = await duplicateNote(store.$state.activeNoteId)
    store.notes.$push(apiResponse.note);
    popupRef.current?.hide();
  },
  onClickRequestDeleteNote: () => {
    local.showConfirmDeleteDialog.$set(true);
  },
  selectionChanged: (selection: string) => {
    local.selection.$set(selection);
  },
  onClickConfigureSelectedTag: () => {
    store.configureTags.$set(store.$state.tags.findOrThrow(t => t.text === local.$state.selection).id);
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
    const selection = editor!.state.doc.sliceString(from, to);
    store.synonymIds.$set(store.$state.tags.filter(t => selection.includes(t.text)).map(t => t.synonymId).distinct());
    local.selection.$set('');
    notify.success(`Filtered related notes`);
  },
  onClickSplitNoteFromSelection: async () => {
    const range = editor!.state.selection.ranges[0]!;
    local.loadingSelection.$set(true);
    const apiResponse = await splitNote(range.from, range.to, store.$state.activeNoteId);
    store.notes.$mergeMatching.id.$with(apiResponse.notes);
    local.$patch({
      loadingSelection: false,
      selection: '',
    })
    editor!.dispatch({
      changes: {
        from: 0,
        to: editor!.state.doc.length,
        insert: store.$state.notes.findOrThrow(n => n.id === store.$state.activeNoteId).text,
      },
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
})