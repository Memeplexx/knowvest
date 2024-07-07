"use client";
import { forwardRef, type ForwardedRef } from 'react';
import { Portal } from '../control-conditional';
import { AutocompleteHandle, OptionBase, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ButtonsWrapper, ClearIcon, ClearTextButton, ControlAutocompleteWrapper, ErrorMsg, Input, OptionItem, Options, OptionsBackdrop } from './styles';


const Autocomplete = <Option extends OptionBase>(
  props: Props<Option>,
  forwardedRef: ForwardedRef<AutocompleteHandle>
) => {
  const inputs = useInputs(props, forwardedRef);
  const outputs = useOutputs(props, inputs);
  return (
    <ControlAutocompleteWrapper
      tabIndex={0}
      ref={inputs.containerRef}
      children={
        <>
          <Input
            type='text'
            ref={inputs.floatingRef.refs.setReference}
            value={props.inputText}
            onChange={outputs.onChangeInput.bind(this)}
            onKeyDown={outputs.onKeyDownInput.bind(this)}
            onKeyUp={outputs.onKeyUpInput.bind(this)}
            onClick={outputs.onClickInput.bind(this)}
            placeholder={props.inputPlaceholder}
            $hasError={!!props.error}
            disabled={props.disabled}
          />
          <ButtonsWrapper
            children={
              <ClearTextButton
                if={!!props.inputText.trim() && !props.disabled}
                onClick={outputs.onClickClearText.bind(this)}
                title='Clear text'
                aria-label='Clear text'
                children={<ClearIcon />}
              />
            }
          />
          <ErrorMsg
            if={!!props.error}
            children={props.error}
          />
          <Portal
            if={props.showOptions}
            children={
              <OptionsBackdrop
                onClick={outputs.onHideOptions.bind(this)}
                children={
                  <Options
                    ref={inputs.floatingRef.refs.setFloating}
                    style={inputs.floatingRef.floatingStyles}
                    children={inputs.options.map(option => (
                      <OptionItem
                        type='button'
                        key={option.value}
                        tabIndex={0}
                        onKeyDown={outputs.onKeyDownOption.bind(this)}
                        onKeyUp={outputs.onKeyUpOption.bind(this, option.value)}
                        onClick={outputs.onClickOption.bind(this, option.value)}
                        children={props.renderOption?.(option) || option.label}
                      />
                    ))}
                  />
                }
              />
            }
          />
        </>
      }
    />
  );
}

export const ControlAutocomplete = forwardRef(Autocomplete);
