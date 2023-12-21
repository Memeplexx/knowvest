import { trpc } from "@/utils/trpc";
import { Inputs } from "./constants";
import { writeToIndexedDB } from "@/utils/functions";


export const useOutputs = ({ store, notify, selection, codeMirror, editorRef }: Inputs) => {
  return {
    onClickCreateNewTagFromSelection: async () => {
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.tag.createFromActiveNote.mutate({ tagText: selection });
      store.activePanel.loadingSelection.$set(false);
      switch (apiResponse.status) {
        case 'BAD_REQUEST': return notify.error(apiResponse.fields.tagText);
        case 'CONFLICT': return notify.error(apiResponse.fields.tagText);
      }
      if (!store.$state.tags.some(t => t.id === apiResponse.tag.id)) {
        store.tags.$push(apiResponse.tag);
        store.noteTags.$push(apiResponse.noteTags);
        await writeToIndexedDB({ tags: apiResponse.tag, noteTags: apiResponse.noteTags });
      }
      const synonymId = store.$state.tags.findOrThrow(t => t.id === apiResponse.tag.id).synonymId;
      if (!store.$state.synonymIds.includes(synonymId)) {
        store.synonymIds.$push(synonymId);
      }
      store.activePanel.selection.$set('');
      codeMirror!.dispatch({ selection: { anchor: codeMirror!.state.selection.ranges[0].anchor } });
      notify.success(`Tag "${apiResponse.tag.text}" created`);
    },
    onClickFilterNotesFromSelection: () => {
      const { from, to } = codeMirror!.state.selection.ranges[0];
      const selection = codeMirror!.state.doc.sliceString(from, to);
      const synonymIds = store.$state.tags.filter(t => selection.toLowerCase().includes(t.text)).map(t => t.synonymId);
      store.synonymIds.$set(synonymIds);
      store.activePanel.selection.$set('');
      notify.success(`Filtered notes by "${selection}"`);
    },
    onClickSplitNoteFromSelection: async () => {
      const range = codeMirror!.state.selection.ranges[0];
      store.activePanel.loadingSelection.$set(true);
      const apiResponse = await trpc.note.split.mutate({ ...range, splitFromNoteId: store.$state.activeNoteId });
      await writeToIndexedDB({ notes: [apiResponse.noteCreated, apiResponse.noteUpdated], noteTags: [...apiResponse.newNoteTags, ...apiResponse.archivedNoteTags] });
      store.activePanel.loadingSelection.$set(false);
      store.notes.$mergeMatching.id.$withOne(apiResponse.noteUpdated);
      store.notes.$push(apiResponse.noteCreated);
      store.noteTags.$push(apiResponse.newNoteTags);
      store.noteTags.$mergeMatching.id.$withMany(apiResponse.archivedNoteTags);
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
      if (selection === '') { return; }
    },
  };
}