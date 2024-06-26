"use client";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { NotificationContext, Props, defaultProps, snackbarStatuses } from "./constants";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Message, OverlayNotifierWrapper, Popup } from "./styles";

export const useNotifier = () => useContext(NotificationContext)!

export function OverlayNotifier(props: Props) {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <>
      <NotificationContext.Provider
        value={outputs}
        children={props.children}
      />
      {!inputs.initialized ? <></> : createPortal(
        <OverlayNotifierWrapper
          ref={inputs.floatingRef.refs.setReference}
          children={
            <Popup
              ref={inputs.floatingRef.refs.setFloating}
              style={inputs.floatingRef.floatingStyles}
              children={inputs.messages.map((message, index) => (
                <Message
                  key={message.ts}
                  $if={message.show}
                  $index={index}
                  $animation={props.animationDuration ?? defaultProps.animationDuration}
                  $gap={props.stackGap ?? defaultProps.stackGap}
                  $status={inputs.status}
                  children={
                    <>
                      {snackbarStatuses[inputs.status].icon()}
                      {props.renderMessage ? props.renderMessage(message.text) : message.text}
                    </>
                  }
                />
              ))}
            />
          }
        />
        , document.body)}
    </>
  );
}