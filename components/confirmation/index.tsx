import { Modal } from '../modal';
import { CancelButton, ConfirmButton, DialogBody, ButtonWrapper, MessageWrapper, HeaderWrapper } from './styles';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';



export const Confirmation = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state } = inputs;
  return (
    <Modal
      onBackdropClick={outputs.onClickCancel}
      onCloseComplete={outputs.onCloseComplete}
      show={props.show}
      children={
        <DialogBody
          children={
            <>
              <HeaderWrapper
                children={props.title || 'Confirm Action'}
              />
              <MessageWrapper
                children={props.message || 'Are you sure?'}
              />
              <ButtonWrapper
                children={
                  <>
                    <CancelButton
                      selected={state.selection === 'cancel'}
                      onMouseUp={outputs.onClickCancel}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => state.set({ selection: 'cancel' })}
                      children={props.cancelText || 'Cancel'}
                      aria-label='Cancel'
                    />
                    <ConfirmButton
                      selected={state.selection === 'confirm'}
                      onMouseUp={outputs.onClickConfirm}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => state.set({ selection: 'confirm' })}
                      children={props.confirmText || 'Confirm'}
                      aria-label='Confirm'
                    />
                  </>
                }
              />
            </>
          }
        />
      }
    />
  )
}


