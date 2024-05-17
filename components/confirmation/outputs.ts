import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { store: { $local: localStore }, state: { $local: { selection } } } = inputs;
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onClose?.();
    },
    onMouseLeaveButton: () => {
      localStore.selection.$set('none');
    },
    onClose: () => {
      if (selection === 'confirm')
        props.onConfirm?.();
    },
    onMouseDownCancel: () => {
      localStore.selection.$set('cancel');
    },
    onMouseDownConfirm: () => {
      localStore.selection.$set('confirm');
    },
  };
}