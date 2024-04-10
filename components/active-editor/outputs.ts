import { Inputs } from "./constants";
import { splitNote } from "@/actions/note";
import { createTagFromActiveNote } from "@/actions/tag";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { writeToStoreAndDb } from "@/utils/storage-utils";


export const useOutputs = ({ store, notify, codeMirror, editorRef }: Inputs) => {
  return {
    onClickCreateNewTagFromSelection: async () => {
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await createTagFromActiveNote(store.activePanel.selection.$state);
      store.activePanel.loadingSelection.$set(false);
      switch (apiResponse.status) {
        case 'BAD_REQUEST': return notify.error(apiResponse.fields.tagText);
        case 'CONFLICT': return notify.error(apiResponse.fields.tagText);
      }
      await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
      store.synonymIds.$merge(store.tags.$find.id.$eq(apiResponse.tag.id).synonymId);
      store.activePanel.selection.$set('');
      codeMirror!.dispatch({ selection: { anchor: codeMirror!.state.selection.ranges[0]!.anchor } });
      notify.success(`Tag "${apiResponse.tag.text}" created`);
    },
    onClickFilterNotesFromSelection: () => {
      const { from, to } = codeMirror!.state.selection.ranges[0]!;
      const selection = codeMirror!.state.doc.sliceString(from, to);
      store.synonymIds.$setUnique(store.tags.$filter.text.$isContainedInIgnoreCase(selection).synonymId);
      store.activePanel.selection.$set('');
      notify.success(`Filtered related notes`);
    },
    onClickSplitNoteFromSelection: async () => {
      const range = codeMirror!.state.selection.ranges[0]!;
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await splitNote(range.from, range.to, store.$state.activeNoteId);
      await writeToStoreAndDb(store, apiResponse);
      store.activePanel.$patch({
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
      if (event.target.hasAncestor(editorRef.current)) return;
      if (store.activePanel.selection.$state === '') return;
      store.activePanel.selection.$set('');
    }),
    onDocumentKeyDown: useEventHandlerForDocument('keydown', event => {
      if (event.target.hasAncestor(editorRef.current)) return;
      if (event.key.startsWith('F') || event.ctrlKey || event.altKey || event.metaKey) { return; }
      if (event.target.hasAncestorMatching(e => !!e.querySelector('[data-id=backdrop]'))) { return; }
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') { return; }
      codeMirror!.focus();
      codeMirror!.dispatch(
        {
          selection: {
            anchor: codeMirror!.state.selection.ranges[0]!.anchor,
          }
        },
      );
    }),
  };
}