import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ForwardedRef } from 'react';
import { EventMap } from './types';



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