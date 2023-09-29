import { createPortal } from 'react-dom';
import { Floating, Foreground, ForegroundWrapper } from './styles';
import { useInputs } from './inputs';
import { Props } from './constants';
import { useOutputs } from './outputs';


export const Popup = (
  props: Props
) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <>
      {props.trigger({
        ref: refs.floating.refs.setReference,
        onClick: () => setTimeout(() => outputs.onClickTrigger(), 50),
      })}
      {
        !state.showInternal
          ? <></>
          : createPortal(
            <ForegroundWrapper
              style={state.backgroundAnimations}
              onClick={outputs.onClickBackdrop}
              children={
                <Floating
                  ref={refs.floating.refs.setFloating}
                  style={refs.floating.floatingStyles}
                  onClick={e => e.stopPropagation()}
                  children={
                    <Foreground
                      style={state.foregroundAnimations}
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
}

