"use client";
import { createPortal } from 'react-dom';
import { Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Background, Foreground, ForegroundWrapper } from './styles';


export const OverlayModal = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(props, inputs);
  return !inputs.showInternal ? <></> : createPortal(
    <>
      <Background
        data-id='backdrop'
        style={inputs.backgroundAnimations}
        ref={inputs.backdropRef}
        onClick={outputs.onClickBackdrop}
      />
      <ForegroundWrapper
        children={
          <Foreground
            style={inputs.foregroundAnimations}
            children={props.children}
          />
        }
      />
    </>
    , document.body);
}

