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
  const { state, refs } = inputs;
  return !state.showInternal ? <></> : createPortal(
    <>
      <Background
        style={state.backgroundAnimations}
        ref={refs.backdrop}
        onClick={outputs.onClickBackdrop}
      />
      <ForegroundWrapper
        children={
          <Foreground
            style={state.foregroundAnimations}
            children={props.children}
          />
        }
      />
    </>
    , document.body);
}

