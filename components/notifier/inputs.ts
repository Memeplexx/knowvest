import { useStore } from "@/utils/store-utils";
import { ReferenceType, useFloating } from "@floating-ui/react";
import { useEffect } from "react";
import { Props, defaultProps, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const floatingRef = useFloating<ReferenceType>({ placement: 'bottom' });
  const { store, state } = useStore(props.storeKey, initialState);
  const { $local } = state;
  const { initialized, message } = $local;
  const maxCount = props.maxCount ?? defaultProps.maxCount;
  const animationDuration = props.animationDuration ?? defaultProps.animationDuration;
  const displayDuration = props.displayDuration ?? defaultProps.displayDuration;
  useEffect(() => {

    // mark component as initialized so that portal can snackbar can be added to DOM body element
    if (!initialized)
      return store.$local.initialized.$set(true);

    // message will be an empty string on initialization or when the message is cleared
    if (!message)
      return;

    // if we get to this point, we know that the message text is not empty, so we can push the message onto the messages queue
    const ts = Date.now();
    if (store.$local.$state.messages.length > maxCount)
      store.$local.messages.$slice({ start: 0, end: maxCount });
    else 
      store.$local.messages.$push({ text: message, ts, show: false })

    // show message. Note that nested requestAnimationFrame is needed for animation to work
    requestAnimationFrame(() => requestAnimationFrame(() => store.$local.messages.$find.ts.$eq(ts).show.$set(true)));

    // hide the message after the display duration
    setTimeout(() => {

      // hide the message
      store.$local.messages.$find.ts.$eq(ts).show.$set(false);

      // after message was animated out of view, remove it from the list of messages
      setTimeout(() => {
        store.$local.message.$set('');
        store.$local.messages.$find.ts.$eq(ts).$delete();
      }, animationDuration);
    }, displayDuration);

  }, [animationDuration, displayDuration, initialized, store, maxCount, message]);

  return {
    ...$local,
    store,
    initialized,
    floatingRef,
  };
}