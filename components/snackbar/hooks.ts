import { ReferenceType, useFloating } from "@floating-ui/react";
import { useEffect, useRef } from "react";
import { Props, defaultProps, initialState } from "./constants";
import { usePropsWithDefaults, useRecord } from "@/utils/hooks";



export const useHooks = (incomingProps: Props) => {

  const props = usePropsWithDefaults(incomingProps, defaultProps);

  const state = useRecord(initialState);

  const floating = useFloating<ReferenceType>({ placement: 'bottom' });

  const counter = useRef(0);

  const set = state.set;
  
  useEffect(() => {
    if (!props.message) { return; }
    const ts = Date.now();
    set(s => ({ messages: [...s.messages, { text: props.message, ts, show: false, index: counter.current++ }], count: s.count + 1 }));
    setTimeout(() => { // doing this in a timeout so that animation works
      set(s => ({ messages: s.messages.map(m => m.ts === ts ? { ...m, show: true } : m) }));
    });
    setTimeout(() => {
      set(s => ({
        count: s.count - 1,
        messages: s.messages
          .map(m => ({ ...m, index: m.index - 1 }))
          .map(m => m.ts === ts ? { ...m, show: false } : m)
      }));
      counter.current--;
      setTimeout(() => {
        set(s => ({ messages: s.messages.filter(m => m.ts !== ts) }));
        props.onMessageClear?.();
      }, props.animationDuration);
    }, props.duration);
    return () => {
      counter.current = 0;
    }
  }, [props, set]);

  return {
    refs: { floating },
    props,
    state,
  }
}