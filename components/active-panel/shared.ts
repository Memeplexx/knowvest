import { updateNote } from "@/actions/note";
import { NoteId } from "@/actions/types";
import { AppState } from "@/utils/store-utils";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { EditorState, Range, TransactionSpec } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { Store } from "olik";
import { ActivePanelStore } from "./constants";

export const autocompleteExtension = (store: Store<AppState>) => {
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

export const createNotePersisterExtension = ({ debounce, store, local }: { debounce: number, store: Store<AppState>, local: ActivePanelStore }) => {
  let timestamp = Date.now();
  const doNoteUpdate = async (noteId: NoteId, docText: string) => {
    if (Date.now() - timestamp < debounce) return;
    if (!local.$state.allowNotePersister) return;
    if (docText === store.$state.notes.findOrThrow(n => n.id === noteId).text) return;
    const apiResponse = await updateNote(noteId, docText);
    store.notes.$mergeMatching.id.$with(apiResponse.note);
  }
  return EditorView.updateListener.of(update => {
    if (!update.docChanged) return;
    if (!local.$state.allowNotePersister) return;
    timestamp = Date.now();
    const docText = update.state.doc.toString();
    setTimeout(() => doNoteUpdate(store.$state.activeNoteId, docText), debounce);
  });
}

export const textSelectorPlugin = (local: ActivePanelStore) => {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
    }
    updateSelection = (value: string) => {
      if (local.$state.selection === value) return;
      local.selection.$set(value);
    }
    update(update: ViewUpdate) {
      if (!update.selectionSet) return;
      this.decorations = this.getDecorations(update.view)
    }
    private getDecorations(view: EditorView) {
      const widgets = [] as Range<Decoration>[];
      for (const range of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from: range.from,
          to: range.to,
          enter: (node) => {
            if (node.type.name !== 'Document')
              return;
            const selection = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to).toLowerCase();
            if (!selection.trim().length)
              return this.updateSelection('');
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

export const pasteListener = EditorState.transactionFilter.of(tr => {
  if (tr.isUserEvent('input.paste')) {
    //
  }
  return tr as TransactionSpec;
})