import { NoteId, SynonymId } from "@/actions/types";
import { ChangeDesc, Range, RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { EditorView } from "codemirror";
import { DeepReadonlyArray } from "olik/*";
import { store } from "./store-utils";
import { NoteSearchResults, SearchResult } from "./text-search-utils";


export const bulletPointPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  decorator = new MatchDecorator({
    regexp: /\*\s/g,
    decoration: () => Decoration.replace({
      widget: new (class extends WidgetType {
        toDOM() {
          const wrap = document.createElement('span');
          wrap.innerHTML = '• ';
          return wrap;
        }
      })()
    }),
  });
  constructor(view: EditorView) {
    this.decorations = this.decorator.createDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.decorator.updateDeco(update, this.decorations);
    }
  }
}, {
  decorations: v => v.decorations
});

export const inlineNotePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  decorator = new MatchDecorator({
    regexp: /`[^`]+`/gm,
    decoration: (x) => Decoration.replace({
      widget: new (class extends WidgetType {
        toDOM() {
          const wrap = document.createElement("span");
          wrap.className = 'cm-note-inline';
          wrap.innerHTML = x[0].substring(1, x[0].length - 1);
          return wrap;
        }
      })()
    }),
  });
  constructor(view: EditorView) {
    this.decorations = this.decorator.createDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.decorator.updateDeco(update, this.decorations);
    }
  }
}, {
  decorations: v => v.decorations
});

export const noteBlockPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  codeBlockDeco(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    let codeBlockOpened = false;
    for (const { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text;
        const isStartOfCodeBlock = /```.*/g.test(text);
        if (isStartOfCodeBlock && !codeBlockOpened) {
          codeBlockOpened = true;
          builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline top' }));
        } else if (codeBlockOpened) {
          const isEndOfCodeBlock = /```/g.test(text);
          if (isEndOfCodeBlock) {
            builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline bottom' }));
            codeBlockOpened = false;
          } else {
            builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline' }));
          }
        }
        pos = line.to + 1;
      }
    }
    return builder.finish()
  }

  constructor(view: EditorView) {
    this.decorations = this.codeBlockDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.codeBlockDeco(update.view);
    }
  }
}, {
  decorations: v => v.decorations
});


export const titleFormatPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  headingDeco(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    for (const { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text;
        const isHeading = /^#{1,6}\s.*/g.test(text);
        if (isHeading) {
          const hashCount = text.match(/^#{1,6}/g)![0].length;
          builder.add(line.from, line.to, Decoration.mark({ attributes: { class: `cm-h${hashCount}` } }));
        }
        pos = line.to + 1;
      }
    }
    return builder.finish()
  }

  constructor(view: EditorView) {
    this.decorations = this.headingDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      this.decorations = this.headingDeco(update.view);
    }
  }
}, {
  decorations: v => v.decorations,
});

const mapRange = (range: { from: number, to: number }, change: ChangeDesc) => {
  try {
    const from = change.mapPos(range.from);
    const to = change.mapPos(range.to);
    return from < to ? { from, to } : undefined
  } catch (e) {
    // can happen when the active note is changed
    return;
  }
}

const addHighlight = StateEffect.define({ map: mapRange });

const removeHighlight = StateEffect.define({ map: mapRange });

const highlight = Decoration.mark({ attributes: { class: 'cm-highlight' } });

const highlight2 = Decoration.mark({ attributes: { class: 'cm-highlight-2' } });

const highlight3 = Decoration.mark({ attributes: { class: 'cm-highlight-3' } });

const cutRange = (ranges: DecorationSet, r: { from: number, to: number }) => {
  const leftover: Range<Decoration>[] = []
  ranges.between(r.from, r.to, (from, to, deco) => {
    if (from < r.from) leftover.push(deco.range(from, r.from))
    if (to > r.to) leftover.push(deco.range(r.to, to))
  })
  return ranges.update({
    filterFrom: r.from,
    filterTo: r.to,
    filter: () => false,
    add: leftover
  })
}
const addRange = (ranges: DecorationSet, r: { from: number, to: number }, decoration: Decoration) => {
  ranges.between(r.from, r.to, (from, to) => {
    if (from < r.from) r = { from, to: r.to }
    if (to > r.to) r = { from: r.from, to }
  })
  return ranges.update({
    filterFrom: r.from,
    filterTo: r.to,
    filter: () => false,
    add: [decoration.range(r.from, r.to)],
  })
}

const highlightedRanges = StateField.define({
  create: () => Decoration.none,
  update: (ranges, tr) => {
    ranges = ranges.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(addHighlight)) {
        ranges = addRange(ranges, e.value, (e.value as unknown as { decoration: Decoration }).decoration);
      } else if (e.is(removeHighlight)) {
        ranges = cutRange(ranges, e.value);
      }
    }
    return ranges
  },
  provide: field => EditorView.decorations.from(field)
});

export const reviseEditorTags = (
  args: {
    codeMirror: EditorView,
    noteId: NoteId,
    synonymIds: DeepReadonlyArray<SynonymId>,
    groupSynonymIds?: DeepReadonlyArray<SynonymId> | undefined,
    searchResults?: DeepReadonlyArray<NoteSearchResults> | undefined,
  }
) => {
  const searchResults = store.$state.searchResults.filter(r => r.noteId === args.noteId);
  type Positions = Array<SearchResult & { decoration?: Decoration }>;
  const codeMirror = args.codeMirror as EditorView & { previousPositions1: Positions, previousPositions2: Positions, previousPositions3: Positions };
  const previousPositions1 = codeMirror.previousPositions1 || [];
  const previousPositions2 = codeMirror.previousPositions2 || [];
  const previousPositions3 = codeMirror.previousPositions3 || [];
  const newPositions1 = searchResults
    .filter(tag => args.synonymIds.includes(tag.synonymId!))
    .flatMap(tag => ({
      ...tag,
      decoration: highlight
    }));
  const newPositions2ThatMightOverlapWithPositions1 = searchResults
    .filter(tag => (args.groupSynonymIds ?? []).includes(tag.synonymId!))
    .flatMap(tag => ({
      ...tag,
      decoration: highlight2
    }));
  const newPositions2 = newPositions2ThatMightOverlapWithPositions1
    .filter(p => !newPositions1.some(np => np.from === p.from && np.to === p.to));
  const newPositions3 = !args.searchResults ? [] : (args.searchResults.find(nt => nt.noteId === args.noteId) ?? { matches: [] }).matches
    .map(tag => ({
      ...tag,
      decoration: highlight3,
    }));
  const removeTagPositions = [
    ...previousPositions1.filter(p => !newPositions1.some(np => np.from === p.from && np.to === p.to)),
    ...previousPositions2.filter(p => !newPositions2.some(np => np.from === p.from && np.to === p.to)),
    ...previousPositions3.filter(p => !newPositions3.some(np => np.from === p.from && np.to === p.to))
  ]
  const addTagPositions = [
    ...newPositions1.filter(p => !previousPositions1.some(np => np.from === p.from && np.to === p.to)),
    ...newPositions2.filter(p => !previousPositions2.some(np => np.from === p.from && np.to === p.to)),
    ...newPositions3.filter(p => !previousPositions3.some(np => np.from === p.from && np.to === p.to))
  ];
  const effects = [
    ...removeTagPositions.map(t => removeHighlight.of(t)),
    ...addTagPositions.map(t => addHighlight.of(t))
  ] as StateEffect<unknown>[];
  if (!args.codeMirror.state.field(highlightedRanges, false))
    effects.push(StateEffect.appendConfig.of([highlightedRanges]));
  args.codeMirror.dispatch({ effects });
  codeMirror.previousPositions1 = newPositions1;
  codeMirror.previousPositions2 = newPositions2;
  codeMirror.previousPositions3 = newPositions3;
};
