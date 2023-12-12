import { ancestorMatches } from "@/utils/functions";
import { Inputs } from "./constants";
import { useEventHandlerForDocument } from "@/utils/hooks";

export const useOutputs = (inputs: Inputs) => {
  const { props, store } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if ((event.target as HTMLElement).parentNode === null) { // element was removed from the DOM
        return;
      }
      if (ancestorMatches(event.target, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
        return;
      }
      if (inputs.bodyRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      props.onHide();
    }),
    onToggleView: () => {
      store.flashCard.showQuestions.$toggle();
    },
  };
}