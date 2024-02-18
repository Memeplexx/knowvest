import { usePropsWithDefaults } from "@/utils/hooks";
import { useEffect, useState } from "react";
import { Message, Props, defaultProps, snackbarStatus } from "./constants";
import { ReferenceType, useFloating } from "@floating-ui/react";

export const useInputs = (incomingProps: Props) => {

  const floatingRef = useFloating<ReferenceType>({ placement: 'bottom' });

  const props = usePropsWithDefaults(incomingProps, defaultProps);
  
  const [state, setState] = useState({
    message: '',
    status: 'info' as snackbarStatus,
    initialized: false,
    messages: new Array<Message>(),
  });
  
  useEffect(() => {
    setState(s => ({ ...s, initialized: true }));
  }, []);

  useEffect(() => {
    if (!state.message) { return; }
    const ts = Date.now();
    setState(s => ({ ...s, messages: s.messages.length > props.maxCount ? s.messages.slice(s.messages.length - props.maxCount) : [...s.messages, { text: s.message, ts, show: false }] }));
    setTimeout(() => setState(s => ({ ...s, messages: s.messages.map(message => message.ts === ts ? { ...message, show: true } : message) }))); // setTimeout for animation to work
    setTimeout(() => {
      setState(s => ({ ...s, messages: s.messages.map(message => message.ts === ts ? { ...message, show: false } : message) }));
      setTimeout(() => {
        setState(s => ({ ...s, messages: s.messages.filter(message => message.ts !== ts) }));
        setState(s => ({...s, message: '' }))
      }, props.animationDuration);
    }, props.displayDuration);
  }, [props, state.message]);

  return {
    ...props,
    ...state,
    set: setState,
    floatingRef,
  };
}