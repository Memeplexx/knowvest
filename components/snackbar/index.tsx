"use client";
import { Container, Message, Popup } from './styles';
import { Props, snackbarStatuses } from './constants';
import { useInputs } from './inputs';


export const Snackbar = function Snackbar(
  partialProps: Props,
) {
  const inputs = useInputs(partialProps);
  const { state, floatingRef, props } = inputs;
  return (
    <Container
      ref={floatingRef.refs.setReference}
      children={
        <Popup
          ref={floatingRef.refs.setFloating}
          style={floatingRef.floatingStyles}
          children={
            state.map((message, index) => (
              <Message
                key={message.ts}
                $showIf={message.show}
                $index={index}
                $animation={props.animationDuration}
                $gap={props.stackGap}
                $status={props.status}
                children={
                  <>
                    {snackbarStatuses[props.status].icon()}
                    {props.renderMessage ? props.renderMessage(message.text) : message.text}
                  </>
                }
              />
            ))
          }
        />
      }
    />
  );
};

