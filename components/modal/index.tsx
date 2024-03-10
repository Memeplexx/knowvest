"use client";
import { createPortal } from 'react-dom';
import { Background, Foreground, ForegroundWrapper } from './styles';
import { useInputs } from './inputs';
import { Props } from './constants';
import { useOutputs } from './outputs';


export const Modal = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
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

