import { forwardRef, ForwardedRef } from 'react';
import { Container, Message, Popup } from './styles';
import { Props, snackbarStatuses } from './constants';
import { useHooks } from './hooks';


export const Snackbar = forwardRef(function Snackbar(
  props: Props,
  ref: ForwardedRef<HTMLElement>
) {
  const state = useHooks(props, ref);
  return (
    <Container
      ref={state.floating.refs.setReference}
      children={
        <Popup
          ref={state.floating.refs.setFloating}
          style={state.floating.floatingStyles}
          children={
            state.messages.map(m => (
              <Message
                key={m.ts}
                count={state.count}
                showIf={m.show}
                index={m.index}
                animation={state.animationDuration}
                gap={state.stackGap}
                status={state.status}
                children={
                  <>
                    {snackbarStatuses[state.status].icon()}
                    {props.renderMessage ? props.renderMessage(m.text) : m.text}
                  </>
                }
              />
            ))
          }
        />
      }
    />
  );
});

