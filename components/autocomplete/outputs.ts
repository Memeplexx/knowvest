import { ChangeEvent, KeyboardEvent } from "react";
import { OptionBase, Inputs } from "./constants";
import { TypedKeyboardEvent } from "@/utils/types";

export const useOutputs = <Option extends OptionBase>(inputs: Inputs<Option>) => {
  const { state, props, refs } = inputs;
  return {
    onFocusInput: () => {
      props.onInputFocused();
    },
    onClickOption: (value: Option['value']) => {
      props.onValueChange(value);
    },
    onChangeInput: (event: ChangeEvent<HTMLInputElement>) => {
      props.onInputTextChange(event.target.value.toLowerCase());
    },
    onKeyDownInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        if (!state.optionsFiltered.length) { return true; }
        (refs.options.current?.firstChild as HTMLElement)?.focus();
        event.preventDefault(); // prevents undesirable scrolling behavior
      }
    },
    onKeyUpInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        refs.container.current?.blur();
        const selectedOption = state.optionsFiltered.find(o => o.label.toLowerCase() === refs.input.current!.value.toLowerCase());
        if (selectedOption) {
          props.onValueChange(selectedOption.value);
        } else {
          props.onInputEnterKeyUp?.();
        }
      }
    },
    onKeyDownOption: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        if (!state.optionsFiltered.length) { return true; }
        (document.activeElement?.nextElementSibling as HTMLElement)?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        const previousElement = document.activeElement?.previousElementSibling as HTMLElement;
        if (previousElement) {
          previousElement.focus();
        } else {
          refs.input.current?.focus();
        }
      }
    },
    onKeyUpOption: (value: Option['value'], event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter') {
        props.onValueChange(value);
      }
    },
    onClickClearText: () => {
      props.onInputTextChange('');
    },
  };
}