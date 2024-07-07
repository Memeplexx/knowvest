"use client";
import { useContext } from "react";
import { Portal } from "../control-conditional";
import { NotificationContext, Props, defaultProps, snackbarStatuses } from "./constants";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Message, OverlayNotifierBackdrop, OverlayNotifierForeground } from "./styles";

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
      <Portal
        if={inputs.initialized}
        children={
          <OverlayNotifierBackdrop
            children={
              <OverlayNotifierForeground
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
        }
      />
    </>
  );
}