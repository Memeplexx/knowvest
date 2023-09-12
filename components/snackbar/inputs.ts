import { ReferenceType, useFloating } from "@floating-ui/react";
import { useEffect } from "react";
import { Props, defaultProps, initialState } from "./constants";
import { usePropsWithDefaults, useRecord } from "@/utils/hooks";



export const useInputs = (incomingProps: Props) => {

  const props = usePropsWithDefaults(incomingProps, defaultProps);

  const state = useRecord(initialState);

  const floating = useFloating<ReferenceType>({ placement: 'bottom' });

  useEffect(() => {
    if (!props.message) { return; }
    const ts = Date.now();
    state.set(s => ({ messages: [...s.messages, { text: props.message, ts, show: false }] }));
    setTimeout(() => { // doing this in a timeout so that animation works
      state.set(s => ({ messages: s.messages.map(m => m.ts === ts ? { ...m, show: true } : m) }));
    });
    setTimeout(() => {
      state.set(s => ({
        messages: s.messages
          .map(m => m.ts === ts ? { ...m, show: false } : m)
      }));
      setTimeout(() => {
        state.set(s => ({ messages: s.messages.filter(m => m.ts !== ts) }));
        props.onMessageClear?.();
      }, props.animationDuration);
    }, props.duration);
  }, [props, state]);

  return {
    refs: { floating },
    props,
    state,
  }
}