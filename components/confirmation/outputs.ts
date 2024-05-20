import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { local } = inputs;
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onClose?.();
    },
    onMouseLeaveButton: () => {
      local.selection.$set('none');
    },
    onClose: () => {
      if (inputs.selection === 'confirm')
        props.onConfirm?.();
    },
    onMouseDownCancel: () => {
      local.selection.$set('cancel');
    },
    onMouseDownConfirm: () => {
      local.selection.$set('confirm');
    },
  };
}