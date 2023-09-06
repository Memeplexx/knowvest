import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { CardHandle } from "./constants";

export const useInputs = (ref: ForwardedRef<CardHandle>) => {

  const head = useRef<HTMLDivElement>(null);

  const body = useRef<HTMLDivElement>(null);

  const previousScrollOffset = useRef(0);
  
  const headerOffset = useRef(0);

  useImperativeHandle<CardHandle, CardHandle>(ref, () => ({
    scrollToTop: () => body.current!.scroll({ top: 0, behavior: 'smooth' }),
  }), []);

  return {
    refs: {
      head,
      body,
    },
    state: {
      previousScrollOffset,
      headerOffset,
    }
  };
}