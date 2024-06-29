"use client";

import { useComponent } from "@/utils/react-utils";
import { useStore } from "@/utils/store-utils";
import { ForwardedRef, useImperativeHandle, useRef, useState } from "react";
import { ContainerWithStickyHeaderHandle } from "./constants";

export const useInputs = (
  ref: ForwardedRef<ContainerWithStickyHeaderHandle>
) => {

  const { isMobileWidth } = useStore();
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previousScrollOffset = useRef(0);
  const headerOffset = useRef(0);
  const component = useComponent();

  useImperativeHandle<ContainerWithStickyHeaderHandle, ContainerWithStickyHeaderHandle>(ref, () => ({
    scrollToTop: function scrollToTop() { bodyRef.current!.scroll({ top: 0, behavior: 'smooth' }); },
    headerHeight,
  }), [headerHeight]);

  const headerHeightMeasured = headerRef.current?.offsetHeight || 0;
  if (component.isMounted && headerHeight !== headerHeightMeasured)
    setHeaderHeight(headerHeightMeasured);

  return {
    headerRef,
    bodyRef,
    previousScrollOffset,
    headerOffset,
    isMobileWidth,
    headerHeight: 64,
  };
}