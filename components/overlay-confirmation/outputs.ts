import { Inputs, Props } from "./constants";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { local } = inputs;
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onConfirm?.();
    },
    onMouseLeaveButton: () => {
      local.selection.$set('none');
    },
    onMouseDownCancel: () => {
      local.selection.$set('cancel');
    },
    onMouseDownConfirm: () => {
      local.selection.$set('confirm');
    },
  };
}