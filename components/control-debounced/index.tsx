"use client";
import { createElement, useRef, useState } from "react";
import { Props } from "./constants";


export function Debounced<T>(props: Props<T>) {
  const [state, setState] = useState(props.value);
  const valueRef = useRef(state);
  const timestampRef = useRef(0);
  timestampRef.current = Date.now();
  const timeoutRef = useRef<number>(0);
  const actualDebounceTime = props.debounceTime ?? 500;
  if (state !== valueRef.current) {
    valueRef.current = state;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (Date.now() < (timestampRef.current + actualDebounceTime))
        return;
      props.onChange(state);
    }, actualDebounceTime)
  }
  return createElement(props.render.type, {
    ...props.render.props,
    onChange: (e: React.ChangeEvent<{ value: string }>) => setState(e.target.value),
    value: state,
  });
}
