import {  useRef } from "react";
import { useSpring } from "react-spring";
import { Props, animationDuration } from "./constants";
import { useFloating } from "@floating-ui/react";
import { useRecord } from "@/utils/hooks";

export const useInputs = (props: Props) => {

  const state = useRecord({ showInternal: false, show: false });

  const isClosingRef = useRef(false);

  const backgroundAnimations = useSpring({
    opacity: state.show ? 1 : 0,
    config: { duration: animationDuration },
  });

  const foregroundAnimations = useSpring({
    opacity: state.show ? 1 : 0,
    transform: `scale(${state.show ? 1 : 0.4})`,
    filter: `blur(${state.show ? 0 : 20}px)`,
    config: { duration: animationDuration },
  });

  if (state.show && !state.showInternal) {
    state.set({ showInternal: true });
  } else if (!state.show && state.showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      state.set({ showInternal: false, show: false });
      isClosingRef.current = false;
    }, animationDuration);
  }

  const floating = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  return {
    refs: {
      floating,
    },
    state: {
      ...state,
      backgroundAnimations,
      foregroundAnimations,
    },
    props,
  }
}
