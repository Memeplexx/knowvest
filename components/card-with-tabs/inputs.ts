"use client";

import { useRef } from "react";
import { Props } from "./constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabsRef = props.options.mapToObject(o => o.label, () => useRef<HTMLDivElement>(null));
  const underline = {
    left: tabsRef[props.selection]!.current?.offsetLeft,
    width: tabsRef[props.selection]!.current?.offsetWidth,
  }
  const Panel = props.options.findOrThrow(o => o.label === props.selection).panel;
  return {
    Panel,
    tabsRef,
    underline,
    htmlProps: useUnknownPropsStripper({ ...props }),
  }
}