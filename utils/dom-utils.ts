export { };
import { MouseEvent, useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./react-utils";
import { tupleIncludes } from "olik";


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
  if (typeof window !== 'undefined' && !initialized.current) {
    listener();
    initialized.current = true;
  }
  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [listener]);
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
