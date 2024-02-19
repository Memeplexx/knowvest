import { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { OptionBase, Inputs } from "./constants";
import { TypedKeyboardEvent } from "@/actions/types";

export const useOutputs = <Option extends OptionBase>({ props, options, inputRef, ...inputs }: Inputs<Option>) => {
  return {
    onFocusInput: () => {
      props.onInputFocused();
    },
    onClickOption: (value: Option['value'], event: MouseEvent) => {
      if (event.detail === 0) { return; } /* handled by onKeyUpInput */
      props.onValueChange(value);
      props.onShowOptionsChange(false);
    },
    onChangeInput: (event: ChangeEvent<HTMLInputElement>) => {
      props.onInputTextChange(event.target.value.toLowerCase());
    },
    onKeyDownInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'ArrowDown') { return; }
      if (!options.length) { return true; }
      (inputs.optionsPopupRef.current?.firstChild as HTMLElement)?.focus();
      event.preventDefault(); // prevents undesirable scrolling behavior
    },
    onKeyUpInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') { return; }
      inputs.containerRef.current?.blur();
      const inputValueToLowerCase = inputRef.current!.value.toLowerCase();
      const selectedOption = options.find(o => o.label.toLowerCase() === inputValueToLowerCase);
      if (selectedOption) {
        props.onValueChange(selectedOption.value);
      } else {
        props.onInputEnterKeyUp?.();
      }
      props.onShowOptionsChange(false);
    },
    onKeyDownOption: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        if (!options.length) { return true; }
        (document.activeElement?.nextElementSibling as HTMLElement)?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        const previousElement = document.activeElement?.previousElementSibling as HTMLElement;
        if (previousElement) {
          previousElement.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    },
    onKeyUpOption: (value: Option['value'], event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter') { return; }
      props.onValueChange(value);
    },
    onClickClearText: () => {
      props.onInputTextChange('');
    },
  };
}