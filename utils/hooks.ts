import dynamic from 'next/dynamic';
import { Store } from 'olik';
import { FunctionComponent, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef } from 'react';
import { AppState, StoreContext } from './constants';
import { EventMap } from './types';


export const useEventHandlerForDocument = <Type extends 'click' | 'keyup' | 'keydown'>(
  type: Type,
  handler: (event: EventMap<Type>) => void
) => {
  const listenerName = `onDocument${type.substring(0, 1).toUpperCase()}${type.substring(1)}`;
  Object.defineProperty(handler, 'name', { value: listenerName });
  const ref = useRef(handler)
  ref.current = handler;
  useIsomorphicLayoutEffect(() => {
    const listener = ((event: EventMap<Type>) => {
      const handler = ref.current;
      if (handler) {
        handler(event);
      }
    }) as EventListener;
    Object.defineProperty(listener, 'name', { value: listenerName });
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

export const useStore = <Patch extends Record<string, unknown>>(patch?: Patch) => {
  type StateType = Patch extends undefined ? AppState : AppState & Patch;
  const store = useContext(StoreContext)!;
  useMemo(function createSubStore() {
    if (!patch) { return; }
    // prevent react.strictmode from setting state twice
    if (Object.keys(patch).every(key => (store.$state as Record<string, unknown>)[key] !== undefined)) { return; }
    store.$setNew(patch);
  }, [patch, store]);
  return new Proxy({} as { store: Store<StateType> } & { [key in keyof StateType]: (StateType)[key] }, {
    get(target, p) {
      if (p === 'store') { return store; }
      return store[p as (keyof AppState)].$useState();
    },
  });
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
