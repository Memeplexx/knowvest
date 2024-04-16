"use client";

import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { useSpring } from "react-spring";
import { PopupHandle, Props, animationDuration } from "./constants";
import { useFloating } from "@floating-ui/react";
import { useRecord } from "@/utils/react-utils";

export const useInputs = (
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) => {

  const state = useRecord({
    showInternal: false,
    show: false,
  });

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
    state.set(s => ({ ...s, showInternal: true }));
  } else if (!state.show && state.showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      state.set({ showInternal: false, show: false });
      isClosingRef.current = false;
    }, animationDuration);
  }

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  useImperativeHandle(forwardedRef, () => ({
    hide: function hide(){ state.set({ show: false }); }
  }), [state]);

  return {
    floatingRef,
    ...state,
    backgroundAnimations,
    foregroundAnimations,
  }
}
