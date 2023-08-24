import { floatingUiDefaultOptions } from "@/utils/constants";
import { useFloating } from "@floating-ui/react";
import { ForwardedRef, useImperativeHandle, useMemo, useRef } from "react";
import { Props, AutocompleteHandle, OptionBase } from "./constants";
import { useForwardedRef } from "@/utils/hooks";

export const useHooks = <Option extends OptionBase>(
  props: Props<Option>,
  forwardedRef: ForwardedRef<AutocompleteHandle>
) => {
  const floating = useFloating<HTMLInputElement>(floatingUiDefaultOptions);

  const input = floating.refs.domReference;

  const options = floating.refs.floating;

  const container = useForwardedRef(useRef<HTMLDivElement | null>(null));

  const optionsSorted = useMemo(() => {
    return props.options.sort((a, b) => a.label.localeCompare(b.label));
  }, [props.options]);

  const optionsFiltered = useMemo(() => {
    return optionsSorted.filter(o => !props.inputText || o.label.toLowerCase().includes(props.inputText.toLowerCase()));
  }, [optionsSorted, props.inputText]);

  const optionsPopupExpanded = !!props.showOptions && !!optionsFiltered.length;

  useImperativeHandle<AutocompleteHandle, AutocompleteHandle>(forwardedRef, () => ({
    focusInput: () => input.current!.focus(),
    blurInput: () => input.current!.blur(),
  }), [input]);

  return {
    props,
    refs: {
      input,
      container,
      floating,
      options,
    },
    state: {
      optionsPopupExpanded,
      optionsFiltered,
    }
  }
}