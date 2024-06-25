"use client";

import { useStore } from "@/utils/store-utils";
import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { CardHandle } from "./constants";

export const useInputs = (
  ref: ForwardedRef<CardHandle>
) => {

  const { store, state: { mediaQuery } } = useStore();

  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previousScrollOffset = useRef(0);
  const headerOffset = useRef(0);

  useImperativeHandle<CardHandle, CardHandle>(ref, () => ({
    scrollToTop: function scrollToTop() { bodyRef.current!.scroll({ top: 0, behavior: 'smooth' }); },
  }), []);

  return {
    store,
    headRef,
    bodyRef,
    previousScrollOffset,
    headerOffset,
    isMobileWidth: mediaQuery === 'xs' || mediaQuery === 'sm',
  };
}