import { NoteId, TagId } from "@/server/dtos";
import { trpc } from "@/utils/trpc";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import { Range } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { store } from "@/utils/store";

export const createAutocompleteExtension = () => {
  return autocompletion({
    override: [
      (context: CompletionContext) => {
        const before = context.matchBefore(/\w+/)
        if (!context.explicit && !before) return null;
        return {
          from: before ? before.from : context.pos,
          options: store.tags.$state.map(tag => ({ label: tag.text })),
          validFor: /^\w*$/,
        };
      }
    ]
  });
}

export const createNotePersisterExtension = ({ debounce }: { debounce: number } ) => {
  let timestamp = Date.now();
  let activeNoteIdRef = store.activeNoteId.$state;
  const updateNote = async (update: ViewUpdate) => {
    if (store.activeNoteId.$state !== activeNoteIdRef) { return; }
    if (Date.now() - timestamp < debounce) { return; }
    if (!store.activePanel.allowNotePersister.$state) { return; }
    const apiResponse = await trpc.note.update.mutate({ noteId: store.activeNoteId.$state, text: update.state.doc.toString() });
    store.notes.$find.id.$eq(store.activeNoteId.$state).$set(apiResponse.updatedNote);
  }
  return EditorView.updateListener.of(update => {
    if (!update.docChanged) { return; }
    if (!store.activePanel.allowNotePersister.$state) { return; }
    timestamp = Date.now();
    setTimeout(() => updateNote(update), debounce)
    activeNoteIdRef = store.activeNoteId.$state;
  });
}

export const noteTagsPersisterExtension = () => {
  let previousActiveNoteId = 0 as NoteId;
  let previousActiveNoteTagIds = new Array<TagId>();
  const tagsWithRegexp = store.tags.$state
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
  return EditorView.updateListener.of(async update => {
    if (!update.docChanged) { return; }
    const activeNoteText = update.state.doc.toString();
    if (previousActiveNoteId !== store.activeNoteId.$state) {
      previousActiveNoteId = store.activeNoteId.$state;
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
        store.noteTags.$set(store.noteTags.$state.slice().reverse());  // forces re-rendering in history and similar panels
      }
      return;
    }
    const addTagIds = newActiveNoteTagIds.filter(t => !previousActiveNoteTagIdsCopy.includes(t));
    const removeTagIds = previousActiveNoteTagIdsCopy.filter(t => !newActiveNoteTagIds.includes(t));
    const noteTags = await trpc.noteTag.noteTagsUpdate.mutate({ addTagIds, removeTagIds, noteId: store.activeNoteId.$state });
    store.noteTags.$filter.noteId.$eq(store.activeNoteId.$state).$delete();
    store.noteTags.$push(noteTags);
    const tagIds = noteTags.map(nt => nt.tagId);
    const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    store.synonymIds.$set(synonymIds);
  });
}

export const createBulletPointPlugin = () => {
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.getDecorations(update.view)
      }
    }
    private getDecorations(view: EditorView) {
      const widgets = [] as Range<Decoration>[]
      for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from, to,
          enter: (node) => {
            if (node.name === 'ListMark') {
              const deco = Decoration.replace({
                widget: new class extends WidgetType {
                  toDOM() {
                    const wrap = document.createElement("span")
                    wrap.innerHTML = '•';
                    return wrap
                  }
                }(),
              })
              widgets.push(deco.range(node.from, node.to));
            }
          },
        })
      }
      return Decoration.set(widgets)
    }
  }, {
    decorations: v => v.decorations,
  });
}

export const createTextSelectorPlugin = () => {
  const updateSelection = (value: string) => {
    if (store.activePanel.selection.$state === value) { return; }
    store.activePanel.selection.$set(value);
  }
  return ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
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
              updateSelection('');
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
              updateSelection('');
              return;
            }
            updateSelection(selection);
          },
        })
      }
      return Decoration.set(widgets);
    }
  }, {
    decorations: v => v.decorations,
  });
}

// Atomic Ranges example
// export const useBulletPointPlugin = () => {
//   return React.useRef(
//     ViewPlugin.fromClass(class {
//       placeholders: DecorationSet;
//       placeholderMatcher = new MatchDecorator({
//         regexp: /^\*\s\w/g,
//         decoration: match => Decoration.replace({
//           widget: new class extends WidgetType {
//             constructor(readonly match: string) {
//               super();
//             }
//             toDOM() {
//               // console.log(this.match);
//               let wrap = document.createElement('span');
//               wrap.innerHTML = '• ';
//               return wrap
//             }
//           }(match[1])
//         })
//       })
//       constructor(view: EditorView) {
//         this.placeholders = this.placeholderMatcher.createDeco(view)
//       }
//       update(update: ViewUpdate) {
//         this.placeholders = this.placeholderMatcher.updateDeco(update, this.placeholders)
//       }
//     }, {
//       decorations: instance => instance.placeholders,
//       provide: plugin => EditorView.atomicRanges.of(view => {
//         return view.plugin(plugin)?.placeholders || Decoration.none
//       })
//     })
//   ).current;
// }