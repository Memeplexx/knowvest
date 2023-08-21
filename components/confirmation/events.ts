import { State } from "./constants";

export const defineEvents = (props: State) => ({
  onClickCancel: () => {
    props.onClose?.();
  },
  onClickConfirm: () => {
    props.onClose?.();
  },
  onMouseLeaveButton: () => {
    props.setSelection('none');
  },
  onCloseComplete: () => {
    if (props.selection === 'confirm') {
      props.onConfirm?.();
    }
  }
})