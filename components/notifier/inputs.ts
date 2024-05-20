import { useLocalStore } from "@/utils/store-utils";
import { ReferenceType, useFloating } from "@floating-ui/react";
import { useEffect } from "react";
import { Props, defaultProps, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { local, state: { initialized, message } } = useLocalStore(props.storeKey, initialState);

  const floatingRef = useFloating<ReferenceType>({ placement: 'bottom' });
  const maxCount = props.maxCount ?? defaultProps.maxCount;
  const animationDuration = props.animationDuration ?? defaultProps.animationDuration;
  const displayDuration = props.displayDuration ?? defaultProps.displayDuration;
  
  useEffect(() => {

    // mark component as initialized so that portal can snackbar can be added to DOM body element
    if (!initialized)
      return local.initialized.$set(true);

    // message will be an empty string on initialization or when the message is cleared
    if (!message)
      return;

    // if we get to this point, we know that the message text is not empty, so we can push the message onto the messages queue
    const ts = Date.now();
    if (local.$state.messages.length > maxCount)
      local.messages.$slice({ start: 0, end: maxCount });
    else 
      local.messages.$push({ text: message, ts, show: false })

    // show message. Note that nested requestAnimationFrame is needed for animation to work
    requestAnimationFrame(() => requestAnimationFrame(() => local.messages.$find.ts.$eq(ts).show.$set(true)));

    // hide the message after the display duration
    setTimeout(() => {

      // hide the message
      local.messages.$find.ts.$eq(ts).show.$set(false);

      // after message was animated out of view, remove it from the list of messages
      setTimeout(() => {
        local.message.$set('');
        local.messages.$find.ts.$eq(ts).$delete();
      }, animationDuration);
    }, displayDuration);

  }, [animationDuration, displayDuration, initialized, maxCount, message, local]);

  return {
    ...local.$state,
    local,
    initialized,
    floatingRef,
  };
}