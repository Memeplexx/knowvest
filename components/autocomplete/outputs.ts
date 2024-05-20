import { ChangeEvent, MouseEvent } from "react";
import { OptionBase, Inputs, Props } from "./constants";
import { TypedKeyboardEvent } from "@/utils/dom-utils";

export const useOutputs = <Option extends OptionBase>(props: Props<Option>, inputs: Inputs<Option>) => {
  const { options, inputRef } = inputs;
  return {
    onFocusInput: () => {
      props.onInputFocused();
    },
    onClickOption: (value: Option['value'], event: MouseEvent) => {
      if (event.detail === 0) /* handled by onKeyUpInput */
        return; 
      props.onValueChange(value);
      props.onShowOptionsChange(false);
    },
    onChangeInput: (event: ChangeEvent<HTMLInputElement>) => {
      props.onInputTextChange(event.target.value.toLowerCase());
    },
    onKeyDownInput: (event: TypedKeyboardEvent<HTMLInputElement>): true | void => {
      if (event.key !== 'ArrowDown') 
        return;
      if (!options.length) 
        return true;
      (inputs.optionsPopupRef.current?.firstChild as HTMLElement)?.focus();
      event.preventDefault(); // prevents undesirable scrolling behavior
    },
    onKeyUpInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') 
        return;
      inputs.containerRef.current?.blur();
      const inputValueToLowerCase = inputRef.current!.value.toLowerCase();
      const selectedOption = options.find(o => o.label.toLowerCase() === inputValueToLowerCase);
      if (selectedOption)
        props.onValueChange(selectedOption.value);
      else
        props.onInputEnterKeyUp?.();
      props.onShowOptionsChange(false);
    },
    onKeyDownOption: (event: TypedKeyboardEvent<HTMLElement>): true | void => {
      if (event.key === 'ArrowDown') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        if (!options.length)
          return true;
        (document.activeElement?.nextElementSibling as HTMLElement)?.focus();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // prevents undesirable scrolling behavior
        const previousElement = document.activeElement?.previousElementSibling as HTMLElement;
        if (previousElement) {
          previousElement.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    },
    onKeyUpOption: (value: Option['value'], event: TypedKeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter') 
        return;
      props.onValueChange(value);
    },
    onClickClearText: () => {
      props.onInputTextChange('');
    },
  };
}