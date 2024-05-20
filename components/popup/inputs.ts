"use client";

import { useLocalStore } from "@/utils/store-utils";
import { useFloating } from "@floating-ui/react";
import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { useSpring } from "react-spring";
import { PopupHandle, Props, animationDuration } from "./constants";


export const useInputs = (
  props: Props,
  forwardedRef: ForwardedRef<PopupHandle>
) => {
  const { local, state: { show, showInternal } } = useLocalStore(props.storeKey, { showInternal: false, show: false });
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
    local.showInternal.$set(true);
  } else if (!show && showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      local.$patch({ showInternal: false, show: false });
      isClosingRef.current = false;
    }, animationDuration);
  }

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  useImperativeHandle(forwardedRef, () => ({
    hide: function hide() { local.show.$set(false); }
  }), [local]);

  return {
    floatingRef,
    local,
    ...local.$state,
    backgroundAnimations,
    foregroundAnimations,
  }
}
