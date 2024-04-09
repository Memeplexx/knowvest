import { useEffect } from "react";
import { Message, Props, defaultProps, snackbarStatus } from "./constants";
import { ReferenceType, useFloating } from "@floating-ui/react";
import { usePropsWithDefaults, useRecord } from "@/utils/react-utils";

export const useInputs = (incomingProps: Props) => {

  const floatingRef = useFloating<ReferenceType>({ placement: 'bottom' });

  const props = usePropsWithDefaults(incomingProps, defaultProps);
  
  const localState = useRecord({
    message: '',
    status: 'info' as snackbarStatus,
    initialized: false,
    messages: new Array<Message>(),
  });

  const { initialized, message, set } = localState;
  const { animationDuration, maxCount, displayDuration } = props;
  useEffect(() => {

    // mark component as initialized so that portal can snackbar can be added to DOM body element
    if (!initialized) {
      return set({ initialized: true });
    }

    // message will be an empty string on initialization or when the message is cleared
    if (!message) {
      return;
    }

    // if we get to this point, we know that the message text is not empty, so we can push the message onto the messages queue
    const ts = Date.now();
    set(s => ({ messages: s.messages.length > maxCount ? s.messages.slice(s.messages.length - maxCount) : [...s.messages, { text: s.message, ts, show: false }] }));
    requestAnimationFrame(() => requestAnimationFrame(() => { // needed for animation to work
      set(s => ({ messages: s.messages.map(message => message.ts === ts ? { ...message, show: true } : message) }));
    }));

    // hide the message after the display duration
    setTimeout(() => {

      // hide the message
      set(s => ({ messages: s.messages.map(message => message.ts === ts ? { ...message, show: false } : message) }));

      // after message was animated out of view, remove it from the list of messages
      setTimeout(() => {
        set(s => ({ message: '', messages: s.messages.filter(message => message.ts !== ts) }));
      }, animationDuration);
    }, displayDuration);
    
  }, [animationDuration, displayDuration, initialized, set, maxCount, message]);

  return {
    ...props,
    ...localState,
    initialized,
    floatingRef,
  };
}