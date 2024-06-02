import { archiveNote, createNote, duplicateNote, splitNote } from "@/actions/note";
import { createTagFromActiveNote } from "@/actions/tag";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { tupleIncludes } from "olik";
import { Inputs } from "./constants";


export const useOutputs = ({ store, local, popupRef, codeMirror, editorRef, notify, storage }: Inputs) => ({
  onClickCreateNote: async () => {
    local.loadingNote.$set(true);
    const apiResponse = await createNote();
    await storage.write({ notes: apiResponse.note });
    local.loadingNote.$set(false);
    store.activeNoteId.$set(apiResponse.note.id);
    store.synonymIds.$clear();
    local.editorHasText.$set(false);
    notify.success('New note created');
    popupRef.current?.hide();
  },
  onClickConfirmRemoveNote: async () => {
    local.$patch({ allowNotePersister: false, loadingNote: true })
    const { tags, notes, activeNoteId, tagNotes } = store.$state;
    const apiResponse = await archiveNote(activeNoteId);
    await storage.write({ notes: [apiResponse.note] })
    local.$patch({ loadingNote: false, confirmDelete: false });
    const mostRecentlyViewedNoteId = notes
      .reduce((prev, curr) => prev!.dateViewed! > curr.dateViewed! ? prev : curr, notes[0])!.id;
    store.activeNoteId.$set(mostRecentlyViewedNoteId);
    const tagIds = tagNotes[mostRecentlyViewedNoteId]!.map(tag => tag.id);
    const synonymIds = tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId);
    store.synonymIds.$setUnique(synonymIds);
    setTimeout(() => local.allowNotePersister.$set(true), 500);
    notify.success('Note deleted');
    popupRef.current?.hide();
  },
  onClickCancelRemoveNote: () => {
    local.confirmDelete.$set(false);
    popupRef.current?.hide();
  },
  onClickDuplicateNote: async () => {
    local.loadingNote.$set(true);
    const apiResponse = await duplicateNote(store.$state.activeNoteId)
    await storage.write({ notes: apiResponse.note });
    local.loadingNote.$set(false);
    popupRef.current?.hide();
  },
  onClickRequestDeleteNote: () => {
    local.confirmDelete.$set(true);
  },
  selectionChanged: (selection: string) => {
    local.selection.$set(selection);
  },
  editorHasTextChanged: (hasText: boolean) => {
    local.editorHasText.$set(hasText);
  },
  onClickCreateNewTagFromSelection: async () => {
    local.loadingSelection.$set(true);
    const apiResponse = await createTagFromActiveNote(local.$state.selection);
    local.loadingSelection.$set(false);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.tagText);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.fields.tagText);
    await storage.write({ tags: apiResponse.tag });
    store.synonymIds.$merge(store.$state.tags.filter(t => t.id === apiResponse.tag.id).map(t => t.synonymId));
    local.selection.$set('');
    codeMirror!.dispatch({ selection: { anchor: codeMirror!.state.selection.ranges[0]!.anchor } });
    notify.success(`Tag "${apiResponse.tag.text}" created`);
  },
  onClickFilterNotesFromSelection: () => {
    const { from, to } = codeMirror!.state.selection.ranges[0]!;
    const selection = codeMirror!.state.doc.sliceString(from, to);
    store.synonymIds.$set(store.$state.tags.filter(t => selection.includes(t.text)).map(t => t.synonymId).distinct());
    local.selection.$set('');
    notify.success(`Filtered related notes`);
  },
  onClickSplitNoteFromSelection: async () => {
    const range = codeMirror!.state.selection.ranges[0]!;
    local.loadingSelection.$set(true);
    const apiResponse = await splitNote(range.from, range.to, store.$state.activeNoteId);
    await storage.write(apiResponse);
    local.$patch({
      loadingSelection: false,
      selection: '',
    })
    codeMirror!.dispatch({
      changes: {
        from: 0,
        to: codeMirror!.state.doc.length,
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
    codeMirror!.focus();
    codeMirror!.dispatch(
      {
        selection: {
          anchor: codeMirror!.state.selection.ranges[0]!.anchor,
        }
      },
    );
  }),
})