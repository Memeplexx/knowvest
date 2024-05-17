"use client";

import { useStore } from "@/utils/store-utils";
import { useFloating } from "@floating-ui/react";
import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { useSpring } from "react-spring";
import { PopupHandle, Props, animationDuration } from "./constants";


export const useInputs = (
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) => {
  const { store, state } = useStore(props.storeKey, { showInternal: false, show: false });
  const { show, showInternal } = state.$local;
  const isClosingRef = useRef(false);

  const backgroundAnimations = useSpring({
    opacity: show ? 1 : 0,
    config: { duration: animationDuration },
  });

  const foregroundAnimations = useSpring({
    opacity: show ? 1 : 0,
    transform: `scale(${show ? 1 : 0.4})`,
    filter: `blur(${show ? 0 : 20}px)`,
    config: { duration: animationDuration },
  });

  if (show && !showInternal) {
    store.$local.showInternal.$set(true);
  } else if (!show && showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      store.$local.$patch({ showInternal: false, show: false });
      isClosingRef.current = false;
    }, animationDuration);
  }

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  useImperativeHandle(forwardedRef, () => ({
    hide: function hide() { store.$local.show.$set(false); }
  }), [store]);

  return {
    floatingRef,
    store,
    state,
    backgroundAnimations,
    foregroundAnimations,
  }
}
