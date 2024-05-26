"use client";
import { Modal } from '../modal';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ButtonWrapper, CancelButton, ConfirmButton, DialogBody, Header, Message } from './styles';



export const Confirmation = (
  props: Props
) => {
  const inputs = useInputs(props);
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
                      onMouseDown={outputs.onMouseDownCancel}
                      children={props.cancelText || 'Cancel'}
                      aria-label='Cancel'
                    />
                    <ConfirmButton
                      selected={inputs.selection === 'confirm'}
                      highlighted={false}
                      onMouseUp={outputs.onClickConfirm}
                      onMouseLeave={outputs.onMouseLeaveButton}
                      onMouseDown={outputs.onMouseDownConfirm}
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


