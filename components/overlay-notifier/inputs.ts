import { useComponent } from "@/utils/react-utils";
import { useLocalStore } from "@/utils/store-utils";
import { Props, defaultProps, initialState } from "./constants";

export const useInputs = (props: Props) => {

  const { local, state } = useLocalStore(props.storeKey, initialState);
  const { message } = state;

  const maxCount = props.maxCount ?? defaultProps.maxCount;
  const animationDuration = props.animationDuration ?? defaultProps.animationDuration;
  const displayDuration = props.displayDuration ?? defaultProps.displayDuration;

  const component = useComponent();

  // message will be an empty string on initialization or when the message is cleared
  if (message) {
    local.message.$set('');

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
      setTimeout(() => local.messages.$find.ts.$eq(ts).$delete(), animationDuration);
    }, displayDuration);
  }

  return {
    local,
    ...state,
    initialized: component.isMounted,
  };
}