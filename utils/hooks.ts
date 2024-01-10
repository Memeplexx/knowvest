import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef, useContext, FunctionComponent } from 'react';
import { EventMap } from './types';
import { AppState, StoreContext } from './constants';
import { Store } from 'olik';
import dynamic from 'next/dynamic';



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

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useRecord = <T extends object>(initializeState: T) => {
  const [state, setState] = useState(initializeState);
  const result = useRef({
    ...state,
    set: useCallback((arg: Partial<T> | ((prevState: T) => Partial<T>)) => {
      setState({ ...result.current, ...(typeof (arg) === 'function' ? arg(result.current) : arg) });
    }, [])
  });
  Object.assign(result.current, state);
  return result.current;
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

export const useIsMounted = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setTimeout(() => setInitialized(true));
  }, []);
  return initialized;
}

export const useNestedStore = <K extends string, S extends object>(key: K, initialState: S) => {
  const store = useContext(StoreContext)!;
  useMemo(() => {
    if ((store.$state as Record<K, S>)[key] !== undefined) { return; }
    store.$setNew({ [key]: initialState });
  }, [initialState, key, store]);
  return {
    store: store as Store<AppState & Record<K, S>>,
    state: (store as Record<K, Store<S>>)[key].$useState() as S,
  };
}

export const useComponentDownloader = <P>(importer: () => Promise<{ default: FunctionComponent<P> }>) => {
  const isMounted = useIsMounted();
  const importerRef = useRef(importer);
  const component = useMemo(() => {
    if (!isMounted) { return null; }
    return dynamic(importerRef.current);
  }, [isMounted]);
  return component;
}

export const useActiveNotesSortedByDateViewed = (store: Store<AppState>) => {
  const notes = store.notes.$useState();
  return notes
    .filter(n => !n.isArchived)
    .sort((a, b) => b.dateViewed!.getTime() - a.dateViewed!.getTime());
}