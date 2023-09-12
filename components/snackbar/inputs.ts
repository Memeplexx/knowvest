import { ReferenceType, useFloating } from "@floating-ui/react";
import { useEffect, useState } from "react";
import { Message, Props, defaultProps } from "./constants";
import { usePropsWithDefaults } from "@/utils/hooks";



export const useInputs = (incomingProps: Props) => {

  const props = usePropsWithDefaults(incomingProps, defaultProps);

  const [state, setState] = useState(new Array<Message>());

  const floating = useFloating<ReferenceType>({ placement: 'bottom' });

  useEffect(() => {
    if (!props.message) { return; }
    const ts = Date.now();
    setState(messages => [...messages, { text: props.message, ts, show: false }]);
    setTimeout(() => setState(messages => messages.map(message => message.ts === ts ? { ...message, show: true } : message))); // setTimeout for animation to work
    setTimeout(() => {
      setState(messages => messages.map(message => message.ts === ts ? { ...message, show: false } : message));
      setTimeout(() => {
        setState(messages => messages.filter(message => message.ts !== ts));
        props.onMessageClear?.();
      }, props.animationDuration);
    }, props.displayDuration);
  }, [props]);

  return {
    refs: { floating },
    props,
    state,
  }
}