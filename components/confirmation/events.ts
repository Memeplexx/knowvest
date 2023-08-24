import { State } from "./constants";

export const defineEvents = (hooks: State) => {
  const { props, state } = hooks;
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
    onCloseComplete: () => {
      if (state.selection === 'confirm') {
        props.onConfirm?.();
      }
    }
  };
}