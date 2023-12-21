import { NoteId, TagId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { EditorState, Range } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { AppState } from "@/utils/constants";
import { Store } from "olik";
import { initialState } from "../active-panel/constants";
import { indexeddb } from "@/utils/indexed-db";

export const autocompleteExtension = (store: Store<AppState & typeof initialState>) => {
  return autocompletion({
    override: [
      (context: CompletionContext) => {
        const before = context.matchBefore(/\w+/)
        if (!context.explicit && !before) return null;
        return {
          from: before ? before.from : context.pos,
          options: store.$state.tags.map(tag => ({ label: tag.text })),
          validFor: /^\w*$/,
        };
      }
    ]
  })
};

export const createNotePersisterExtension = ({ debounce, store }: { debounce: number, store: Store<AppState & typeof initialState> }) => {
  let timestamp = Date.now();
  let activeNoteIdRef = store.$state.activeNoteId;
  const updateNote = async (update: ViewUpdate) => {
    if (store.$state.activeNoteId !== activeNoteIdRef) { return; }
    if (Date.now() - timestamp < debounce) { return; }
    if (!store.$state.activePanel.allowNotePersister) { return; }
    const apiResponse = await trpc.note.update.mutate({ noteId: store.$state.activeNoteId, text: update.state.doc.toString() });
    await indexeddb.write({ notes: apiResponse.updatedNote });
    if (store.$state.notes.some(n => n.id === store.$state.activeNoteId)) { // do this check because sometimes we have issues if the user switches notes too quickly
      store.notes.$mergeMatching.id.$withOne(apiResponse.updatedNote);
    }
  }
  return EditorView.updateListener.of(update => {
    if (!update.docChanged) { return; }
    if (!store.$state.activePanel.allowNotePersister) { return; }
    timestamp = Date.now();
    setTimeout(() => updateNote(update), debounce)
    activeNoteIdRef = store.$state.activeNoteId;
  });
}

export const noteTagsPersisterExtension = (store: Store<AppState & typeof initialState>) => {
  let previousActiveNoteId = 0 as NoteId;
  let previousActiveNoteTagIds = new Array<TagId>();
  const tagsWithRegexp = store.$state.tags
    .map(tag => ({ ...tag, regexp: new RegExp(`\\b(${tag.text})\\b`, 'gi') }));
    store.tags.$onChange(newTags => {
    const currentTagIds = tagsWithRegexp.map(t => t.id);
    newTags
      .filter(nt => !currentTagIds.includes(nt.id))
      .forEach(nt => {
        const regexp = new RegExp(`\\b(${nt.text})\\b`, 'gi');
        tagsWithRegexp.push({ ...nt, regexp });
      });
  });
  let initializing = true;
  return EditorView.updateListener.of(async update => {
    if (!initializing && !update.docChanged) { return; }
    initializing = false;
    const activeNoteText = update.state.doc.toString();
    if (previousActiveNoteId !== store.$state.activeNoteId) {
      previousActiveNoteId = store.$state.activeNoteId;
      previousActiveNoteTagIds = tagsWithRegexp
        .map(t => ({ tagId: t.id, items: [...activeNoteText.matchAll(t.regexp)] }))
        .flatMap(t => t.items.map(() => t.tagId))
        .sort((a, b) => a - b);
      return;
    }
    const newActiveNoteTagIds = tagsWithRegexp
      .map(t => ({ tagId: t.id, items: [...activeNoteText.matchAll(t.regexp)] }))
      .flatMap(t => t.items.map(() => t.tagId))
      .sort((a, b) => a - b);
    const previousActiveNoteTagIdsCopy = previousActiveNoteTagIds.slice();
    const nonUniqueTagsHaveChanged = JSON.stringify(previousActiveNoteTagIds) !== JSON.stringify(newActiveNoteTagIds);
    const uniqueTagsHaveChanged = JSON.stringify(previousActiveNoteTagIds.distinct()) !== JSON.stringify(newActiveNoteTagIds.distinct());
    previousActiveNoteTagIds = newActiveNoteTagIds;
    if (!uniqueTagsHaveChanged) {
      if (nonUniqueTagsHaveChanged) {
        store.noteTags.$set(store.$state.noteTags.slice().reverse());  // forces re-rendering in history and similar panels
      }
      return;
    }
    const addTagIds = newActiveNoteTagIds.filter(t => !previousActiveNoteTagIdsCopy.includes(t));
    const removeTagIds = previousActiveNoteTagIdsCopy.filter(t => !newActiveNoteTagIds.includes(t));
    const apiResponse = await trpc.noteTag.noteTagsUpdate.mutate({ addTagIds, removeTagIds, noteId: store.$state.activeNoteId });
    store.noteTags.$mergeMatching.id.$withMany(apiResponse.noteTags);
    await indexeddb.write({ noteTags: apiResponse.noteTags });
    const tagIds = apiResponse.noteTags.map(nt => nt.tagId);
    const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    store.synonymIds.$set(synonymIds);
  });
}

export const textSelectorPlugin = (store: Store<AppState & typeof initialState>) => {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
    }
    updateSelection = (value: string) => {
      if (store.$state.activePanel.selection === value) { return; }
      store.activePanel.selection.$set(value);
    }
    update(update: ViewUpdate) {
      if (!update.selectionSet) { return; }
      this.decorations = this.getDecorations(update.view)
    }
    private getDecorations(view: EditorView) {
      const widgets = [] as Range<Decoration>[];
      for (const range of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from: range.from,
          to: range.to,
          enter: (node) => {
            if (node.type.name !== 'Document') { return; }
            const documentText = view.state.doc.toString();
            if (view.state.selection.main.from === view.state.selection.main.to) {
              this.updateSelection('');
              return;
            }
            const regexForAnyNumberAndAnyLetter = /\W/;
            let from = view.state.selection.main.from;
            const startChar = documentText[from];
            if (regexForAnyNumberAndAnyLetter.test(startChar)) {
              while (regexForAnyNumberAndAnyLetter.test(documentText[from]) && from < documentText.length - 1) { from++; }
            } else {
              while (!regexForAnyNumberAndAnyLetter.test(documentText[from - 1]) && from > 0) { from--; }
            }
            let to = view.state.selection.main.to;
            const endChar = documentText[to - 1];
            if (regexForAnyNumberAndAnyLetter.test(endChar)) {
              while (regexForAnyNumberAndAnyLetter.test(documentText[to]) && to > 0) { to--; }
            } else {
              while (!regexForAnyNumberAndAnyLetter.test(documentText[to]) && to < documentText.length) { to++; }
            }
            const selection = view.state.sliceDoc(from, to).toLowerCase();
            if (!selection.trim().length) {
              this.updateSelection('');
              return;
            }
            this.updateSelection(selection);
          },
        })
      }
      return Decoration.set(widgets);
    }
  }, {
    decorations: v => v.decorations,
  });
}

export const editorHasTextUpdater = (store: Store<AppState & typeof initialState>) => {
  return EditorView.updateListener.of(update => {
    if (!update.docChanged) { return; }
    if (store.$state.activePanel.editorHasText && !update.state.doc.length) {
      store.activePanel.editorHasText.$set(false);
    } else if (!store.$state.activePanel.editorHasText && !!update.state.doc.length) {
      store.activePanel.editorHasText.$set(true);
    }
  });
}

export const pasteListener = EditorState.transactionFilter.of(tr => {
  if (tr.isUserEvent('input.paste')) {
    //
  }
  return tr;
})
