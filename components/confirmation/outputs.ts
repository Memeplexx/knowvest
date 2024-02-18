import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { props, state, setState } = inputs;
  return {
    onClickCancel: () => {
      props.onClose?.();
    },
    onClickConfirm: () => {
      props.onClose?.();
    },
    onMouseLeaveButton: () => {
      setState({ selection: 'none' });
    },
    onClose: () => {
      if (state.selection === 'confirm') {
        props.onConfirm?.();
      }
    }
  };
}