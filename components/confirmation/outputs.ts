import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { props, state } = inputs;
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onClose?.();
    },
    onMouseLeaveButton: () => {
      state.set({ selection: 'none' });
    },
    onClose: () => {
      if (state.selection === 'confirm') {
        props.onConfirm?.();
      }
    }
  };
}