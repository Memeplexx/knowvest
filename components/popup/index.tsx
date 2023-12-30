import { createPortal } from 'react-dom';
import { Floating, Foreground, ForegroundWrapper } from './styles';
import { useInputs } from './inputs';
import { PopupHandle, Props } from './constants';
import { useOutputs } from './outputs';
import { ForwardedRef, forwardRef } from 'react';


export const Popup = forwardRef(function Popup(
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
      {
        !inputs.showInternal
          ? <></>
          : createPortal(
            <ForegroundWrapper
              style={inputs.backgroundAnimations}
              onClick={outputs.onClickBackdrop}
              children={
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
            , document.body)
      }
    </>
  )
});
