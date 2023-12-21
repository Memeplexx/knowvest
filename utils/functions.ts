import { NoteId, NoteTagDTO, SynonymId, TagId } from "@/server/dtos";
import { ChangeDesc, Range, StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet } from "@codemirror/view";
import { EditorView } from "codemirror";
import { Readable, Store } from "olik";
import { DecisionResult } from "./types";
import { derive } from "olik/derive";
import { AppState } from "./constants";



/**
 * A construct for expressing conditional logic with the following advantages over conventional approaches:
 * * Unlike 'if' and 'ternary' statements, this is more readable when there are a lot of conditions.
 * * Unlike 'switch' statements, this can use an expression as a condition.
 * * Unlike both 'if' and 'switch' (and much like ternary statements),
 * this returns an individual result and doesn't oblige us to define any local variables.
 *
 * @example
 *
 * cont result = decide([
 *   {
 *     when: () => // some expression returning a boolean,
 *     then: () => // some result,
 *   },
 *   {
 *     when: () => // some expression returning a boolean,
 *     then: () => // some result,
 *   }
 * ])
 */
export const decide = <X>(
  decisions: { when(): boolean | null | undefined; then(): X }[],
): DecisionResult<X, ReturnType<typeof decisions[0]['then']>> =>
  decisions.findOrThrow(d => d.when()).then() as DecisionResult<X, ReturnType<typeof decisions[0]['then']>>;

/**
 * A construct for expressing conditional logic with the following advantages over conventional approaches:
 * * Unlike 'if' and 'ternary' statements, this is more readable when there are a lot of conditions.
 * * Unlike both 'if' and 'switch' (and much like ternary statements),
 * this returns an individual result and doesn't oblige us to define any local variables.
 *
 * @example
 *
 * cont result = decideComparing(someValue, [
 *   {
 *     when: () => // something which may or may not equal someValue,
 *     then: () => // some result,
 *   },
 *   {
 *     when: () => // something which may or may not equal someValue,
 *     then: () => // some result,
 *   }
 * ])
 */
export const decideComparing = <C, X, T extends { when(): C; then(): X }>(
  toCompare: C,
  decisions: T[],
): DecisionResult<X, ReturnType<T['then']>> =>
  decisions.findOrThrow(d => d.when() === toCompare).then() as DecisionResult<X, ReturnType<T['then']>>;


export const ancestorMatches = (element: EventTarget | null, check: (element: HTMLElement) => boolean): boolean => {
  const parentNode = (element as HTMLElement).parentNode as HTMLElement;
  if (parentNode == null || parentNode.tagName === 'WINDOW') {
    return false;
  } else {
    const checkResult = check(element as HTMLElement);
    if (!checkResult) {
      return ancestorMatches(parentNode, check);
    } else {
      return checkResult;
    }
  }
}

export function pipe<A0, A1>(arg0: A0, arg1: (arg0: A0) => A1): A1;
export function pipe<A0, A1, A2>(arg0: A0, arg1: (arg0: A0) => A1, arg2: (arg1: A1) => A2): A2;
export function pipe(arg0: unknown, ...fns: Array<(arg: unknown) => unknown>) {
  return fns.reduce((prev, curr) => curr(prev), arg0);
}

export const highlightTagsInEditor = ({ editorView, synonymIds, store }: { editorView: EditorView, synonymIds: Readable<SynonymId[]>, store: Store<AppState> }) => {

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
        .map(index => ({ from: index, to: index + tag.text.length, tagId: tag.id })));
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

  const derivation = derive('highlight').$from(
    synonymIds,
    store.tags,
    store.noteTags,
    store.synonymGroups,
  ).$with((synonymIds, tags, noteTags, synonymGroups) => {
    const groupSynonymIds = synonymGroups
      .filter(sg => synonymIds.includes(sg.synonymId))
      .distinct();
    return [...synonymIds, ...groupSynonymIds]
      .flatMap(synonymId => tags.filter(t => t.synonymId === synonymId))
      .distinct(t => t.id)
      .flatMap(t => noteTags.filter(nt => nt.tagId === t.id));
  });
  derivation.$onChange(onChangeNoteTags);
  onChangeNoteTags(derivation.$state);
}

export const addAriaAttributeToCodeMirror = ({ noteId, editor }: { noteId: NoteId, editor: HTMLDivElement }) => {
  (editor.querySelector('.cm-content') as HTMLElement).setAttribute('aria-label', `note-${noteId}`)
}
