import { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import { Props, animationDuration } from "./constants";

export const useInputs = (props: Props) => {

  const [showInternal, setShowInternal] = useState(props.show);

  const backdrop = useRef<HTMLDivElement>(null);

  const isClosingRef = useRef(false);

  const backgroundAnimations = useSpring({
    opacity: props.show ? 1 : 0,
    config: { duration: animationDuration },
  });

  const foregroundAnimations = useSpring({
    opacity: props.show ? 1 : 0,
    transform: `scale(${props.show ? 1 : 1.4})`,
    filter: `blur(${props.show ? 0 : 20}px)`,
    config: { duration: animationDuration },
  });

  if (props.show && !showInternal) {
    setShowInternal(true);
  } else if (!props.show && showInternal && !isClosingRef.current) {
    isClosingRef.current = true;
    setTimeout(() => {
      setShowInternal(false);
      props.onCloseComplete?.();
      isClosingRef.current = false;
    }, animationDuration);
  }

  const isMobileWidth = useIsMobileWidth();

  return {
    refs: {
      backdrop,
    },
    state: {
      showInternal,
      backgroundAnimations: isMobileWidth ? undefined : backgroundAnimations,
      foregroundAnimations: isMobileWidth ? undefined : foregroundAnimations,
    },
    props,
  }
}

const useIsMobileWidth = () => {
  const [isMobileWidth, setIsMobileWidth] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileWidth(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobileWidth;
}