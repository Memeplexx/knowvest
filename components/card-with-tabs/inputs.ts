import { useRef } from "react";
import { Props } from "./constants";
import { useRecord } from "@/utils/hooks";

export const useInputs = (props: Props) => {
  const tabsRef = props.options.mapToObject(o => o.label, o => useRef<HTMLDivElement>(null));
  const state = useRecord({ selected: props.options[0].label });
  const onChange = (selected: string) => state.set({ selected });
  const underline = {
    left: tabsRef[state.selected].current?.offsetLeft,
    width: tabsRef[state.selected].current?.offsetWidth,
  }
  const Panel = props.options.find(o => o.label === state.selected)!.panel;
  return {
    Panel,
    tabsRef,
    underline,
    state,
  }
}