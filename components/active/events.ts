import { trpc } from "@/utils/trpc";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { State } from "./constants";
import { MouseEvent } from "react";


export const useEvents = (state: State) => ({
  onClickCreateNote: async () => {
    const created = await trpc.note.create.mutate();
    state.appStore.notes.$push(created);
    state.appStore.activeNoteId.$set(created.id);
    state.appStore.synonymIds.$clear();
  },
  onClickRemoveNote: async () => {
    state.store.allowNotePersister.$set(false);
    const apiResponse = await trpc.note.delete.mutate({ noteId: state.appStore.activeNoteId.$state });
    state.store.confirmDelete.$set(false);
    state.appStore.noteTags.$filter.noteId.$in(apiResponse.noteTagsDeleted.map(nt => nt.noteId)).$delete();
    state.appStore.notes.$find.id.$eq(apiResponse.noteDeleted.id).$delete();
    const newNoteId = state.appStore.notes.$state.slice().sort((a, b) => b.dateViewed!.toString().localeCompare(a.dateViewed!.toString()))[0].id!;
    state.appStore.activeNoteId.$set(newNoteId);
    const tagIds = state.appStore.noteTags.$state.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
    state.appStore.synonymIds.$set(state.appStore.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
    setTimeout(() => state.store.allowNotePersister.$set(true), 500);
  },
  onClickDuplicateNote: async () => {
    const apiResponse = await trpc.note.duplicate.mutate({ noteId: state.appStore.activeNoteId.$state });
    state.appStore.noteTags.$push(apiResponse.noteTagsCreated);
    state.appStore.notes.$push(apiResponse.noteCreated);
  },
  onClickCreateNewTagFromSelection: async () => {
    state.codeMirror!.dispatch({ selection: { anchor: state.codeMirror!.state.selection.ranges[0].anchor } });
    const apiResponse = await trpc.tag.createFromActiveNote.mutate({ tagText: state.selection });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.tagText);
      case 'CONFLICT': return state.notifyError(apiResponse.fields.tagText);
    }
    if (!state.appStore.tags.$state.some(t => t.id === apiResponse.tag.id)) {
      state.appStore.tags.$push(apiResponse.tag);
      state.appStore.noteTags.$push(apiResponse.noteTags);
    }
    const synonymId = state.appStore.$state.tags.findOrThrow(t => t.id === apiResponse.tag.id).synonymId;
    if (!state.appStore.$state.synonymIds.includes(synonymId)) {
      state.appStore.synonymIds.$push(synonymId);
    }
    state.store.selection.$set('');
  },
  onClickFilterNotesFromSelection: () => {
    const { from, to } = state.codeMirror!.state.selection.ranges[0];
    const selection = state.codeMirror!.state.doc.sliceString(from, to);
    const tagIds = state.appStore.tags.$state.filter(t => selection.toLowerCase().includes(t.text)).map(t => t.id);
    const synonymIds = state.appStore.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    state.appStore.synonymIds.$set(synonymIds);
    state.store.selection.$set('');
  },
  onClickSplitNoteFromSelection: async () => {
    const range = state.codeMirror!.state.selection.ranges[0];
    const apiResponse = await trpc.note.split.mutate({ ...range, splitFromNoteId: state.appStore.$state.activeNoteId });
    state.appStore.notes.$find.id.$eq(state.appStore.$state.activeNoteId).$set(apiResponse.noteUpdated);
    state.appStore.notes.$push(apiResponse.noteCreated);
    state.appStore.noteTags.$push(apiResponse.noteTagsCreated);
    state.appStore.noteTags.$filter.noteId.$in(apiResponse.noteTagsRemoved.map(nt => nt.noteId)).$and.tagId.$in(apiResponse.noteTagsRemoved.map(nt => nt.tagId)).$delete();
    state.store.selection.$set('');
    state.codeMirror?.dispatch({
      changes: {
        from: 0,
        to: state.codeMirror.state.doc.length,
        insert: state.appStore.notes.$find.id.$eq(state.appStore.activeNoteId.$state).$state.text || '',
      },
    })
  },
  onDocumentClick: useEventHandlerForDocument('click', event => {
    if (state.confirmDelete) { return; }
    if (state.floating.elements.floating?.contains(event.target as Node)) { return; }
    if (!state.showOptions) { return; }
    state.store.showOptions.$set(false);
  }),
  onClickSettingsButton: (event: MouseEvent) => {
    event.stopPropagation();
    state.store.showOptions.$toggle();
  },
  onClickRequestDeleteNote: () => {
    state.store.confirmDelete.$set(true);
  },
  onClickTextEditorWrapper: () => {
    state.editorDomElement.current?.focus();
  },
  onBlurTextEditor: () => {
    if (state.selection === '') { return; }
  },
});