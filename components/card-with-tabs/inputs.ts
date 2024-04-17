"use client";

import { useRef } from "react";
import { Props } from "./constants";
import { useRecord, useUnknownPropsStripper } from "@/utils/react-utils";

export const useInputs = (props: Props) => {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabsRef = props.options.mapToObject(o => o.label, () => useRef<HTMLDivElement>(null));
  const localState = useRecord({
    selected: props.options[0]!.label
  });
  const underline = {
    left: tabsRef[localState.selected]!.current?.offsetLeft,
    width: tabsRef[localState.selected]!.current?.offsetWidth,
  }
  const Panel = props.options.findOrThrow(o => o.label === localState.selected).panel;
  return {
    Panel,
    tabsRef,
    underline,
    ...localState,
    htmlProps: useUnknownPropsStripper('div', {...props}),
  }
}