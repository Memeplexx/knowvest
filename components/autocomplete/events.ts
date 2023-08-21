import { ChangeEvent, KeyboardEvent } from "react";
import { OptionBase, State } from "./constants";
import { TypedKeyboardEvent } from "@/utils/types";

export const defineEvents = <Option extends OptionBase>(state: State<Option>) => ({
  onFocusInput: () => {
    state.props.onInputFocused();
  },
  onClickOption: (value: Option['value']) => {
    state.props.onValueChange(value);
  },
  onChangeInput: (event: ChangeEvent<HTMLInputElement>) => {
    state.props.onInputTextChange(event.target.value.toLowerCase());
  },
  onKeyDownInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      if (!state.state.optionsFiltered.length) { return true; }
      (state.refs.optionsRef.current?.firstChild as HTMLElement)?.focus();
      event.preventDefault(); // prevents undesirable scrolling behavior
    }
  },
  onKeyUpInput: (event: TypedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      state.refs.container.current?.blur();
      const selectedOption = state.state.optionsFiltered.find(o => o.label.toLowerCase() === state.refs.input.current!.value.toLowerCase());
      if (selectedOption) {
        state.props.onValueChange(selectedOption.value);
      } else {
        state.props.onInputEnterKeyUp?.();
      }
    }
  },
  onKeyDownOption: (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // prevents undesirable scrolling behavior
      if (!state.state.optionsFiltered.length) { return true; }
      (document.activeElement?.nextElementSibling as HTMLElement)?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // prevents undesirable scrolling behavior
      const previousElement = document.activeElement?.previousElementSibling as HTMLElement;
      if (previousElement) {
        previousElement.focus();
      } else {
        state.refs.input.current?.focus();
      }
    }
  },
  onKeyUpOption: (value: Option['value'], event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      state.props.onValueChange(value);
    }
  },
  onClickClearText: () => {
    state.props.onInputTextChange('');
  },
})