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

    // mark component as initialized so that portal can snackbar can be added to DOM body element
    if (!state.initialized) {
      return setState(s => ({ ...s, initialized: true }));
    }

    // message will be an empty string on initialization or when the message is cleared
    if (!state.message) {
      return;
    }

    // if we get to this point, we know that the message text is not empty
    const ts = Date.now();
    setState(s => ({ ...s, messages: s.messages.length > props.maxCount ? s.messages.slice(s.messages.length - props.maxCount) : [...s.messages, { text: s.message, ts, show: false }] }));
    requestAnimationFrame(() => requestAnimationFrame(() => { // needed for animation to work
      setState(s => ({ ...s, messages: s.messages.map(message => message.ts === ts ? { ...message, show: true } : message) }));
    }));

    // hide the message after the display duration
    setTimeout(() => {

      // hide the message
      setState(s => ({ ...s, messages: s.messages.map(message => message.ts === ts ? { ...message, show: false } : message) }));

      // after message was animated out of view, remove it from the list of messages
      setTimeout(() => {
        setState(s => ({ ...s, message: '', messages: s.messages.filter(message => message.ts !== ts) }));
      }, props.animationDuration);
    }, props.displayDuration);
    
  }, [props, state.initialized, state.message]);

  return {
    ...props,
    ...state,
    setState,
    floatingRef,
  };
}