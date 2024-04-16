"use client";
import { useFloating } from "@floating-ui/react";
import { ForwardedRef, useImperativeHandle, useMemo, useRef } from "react";
import { Props, AutocompleteHandle, OptionBase, floatingUiDefaultOptions } from "./constants";
import { useForwardedRef } from "@/utils/react-utils";

export const useInputs = <Option extends OptionBase>(
  props: Props<Option>,
  forwardedRef: ForwardedRef<AutocompleteHandle>
) => {
  
  const floatingRef = useFloating<HTMLInputElement>(floatingUiDefaultOptions);
  const inputRef = floatingRef.refs.domReference;
  const optionsPopupRef = floatingRef.refs.floating;
  const containerRef = useForwardedRef(useRef<HTMLDivElement | null>(null));

  const optionsSorted = useMemo(() => {
    return props.options.sort((a, b) => a.label.localeCompare(b.label));
  }, [props.options]);

  const options = useMemo(() => {
    return optionsSorted.filter(o => !props.inputText || o.label.toLowerCase().includes(props.inputText.toLowerCase()));
  }, [optionsSorted, props.inputText]);

  const optionsPopupExpanded = !!props.showOptions && !!options.length;

  useImperativeHandle(forwardedRef, () => ({
    focusInput: function focusInput(){ inputRef.current!.focus(); },
    blurInput: function blurInput() { inputRef.current!.blur(); },
  }), [inputRef]);

  return {
    inputRef,
    containerRef,
    floatingRef,
    optionsPopupRef,
    optionsPopupExpanded,
    options,
  }
}