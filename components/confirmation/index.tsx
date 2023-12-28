import { Modal } from '../modal';
import { CancelButton, ConfirmButton, DialogBody, ButtonWrapper, Message, Header } from './styles';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';



export const Confirmation = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Modal
      onBackdropClick={outputs.onClickCancel}
      onClose={outputs.onClose}
      showIf={props.showIf}
      children={
        <DialogBody
          children={
            <>
              <Header
                children={props.title || 'Confirm Action'}
              />
              <Message
                children={props.message || 'Are you sure?'}
              />
              <ButtonWrapper
                children={
                  <>
                    <CancelButton
                      selected={inputs.state.selection === 'cancel'}
                      highlighted={false}
                      onMouseUp={outputs.onClickCancel}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => inputs.state.set({ selection: 'cancel' })}
                      children={props.cancelText || 'Cancel'}
                      aria-label='Cancel'
                    />
                    <ConfirmButton
                      selected={inputs.state.selection === 'confirm'}
                      highlighted={false}
                      onMouseUp={outputs.onClickConfirm}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => inputs.state.set({ selection: 'confirm' })}
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


