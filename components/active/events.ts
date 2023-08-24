import { trpc } from "@/utils/trpc";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { State } from "./constants";
import { MouseEvent } from "react";
import { store } from "@/utils/store";


export const useEvents = (state: State) => ({
  onClickCreateNote: async () => {
    const created = await trpc.note.create.mutate();
    store.notes.$push(created);
    store.activeNoteId.$set(created.id);
    store.synonymIds.$clear();
  },
  onClickRemoveNote: async () => {
    store.activePanel.allowNotePersister.$set(false);
    const apiResponse = await trpc.note.delete.mutate({ noteId: store.activeNoteId.$state });
    store.activePanel.confirmDelete.$set(false);
    store.noteTags.$filter.noteId.$in(apiResponse.noteTagsDeleted.map(nt => nt.noteId)).$delete();
    store.notes.$find.id.$eq(apiResponse.noteDeleted.id).$delete();
    const newNoteId = store.notes.$state.slice().sort((a, b) => b.dateViewed!.toString().localeCompare(a.dateViewed!.toString()))[0].id!;
    store.activeNoteId.$set(newNoteId);
    const tagIds = store.noteTags.$state.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
    store.synonymIds.$set(store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
    setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
  },
  onClickDuplicateNote: async () => {
    const apiResponse = await trpc.note.duplicate.mutate({ noteId: store.activeNoteId.$state });
    store.noteTags.$push(apiResponse.noteTagsCreated);
    store.notes.$push(apiResponse.noteCreated);
  },
  onClickCreateNewTagFromSelection: async () => {
    state.codeMirror!.dispatch({ selection: { anchor: state.codeMirror!.state.selection.ranges[0].anchor } });
    const apiResponse = await trpc.tag.createFromActiveNote.mutate({ tagText: state.selection });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return state.error(apiResponse.fields.tagText);
      case 'CONFLICT': return state.error(apiResponse.fields.tagText);
    }
    if (!store.tags.$state.some(t => t.id === apiResponse.tag.id)) {
      store.tags.$push(apiResponse.tag);
      store.noteTags.$push(apiResponse.noteTags);
    }
    const synonymId = store.$state.tags.findOrThrow(t => t.id === apiResponse.tag.id).synonymId;
    if (!store.$state.synonymIds.includes(synonymId)) {
      store.synonymIds.$push(synonymId);
    }
    store.activePanel.selection.$set('');
  },
  onClickFilterNotesFromSelection: () => {
    const { from, to } = state.codeMirror!.state.selection.ranges[0];
    const selection = state.codeMirror!.state.doc.sliceString(from, to);
    const tagIds = store.tags.$state.filter(t => selection.toLowerCase().includes(t.text)).map(t => t.id);
    const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    store.synonymIds.$set(synonymIds);
    store.activePanel.selection.$set('');
  },
  onClickSplitNoteFromSelection: async () => {
    const range = state.codeMirror!.state.selection.ranges[0];
    const apiResponse = await trpc.note.split.mutate({ ...range, splitFromNoteId: store.$state.activeNoteId });
    store.notes.$find.id.$eq(store.$state.activeNoteId).$set(apiResponse.noteUpdated);
    store.notes.$push(apiResponse.noteCreated);
    store.noteTags.$push(apiResponse.noteTagsCreated);
    store.noteTags.$filter.noteId.$in(apiResponse.noteTagsRemoved.map(nt => nt.noteId)).$and.tagId.$in(apiResponse.noteTagsRemoved.map(nt => nt.tagId)).$delete();
    store.activePanel.selection.$set('');
    state.codeMirror?.dispatch({
      changes: {
        from: 0,
        to: state.codeMirror.state.doc.length,
        insert: store.notes.$find.id.$eq(store.activeNoteId.$state).$state.text || '',
      },
    })
  },
  onDocumentClick: useEventHandlerForDocument('click', event => {
    if (state.confirmDelete) { return; }
    if (state.floating.elements.floating?.contains(event.target as Node)) { return; }
    if (!state.showOptions) { return; }
    store.activePanel.showOptions.$set(false);
  }),
  onClickSettingsButton: (event: MouseEvent) => {
    event.stopPropagation();
    store.activePanel.showOptions.$toggle();
  },
  onClickRequestDeleteNote: () => {
    store.activePanel.confirmDelete.$set(true);
  },
  onClickTextEditorWrapper: () => {
    state.editorDomElement.current?.focus();
  },
  onBlurTextEditor: () => {
    if (state.selection === '') { return; }
  },
});