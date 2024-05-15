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
  const { store, localState, localStore } = useStore({ key: props.storeKey, value: { showInternal: false, show: false }});
  const isClosingRef = useRef(false);

  const backgroundAnimations = useSpring({
    opacity: localState!.show ? 1 : 0,
    config: { duration: animationDuration },
  });

  const foregroundAnimations = useSpring({
    opacity: localState!.show ? 1 : 0,
    transform: `scale(${localState!.show ? 1 : 0.4})`,
    filter: `blur(${localState!.show ? 0 : 20}px)`,
    config: { duration: animationDuration },
  });

  if (localState!.show && !localStore.$state.showInternal) {
    localStore.showInternal.$set(true);
  } else if (!localState.show && localState.showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      localStore.$patch({ showInternal: false, show: false });
      isClosingRef.current = false;
    }, animationDuration);
  }

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'bottom-end' });

  useImperativeHandle(forwardedRef, () => ({
    hide: function hide() { localStore.show.$set(false); }
  }), [localStore.show]);

  return {
    floatingRef,
    store,
    localStore,
    ...localState,
    backgroundAnimations,
    foregroundAnimations,
  }
}
