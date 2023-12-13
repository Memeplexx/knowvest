import { AutocompleteHandle, Props, OptionBase } from './constants';
import { ClearIcon, ClearTextButton, Container, ErrorMsg, Input, OptionItem, Options } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { type ForwardedRef, forwardRef } from 'react';


export const Autocomplete = forwardRef(function Autocomplete<Option extends OptionBase>(
  props: Props<Option>,
  forwardedRef: ForwardedRef<AutocompleteHandle>
) {
  const inputs = useInputs(props, forwardedRef);
  const outputs = useOutputs(inputs);
  return (
    <Container
      ref={inputs.containerRef}
      children={
        <>
          <Input
            type='text'
            ref={inputs.floatingRef.refs.setReference}
            value={props.inputText}
            onChange={outputs.onChangeInput}
            onKeyDown={outputs.onKeyDownInput}
            onKeyUp={outputs.onKeyUpInput}
            onFocus={outputs.onFocusInput}
            placeholder={props.inputPlaceholder}
            $hasError={!!props.error}
            disabled={props.disabled}
          />
          <ClearTextButton
            showIf={!!props.inputText.trim() && !props.disabled}
            onClick={outputs.onClickClearText}
            title="Clear text"
            aria-label='Clear text'
            children={<ClearIcon />}
          />
          <ErrorMsg
            showIf={!!props.error}
            children={props.error}
          />
          <Options
            ref={inputs.floatingRef.refs.setFloating}
            style={inputs.floatingRef.floatingStyles}
            showIf={props.showOptions}
            children={
              inputs.options.map(option => (
                <OptionItem
                  type='button'
                  key={option.value}
                  tabIndex={0}
                  onKeyDown={outputs.onKeyDownOption}
                  onKeyUp={outputs.onKeyUpOption(option.value)}
                  onClick={outputs.onClickOption(option.value)}
                  children={props.renderOption?.(option) || option.label}
                />
              ))
            }
          />
        </>
      }
    />
  );
});
