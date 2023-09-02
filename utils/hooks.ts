import { NoteId, SynonymId, TagId } from '@/server/dtos';
import { ChangeDesc, Range, StateEffect, StateField } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { Readable, derive } from 'olik';
import { type ForwardedRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { EventMap } from './types';
import { store } from './store';



export const useEventHandlerForDomElement = <Type extends 'click' | 'keyup' | 'keydown'>(
  target: HTMLElement | null,
  type: Type,
  handler: (event: EventMap<Type>) => void
) => {
  const ref = useRef(handler)
  ref.current = handler;
  useIsomorphicLayoutEffect(() => {
    const listener = ((event: EventMap<Type>) => {
      if (event.target !== target) { return; }
      const handler = ref.current;
      if (handler) {
        handler(event);
      }
    }) as EventListener;
    target?.addEventListener(type, listener);
    return () => target?.removeEventListener(type, listener);
  }, [target, type]);
}

export const useEventHandlerForDocument = <Type extends 'click' | 'keyup' | 'keydown'>(
  type: Type,
  handler: (event: EventMap<Type>) => void
) => {
  const ref = useRef(handler)
  ref.current = handler;
  useIsomorphicLayoutEffect(() => {
    const listener = ((event: EventMap<Type>) => {
      const handler = ref.current;
      if (handler) {
        handler(event);
      }
    }) as EventListener;
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [type]);
}

/**
 * Accepts a forwardedRef and returns a normal MutableRefObject which can be applied directly to a DOM element.
 * Note that forwardedRefs cannot be applied directly to DOM elements.
 */
export const useForwardedRef = <T>(forwardedRef: ForwardedRef<T>) => {
  const basicRef = useRef<T | null>(null);
  const targetRef = useRef<T | null>(null)
  const refs = useMemo(() => [basicRef, forwardedRef], [forwardedRef]);
  useIsomorphicLayoutEffect(() => {
    refs.forEach(ref => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])
  return targetRef
}

export const useDebounce = <T>(value: T, delay: number, action: () => void) => {
  const valueRef = useRef(value);
  const timestampRef = useRef(0);
  timestampRef.current = Date.now();
  const timeoutRef = useRef<number | NodeJS.Timeout>(0);
  if (value === valueRef.current) { return; }
  valueRef.current = value;
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    if (Date.now() < (timestampRef.current + delay)) { return; }
    action();
  }, delay)
}

export const useNoteTagsToTagHighlighter = (editorView: EditorView | null, synonymIds: Readable<SynonymId[]>) => {
  const noteTags = derive(
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
  }).$useState();

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
  const addHighlight = useRef(StateEffect.define<{ from: number, to: number }>({ map: mapRange }));
  const removeHighlight = useRef(StateEffect.define<{ from: number, to: number }>({ map: mapRange }));
  const highlight = useRef(Decoration.mark({
    attributes: {
      class: 'cm-highlight',
    }
  }));
  const highlightedRanges = useRef(StateField.define({
    create: () => Decoration.none,
    update: (ranges, tr) => {
      ranges = ranges.map(tr.changes)
      for (const e of tr.effects) {
        if (e.is(addHighlight.current)) {
          ranges = addRange(ranges, e.value);
        } else if (e.is(removeHighlight.current)) {
          ranges = cutRange(ranges, e.value);
        }
      }
      return ranges
    },
    provide: field => EditorView.decorations.from(field)
  }));
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
      add: [highlight.current.range(r.from, r.to)]
    })
  }
  const previousTagPositions = useRef<{ from: number; to: number; tagId: TagId; }[]>([]);
  return useMemo(() => {
    const docString = editorView?.state.doc.toString() || '';
    const tagPositions = noteTags
      .map(nt => store.tags.$state.findOrThrow(t => t.id === nt.tagId))
      .flatMap(tag => [...docString.matchAll(new RegExp(`\\b(${tag.text})\\b`, 'ig'))]
        .map(m => m.index!)
        .map(index => ({ from: index, to: index + tag.text.length, tagId: tag.id })));
    const effects: StateEffect<unknown>[] = [
      ...previousTagPositions.current
        .filter(tp => !tagPositions.some(t => t.tagId === tp.tagId && t.from === tp.from && t.to === tp.to))
        .map(t => removeHighlight.current.of(t)),
      ...tagPositions.map(thing => addHighlight.current.of(thing)),
    ];
    if (!editorView?.state.field(highlightedRanges.current, false)) {
      effects.push(StateEffect.appendConfig.of([highlightedRanges.current]));
    }
    editorView?.dispatch({ effects });
    previousTagPositions.current = tagPositions;
  }, [editorView, noteTags]);
}

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useRecord = <T extends object>(initializeState: T) => {
  const [state, oldSetState] = useState(initializeState);
  type NewSetStateAction<T> = Partial<T> | ((prevState: T) => Partial<T>);
  const set = useCallback((arg: NewSetStateAction<T>) => {
    if (typeof (arg) === 'function') {
      oldSetState(s => ({ ...s, ...arg(s) }));
    } else[
      oldSetState(s => ({ ...s, ...arg }))
    ]
  }, []);
  return { ...state, set } as const;
}

export const usePropsWithDefaults = <P extends Record<string, unknown>, I extends P, D extends P>(incomingProps: I, defaultProps: D) => {

  // We need a ref of incomingProps so we can compare previous props to incoming props
  const inRef = useRef<P>(incomingProps);

  // We need a ref of result because we might want to return exactly the same object if props have not changed
  const outRef = useRef<P>({ ...defaultProps, incomingProps });

  // props object has changed so we can return a new object which is a spread of defaultProps and incomingProps
  if (inRef.current !== incomingProps) {
    inRef.current = incomingProps;
    outRef.current = { ...defaultProps, ...incomingProps };
    return outRef.current as I & D;
  }

  // one or more props have changed.
  Object.assign(outRef.current, incomingProps);
  return outRef.current as I & D;
}

export const useRefs = (items: unknown[]) => {
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length);
  }, [items]);
  return itemsRef;
}

export const useAddAriaAttributeToCodeMirror = ({ noteId, editorDomElement }: { noteId: NoteId, editorDomElement: RefObject<HTMLDivElement> }) => {
  useEffect(() => {
    (editorDomElement.current?.querySelector('.cm-content') as HTMLElement).setAttribute('aria-label', `note-${noteId}`)
  }, [editorDomElement, noteId]);
}