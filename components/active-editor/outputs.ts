import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { indexeddb } from "@/utils/indexed-db";


export const useOutputs = ({ store, notify, codeMirror, editorRef }: Inputs) => {
  return {
    onClickCreateNewTagFromSelection: async () => {
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.tag.createFromActiveNote.mutate({ tagText: store.activePanel.selection.$state });
      store.activePanel.loadingSelection.$set(false);
      switch (apiResponse.status) {
        case 'BAD_REQUEST': return notify.error(apiResponse.fields.tagText);
        case 'CONFLICT': return notify.error(apiResponse.fields.tagText);
      }
      await indexeddb.write(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
      store.synonymIds.$merge(store.tags.$find.id.$eq(apiResponse.tag.id).synonymId);
      store.activePanel.selection.$set('');
      codeMirror!.dispatch({ selection: { anchor: codeMirror!.state.selection.ranges[0].anchor } });
      notify.success(`Tag "${apiResponse.tag.text}" created`);
    },
    onClickFilterNotesFromSelection: () => {
      const { from, to } = codeMirror!.state.selection.ranges[0];
      const selection = codeMirror!.state.doc.sliceString(from, to);
      const selectionToLowerCase = selection.toLowerCase();
      store.synonymIds.$set(store.tags.$filter.text.$containsIgnoreCase(selectionToLowerCase).synonymId);
      store.activePanel.selection.$set('');
      notify.success(`Filtered notes by "${selection}"`);
    },
    onClickSplitNoteFromSelection: async () => {
      const range = codeMirror!.state.selection.ranges[0];
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.note.split.mutate({ ...range, splitFromNoteId: store.$state.activeNoteId });
      await indexeddb.write(store, apiResponse);
      store.activePanel.loadingSelection.$set(false);
      store.activePanel.selection.$set('');
      codeMirror?.dispatch({
        changes: {
          from: 0,
          to: codeMirror.state.doc.length,
          insert: store.$state.notes.find(n => n.id === store.$state.activeNoteId)?.text,
        },
      })
      notify.success(`Note split`);
    },
    onClickTextEditorWrapper: () => {
      editorRef.current?.focus();
    },
    onBlurTextEditor: () => {
      if (store.activePanel.selection.$state === '') { return; }
    },
  };
}