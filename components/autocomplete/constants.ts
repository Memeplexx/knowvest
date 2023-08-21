import { ReactNode } from 'react';
import { useHooks } from './hooks';

export type OptionBase = { value: number | string | null, label: string };

export type Props<Option extends OptionBase> = {
  
  options: Array<Option>,
  disabled?: boolean,
  inputPlaceholder?: string,
  error?: string,
  renderOption?: (option: Option) => ReactNode,
  onInputEnterKeyUp?: () => void,
  onInputEscapeKeyUp?: () => void,

  value?: Option['value'],
  onValueChange: (value: Option['value']) => void,

  onInputFocused: () => void,

  inputText: string,
  onInputTextChange: (text: string) => void,

  showOptions: boolean,
  onShowOptionsChange: (show: boolean) => void,

};

export type AutocompleteHandle = {
  focusInput: () => void;
  blurInput: () => void;
};

export type State<Option extends OptionBase> =  ReturnType<typeof useHooks<Option>>;
