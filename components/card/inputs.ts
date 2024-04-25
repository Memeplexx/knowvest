"use client";

import { ForwardedRef, useImperativeHandle, useRef } from "react";
import { CardHandle, Props } from "./constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (
  props: Props,
  ref: ForwardedRef<CardHandle>
) => {

  const headRef = useRef<HTMLDivElement>(null);

  const bodyRef = useRef<HTMLDivElement>(null);

  const previousScrollOffset = useRef(0);
  
  const headerOffset = useRef(0);

  useImperativeHandle<CardHandle, CardHandle>(ref, () => ({
    scrollToTop: function scrollToTop(){ bodyRef.current!.scroll({ top: 0, behavior: 'smooth' }); },
  }), []);

  return {
    headRef,
    bodyRef,
    previousScrollOffset,
    headerOffset,
    htmlProps: useUnknownPropsStripper({...props}),
  };
}