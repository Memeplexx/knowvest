export { };
import { MouseEvent, useCallback, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./react-utils";
import { tupleIncludes } from "olik";


export const MediaQueries = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1400,
} as const;

export type Keys =
  | 'Backspace'
  | 'Tab'
  | 'Enter'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'CapsLock'
  | 'Escape'
  | 'Space'
  | 'PageUp'
  | 'PageDown'
  | 'End'
  | 'Home'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowDown'
  | 'Insert'
  | 'Delete';

export interface TypedKeyboardEvent<T extends HTMLElement> extends React.KeyboardEvent<T> {
  key: Keys,
  target: Omit<T, 'tagName'> & { tagName: 'INPUT' | 'TEXTAREA' | 'DIV' },
}
export type EventMap<T> = T extends 'click' ? MouseEvent<HTMLElement> & { target: HTMLElement } : T extends 'keyup' | 'keydown' ? TypedKeyboardEvent<HTMLElement> : never;
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
    }) as unknown as EventListener;
    Object.defineProperty(listener, 'name', { value: listenerName });
    document.addEventListener(type, listener);
    return () => document.removeEventListener(type, listener);
  }, [type]);
}

export const useResizeListener = (listener: () => void) => {
  const initialized = useRef(false);
  const listenerRef = useRef(listener);
  listenerRef.current = listener;
  if (typeof window !== 'undefined' && !initialized.current) {
    listenerRef.current();
    initialized.current = true;
  }
  useEffect(() => {
    window.addEventListener('resize', listenerRef.current);
    return () => window.removeEventListener('resize', listenerRef.current);
  }, [listener]);
}

export const useMediaQueryListener = (listener: (mediaQuery: keyof typeof MediaQueries) => void) => {
  const initialized = useRef(false);
  const listenerRef = useRef(listener);
  listenerRef.current = listener;
  const currentQuery = useRef<keyof typeof MediaQueries | null>(null);
  const getMediaQuery = useCallback(() => {
    const windowWidth = window.innerWidth;
    return Object.keysTyped(MediaQueries).reverse().find(key => windowWidth > MediaQueries[key]) ?? 'xs';
  }, []);
  if (typeof window !== 'undefined' && !initialized.current) {
    const previousMediaQuery = currentQuery.current;
    currentQuery.current = getMediaQuery();
    if (previousMediaQuery !== currentQuery.current)
      listener(currentQuery.current);
    initialized.current = true;
  }
  const resizeListener = useCallback(() => {
    const previousMediaQuery = currentQuery.current;
    currentQuery.current = getMediaQuery();
    if (previousMediaQuery !== currentQuery.current) {
      listenerRef.current(currentQuery.current);
    }
  }, [getMediaQuery]);
  useEffect(() => {
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [resizeListener]);
}

const ancestorMatches = (element: EventTarget | null, check: (element: HTMLElement) => boolean): boolean => {
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

EventTarget.prototype.hasAncestorWithTagNames = function (...check) {
  return ancestorMatches(this, e => tupleIncludes(e.tagName, check));
}

EventTarget.prototype.hasAncestor = function (check) {
  return ancestorMatches(this, (element) => element === check);
}

EventTarget.prototype.hasAncestorMatching = function (check) {
  return ancestorMatches(this, check);
}
