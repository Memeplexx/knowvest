import { Modal } from '../modal';
import { CancelButton, ConfirmButton, DialogBody, ButtonWrapper, MessageWrapper, HeaderWrapper } from './styles';
import { Props } from './constants';
import { useHooks } from './hooks';
import { defineEvents } from './events';



export const Confirmation = (
  props: Props
) => {
  const state = useHooks(props);
  const events = defineEvents(state);
  return (
    <Modal
      onBackdropClick={events.onClickCancel}
      onCloseComplete={events.onCloseComplete}
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
                      onMouseUp={events.onClickCancel}
                      onMouseLeave={events.onMouseLeaveButton}
                      onMouseDown={() => state.setSelection('cancel')}
                      children={props.cancelText || 'Cancel'}
                    />
                    <ConfirmButton
                      selected={state.selection === 'confirm'}
                      onMouseUp={events.onClickConfirm}
                      onMouseLeave={events.onMouseLeaveButton}
                      onMouseDown={() => state.setSelection('confirm')}
                      children={props.confirmText || 'Confirm'}
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


