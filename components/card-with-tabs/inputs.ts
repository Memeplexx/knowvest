"use client";

import { useRef, useState } from "react";
import { Props } from "./constants";

export const useInputs = (props: Props) => {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabsRef = props.options.mapToObject(o => o.label, () => useRef<HTMLDivElement>(null));
  const [state, setState] = useState({
    selected: props.options[0]!.label
  });
  const underline = {
    left: tabsRef[state.selected]!.current?.offsetLeft,
    width: tabsRef[state.selected]!.current?.offsetWidth,
  }
  const Panel = props.options.findOrThrow(o => o.label === state.selected).panel;
  return {
    Panel,
    tabsRef,
    underline,
    state,
    setState,
  }
}