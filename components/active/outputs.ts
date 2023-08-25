import { trpc } from "@/utils/trpc";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { Inputs } from "./constants";
import { MouseEvent } from "react";
import { store } from "@/utils/store";
import { transact } from "olik";


export const useOutputs = (inputs: Inputs) => {
  const { refs, state, notify } = inputs;
  return {
    onClickCreateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const created = await trpc.note.create.mutate();
      await transact(async () => {
        store.activePanel.loadingNote.$set(false);
        store.notes.$push(created);
        store.activeNoteId.$set(created.id);
        store.synonymIds.$clear();
      })
      notify.success('New note created');
    },
    onClickRemoveNote: async () => {
      store.activePanel.allowNotePersister.$set(false);
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.delete.mutate({ noteId: store.$state.activeNoteId });
      store.activePanel.loadingNote.$set(false);
      store.activePanel.confirmDelete.$set(false);
      store.noteTags.$filter.noteId.$in(apiResponse.noteTagsDeleted.map(nt => nt.noteId)).$delete();
      store.notes.$find.id.$eq(apiResponse.noteDeleted.id).$delete();
      const newNoteId = store.$state.notes.slice().sort((a, b) => b.dateViewed!.toString().localeCompare(a.dateViewed!.toString()))[0].id!;
      store.activeNoteId.$set(newNoteId);
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === newNoteId).map(nt => nt.tagId);
      store.synonymIds.$set(store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId))
      setTimeout(() => store.activePanel.allowNotePersister.$set(true), 500);
    },
    onClickDuplicateNote: async () => {
      store.activePanel.loadingNote.$set(true);
      const apiResponse = await trpc.note.duplicate.mutate({ noteId: store.$state.activeNoteId });
      store.activePanel.loadingNote.$set(false);
      transact(() => {
        store.noteTags.$push(apiResponse.noteTagsCreated);
        store.notes.$push(apiResponse.noteCreated);
      })
    },
    onClickCreateNewTagFromSelection: async () => {
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.tag.createFromActiveNote.mutate({ tagText: state.selection });
      store.activePanel.loadingSelection.$set(false);
      switch (apiResponse.status) {
        case 'BAD_REQUEST': return notify.error(apiResponse.fields.tagText);
        case 'CONFLICT': return notify.error(apiResponse.fields.tagText);
      }
      if (!store.$state.tags.some(t => t.id === apiResponse.tag.id)) {
        store.tags.$push(apiResponse.tag);
        store.noteTags.$push(apiResponse.noteTags);
      }
      const synonymId = store.$state.tags.findOrThrow(t => t.id === apiResponse.tag.id).synonymId;
      if (!store.$state.synonymIds.includes(synonymId)) {
        store.synonymIds.$push(synonymId);
      }
      store.activePanel.selection.$set('');
      state.codeMirror!.dispatch({ selection: { anchor: state.codeMirror!.state.selection.ranges[0].anchor } });
    },
    onClickFilterNotesFromSelection: () => {
      const { from, to } = state.codeMirror!.state.selection.ranges[0];
      const selection = state.codeMirror!.state.doc.sliceString(from, to);
      const tagIds = store.$state.tags.filter(t => selection.toLowerCase().includes(t.text)).map(t => t.id);
      const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
      transact(() => {
        store.synonymIds.$set(synonymIds);
        store.activePanel.selection.$set('');
      })
    },
    onClickSplitNoteFromSelection: async () => {
      const range = state.codeMirror!.state.selection.ranges[0];
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.note.split.mutate({ ...range, splitFromNoteId: store.$state.activeNoteId });
      store.activePanel.loadingSelection.$set(false);
      const noteIds = apiResponse.noteTagsRemoved.map(nt => nt.noteId);
      const tagIds = apiResponse.noteTagsRemoved.map(nt => nt.tagId);
      transact(() => {
        store.notes.$find.id.$eq(store.$state.activeNoteId).$set(apiResponse.noteUpdated);
        store.notes.$push(apiResponse.noteCreated);
        store.noteTags.$push(apiResponse.noteTagsCreated);
        store.noteTags.$filter.noteId.$in(noteIds).$and.tagId.$in(tagIds).$delete();
        store.activePanel.selection.$set('');
      })
      state.codeMirror?.dispatch({
        changes: {
          from: 0,
          to: state.codeMirror.state.doc.length,
          insert: store.$state.notes.find(n => n.id === store.$state.activeNoteId)?.text,
        },
      })
    },
    onDocumentClick: useEventHandlerForDocument('click', event => {
      if (state.confirmDelete) { return; }
      if (refs.floating.elements.floating?.contains(event.target as Node)) { return; }
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
      refs.editor.current?.focus();
    },
    onBlurTextEditor: () => {
      if (state.selection === '') { return; }
    },
  };
}