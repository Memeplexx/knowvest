import { UseFloatingOptions, autoUpdate, flip, size } from '@floating-ui/react';
import { type ReactNode } from 'react';
import { useInputs } from './inputs';

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

export const floatingUiDefaultOptions = {
  whileElementsMounted: autoUpdate,
  middleware: [
    flip({ padding: 10 }),
    size({
      apply({ rects, availableHeight, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: `${availableHeight}px`
        });
      },
      padding: 10,
    })
  ]
} as Partial<UseFloatingOptions>;

export type Inputs<Option extends OptionBase> = ReturnType<typeof useInputs<Option>>;
