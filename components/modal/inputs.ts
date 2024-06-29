import { useStore } from "@/utils/store-utils";
import { useRef, useState } from "react";
import { useSpring } from "react-spring";
import { Props, animationDuration } from "./constants";

export const useInputs = (props: Props) => {

  const { state: { isMobileWidth } } = useStore();
  const [showInternal, setShowInternal] = useState(props.if);

  const backdropRef = useRef<HTMLDivElement>(null);

  const isClosingRef = useRef(false);

  const backgroundAnimations = useSpring({
    opacity: props.if ? 1 : 0,
    config: { duration: animationDuration },
  });

  const foregroundAnimations = useSpring({
    opacity: props.if ? 1 : 0,
    transform: `scale(${props.if ? 1 : 1.4})`,
    filter: `blur(${props.if ? 0 : 20}px)`,
    config: { duration: animationDuration },
  });

  if (props.if && !showInternal) {
    setShowInternal(true);
  } else if (!props.if && showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      setShowInternal(false);
      props.onClose?.();
      isClosingRef.current = false;
    }, animationDuration);
  }

  return {
    backdropRef,
    showInternal,
    backgroundAnimations: isMobileWidth ? undefined : backgroundAnimations,
    foregroundAnimations: isMobileWidth ? undefined : foregroundAnimations,
  }
}
