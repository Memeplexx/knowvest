export { };
import { MouseEvent, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./react-utils";


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
  target: T,
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

EventTarget.prototype.hasAncestor = function (check) {
  return ancestorMatches(this, typeof check === 'function' ? check : (element) => element === check);
}
