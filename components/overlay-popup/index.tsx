"use client";
import { ForwardedRef, forwardRef } from 'react';
import { Portal } from '../control-conditional';
import { PopupHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Floating, Foreground, OverlapPopupBackdrop } from './styles';


const Popup = (
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) => {
  const inputs = useInputs(props, forwardedRef);
  const outputs = useOutputs(inputs);
  return (
    <>
      {props.trigger({
        ref: inputs.floatingRef.refs.setReference,
        onClick: outputs.onClickTrigger,
      })}
      <Portal
        if={inputs.show}
        children={
          <OverlapPopupBackdrop
            onClick={outputs.onClickBackdrop.bind(this)}
            children={
              <Floating
                ref={inputs.floatingRef.refs.setFloating}
                style={inputs.floatingRef.floatingStyles}
                onClick={e => e.stopPropagation()}
                children={
                  <Foreground
                    children={props.overlay}
                  />
                }
              />
            }
          />
        }
      />
    </>
  )
}

export const OverlayPopup = forwardRef(Popup);
