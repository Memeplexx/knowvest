import { createPortal } from 'react-dom';
import { Background, Foreground, ForegroundWrapper } from './styles';
import { useHooks } from './hooks';
import { Props } from './constants';
import { defineEvents } from './events';


export const Modal = (
  props: Props
) => {
  const state = useHooks(props);
  const events = defineEvents(state);
  return !state.showInternal ? <></> : createPortal(
    <>
      <Background
        style={state.backgroundAnimations}
        ref={state.backdropRef}
        onClick={events.onClickBackdrop}
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

