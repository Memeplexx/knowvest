import { NoteTagDTO, SynonymId, TagId } from "@/actions/types";
import { ChangeDesc, Range, RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { EditorView } from "codemirror";
import { Readable, Store } from "olik";
import { AppState } from "./store-utils";

export const bulletPointPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  decorator = new MatchDecorator({
    regexp: /\*\s/g,
    decoration: () => Decoration.replace({
      widget: new (class extends WidgetType {
        toDOM() {
          const wrap = document.createElement("span");
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

export const highlightTagsInEditor = ({ editorView, store, synonymIds }: { editorView: EditorView, store: Store<AppState>, synonymIds: Readable<Array<SynonymId>> }) => {

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

  const highlightedRanges = StateField.define({
    create: () => Decoration.none,
    update: (ranges, tr) => {
      ranges = ranges.map(tr.changes)
      for (const e of tr.effects) {
        if (e.is(addHighlight)) {
          ranges = addRange(ranges, e.value);
        } else if (e.is(removeHighlight)) {
          ranges = cutRange(ranges, e.value);
        }
      }
      return ranges
    },
    provide: field => EditorView.decorations.from(field)
  });

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
  const addRange = (ranges: DecorationSet, r: { from: number, to: number }) => {
    ranges.between(r.from, r.to, (from, to) => {
      if (from < r.from) r = { from, to: r.to }
      if (to > r.to) r = { from: r.from, to }
    })
    return ranges.update({
      filterFrom: r.from,
      filterTo: r.to,
      filter: () => false,
      add: [highlight.range(r.from, r.to)]
    })
  }

  let previousTagPositions = new Array<{ from: number; to: number; tagId: TagId }>();

  const onChangeNoteTags = (noteTags: NoteTagDTO[]) => {
    const docString = editorView.state.doc.toString() || '';
    const tagPositions = noteTags
      .map(nt => store.tags.$state.find(t => t.id === nt.tagId))
      .filterTruthy()
      .flatMap(tag => [...docString.matchAll(new RegExp(`\\b(${tag.text})\\b`, 'ig'))]
        .map(m => m.index!)
        .map(index => ({ from: index, to: index + tag.text.length, tagId: tag.id })))
      .distinct(t => t.tagId + ' ' + t.from);
    const effects = [
      ...previousTagPositions
        .filter(tp => !tagPositions.some(t => t.tagId === tp.tagId && t.from === tp.from && t.to === tp.to))
        .distinct(t => t.tagId + ' ' + t.from)
        .map(t => removeHighlight.of({
          ...t,
          // if user deletes last character and char is inside tag, we will get an out of bounds error. This prevents that
          to: Math.min(t.to, editorView.state.doc.length || Number.MAX_VALUE)
        }) as StateEffect<unknown>),
      ...tagPositions
        .distinct(t => t.tagId + ' ' + t.from)
        .map(t => addHighlight.of(t) as StateEffect<unknown>),
    ];
    if (!editorView.state.field(highlightedRanges, false)) {
      effects.push(StateEffect.appendConfig.of([highlightedRanges]));
    }
    editorView.dispatch({ effects });
    previousTagPositions = tagPositions;
  }

  const getData = () => {
    const { synonymGroups, synonymIds, tags, noteTags } = store.$state;
    const groupSynonymIds = synonymGroups
      .filter(sg => synonymIds.includes(sg.synonymId))
      .distinct();
    return [...synonymIds, ...groupSynonymIds]
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .distinct(t => t.id)
      .flatMap(t => noteTags.filter(nt => nt.tagId === t.id));
  }

  let called = Date.now();
  const debounce = 100;
  const subscriptions = [synonymIds, store.tags, store.noteTags, store.synonymGroups].map(item => {
    return item.$onChange(async () => {
      await setTimeout(() => {
        if ((Date.now() - debounce) < called) { return; }
        called = Date.now();
        onChangeNoteTags(getData());
      }, debounce);
    });
  });
  onChangeNoteTags(getData());
  return { unsubscribe: () => subscriptions.forEach(sub => sub.unsubscribe()) };
}
