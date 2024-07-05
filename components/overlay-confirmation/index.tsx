"use client";
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ButtonWrapper, CancelButton, ConfirmButton, DialogBody, Header, Message, OverlayConfirmationWrapper } from './styles';



export const OverlayConfirmation = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(props, inputs);
  return (
    <OverlayConfirmationWrapper
      onBackdropClick={outputs.onClickCancel.bind(this)}
      onClose={outputs.onClickCancel.bind(this)}
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
                      onMouseDown={outputs.onMouseDownCancel.bind(this)}
                      onMouseLeave={outputs.onMouseLeaveButton.bind(this)}
                      onClick={outputs.onClickCancel.bind(this)}
                      children={props.cancelText || 'Cancel'}
                      aria-label='Cancel'
                    />
                    <ConfirmButton
                      selected={inputs.selection === 'confirm'}
                      highlighted={false}
                      onMouseDown={outputs.onMouseDownConfirm.bind(this)}
                      onMouseLeave={outputs.onMouseLeaveButton.bind(this)}
                      onClick={outputs.onClickConfirm.bind(this)}
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


