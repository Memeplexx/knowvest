"use client";
import { Overlay } from '@/utils/style-provider';
import { ForwardedRef, forwardRef } from 'react';
import { PopupHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Floating, Foreground } from './styles';


export const OverlayPopup = forwardRef(function Popup(
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) {
  const inputs = useInputs(props, forwardedRef);
  const outputs = useOutputs(inputs);
  return (
    <>
      {props.trigger({
        ref: inputs.floatingRef.refs.setReference,
        onClick: () => setTimeout(() => outputs.onClickTrigger(), 50),
      })}
      <Overlay
        if={inputs.showInternal}
        onClickBackdrop={outputs.onClickBackdrop}
        blurBackdrop={true}
        overlay={
          <Floating
            ref={inputs.floatingRef.refs.setFloating}
            style={inputs.floatingRef.floatingStyles}
            onClick={e => e.stopPropagation()}
            children={
              <Foreground
                style={inputs.foregroundAnimations}
                children={props.overlay}
              />
            }
          />
        }
      />
    </>
  )
});
