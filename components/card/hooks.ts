import { useForwardedRef } from "@/utils/hooks";
import { ForwardedRef, useRef } from "react";

export const useHooks = (ref: ForwardedRef<HTMLElement>) => {
  const headEl = useRef<HTMLDivElement>(null);
  const bodyEl = useRef<HTMLDivElement>(null);
  const previousScrollOffset = useRef(0);
  const headerOffset = useRef(0);
  return {
    headEl,
    bodyEl,
    previousScrollOffset,
    headerOffset,
    containerRef: useForwardedRef(ref),
  };
}