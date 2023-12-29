import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { CardHandle, Props } from "./constants";

export const useInputs = (ref: ForwardedRef<CardHandle>, props: Props) => {

  const headRef = useRef<HTMLDivElement>(null);

  const bodyRef = useRef<HTMLDivElement>(null);

  const previousScrollOffset = useRef(0);
  
  const headerOffset = useRef(0);

  useImperativeHandle<CardHandle, CardHandle>(ref, () => ({
    scrollToTop: () => bodyRef.current!.scroll({ top: 0, behavior: 'smooth' }),
  }), []);

  return {
    headRef,
    bodyRef,
    previousScrollOffset,
    headerOffset,
    props,
  };
}