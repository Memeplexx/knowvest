import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { Props } from "./constants";

export const useOutputs = (props: Props) => {
  return {
    onClickBackdrop: () => {
      props.onBackdropClick?.();
    },
    onEscapeKeyPressed: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape') return;
      props.onClose?.();
    }),
  };
};