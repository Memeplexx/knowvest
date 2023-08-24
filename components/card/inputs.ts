import { useForwardedRef } from "@/utils/hooks";
import { ForwardedRef, useRef } from "react";

export const useInputs = (ref: ForwardedRef<HTMLElement>) => {
  const head = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const previousScrollOffset = useRef(0);
  const headerOffset = useRef(0);
  return {
    refs: {
      head,
      body,
      container: useForwardedRef(ref),
    },
    state: {
      previousScrollOffset,
      headerOffset,
    }
  };
}