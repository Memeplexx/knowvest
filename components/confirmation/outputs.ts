import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onClose?.();
    },
    onMouseLeaveButton: () => {
      inputs.localStore.selection.$set('none');
    },
    onClose: () => {
      if (inputs.selection === 'confirm')
        props.onConfirm?.();
    },
    onMouseDownCancel: () => {
      inputs.localStore.selection.$set('cancel');
    },
    onMouseDownConfirm: () => {
      inputs.localStore.selection.$set('confirm');
    },
  };
}