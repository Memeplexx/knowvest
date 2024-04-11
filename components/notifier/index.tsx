"use client";
import { useContext } from "react"
import { NotificationContext, Props, snackbarStatuses } from "./constants";
import { createPortal } from "react-dom";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Container, Message, Popup } from "./styles";

export const useNotifier = () => useContext(NotificationContext)!

export function NotifierProvider(partialProps: Props) {
  const inputs = useInputs(partialProps);
  const outputs = useOutputs(inputs);
  return (
    <>
      <NotificationContext.Provider
        value={outputs}
        children={inputs.children}
      />
      {!inputs.initialized ? <></> : createPortal(
        <Container
          ref={inputs.floatingRef.refs.setReference}
          children={
            <Popup
              ref={inputs.floatingRef.refs.setFloating}
              style={inputs.floatingRef.floatingStyles}
              children={
                inputs.messages.map((message, index) => (
                  <Message
                    key={message.ts}
                    $if={message.show}
                    $index={index}
                    $animation={inputs.animationDuration}
                    $gap={inputs.stackGap}
                    $status={inputs.status}
                    children={
                      <>
                        {snackbarStatuses[inputs.status].icon()}
                        {inputs.renderMessage ? inputs.renderMessage(message.text) : message.text}
                      </>
                    }
                  />
                ))
              }
            />
          }
        />
        , document.body)}
    </>
  );
}