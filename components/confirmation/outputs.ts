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
      inputs.set({ selection: 'none' });
    },
    onClose: () => {
      if (inputs.selection === 'confirm')
        props.onConfirm?.();
    }
  };
}