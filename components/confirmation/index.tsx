"use client";
import { Modal } from '../modal';
import { CancelButton, ConfirmButton, DialogBody, ButtonWrapper, Message, Header } from './styles';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';



export const Confirmation = (
  props: Props
) => {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <Modal
      onBackdropClick={outputs.onClickCancel}
      onClose={outputs.onClose}
      if={props.if}
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
                      selected={inputs.selection === 'cancel'}
                      highlighted={false}
                      onMouseUp={outputs.onClickCancel}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => inputs.set({ selection: 'cancel' })}
                      children={props.cancelText || 'Cancel'}
                      aria-label='Cancel'
                    />
                    <ConfirmButton
                      selected={inputs.selection === 'confirm'}
                      highlighted={false}
                      onMouseUp={outputs.onClickConfirm}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={() => inputs.set({ selection: 'confirm' })}
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


