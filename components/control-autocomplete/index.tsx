"use client";
import { Overlay } from '@/utils/style-provider';
import { forwardRef, type ForwardedRef } from 'react';
import { AutocompleteHandle, OptionBase, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { ButtonsWrapper, ClearIcon, ClearTextButton, ControlAutocompleteWrapper, ErrorMsg, Input, OptionItem, Options } from './styles';


export const ControlAutocomplete = forwardRef(function Autocomplete<Option extends OptionBase>(
  props: Props<Option>,
  forwardedRef: ForwardedRef<AutocompleteHandle>
) {
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
            onChange={outputs.onChangeInput}
            onKeyDown={outputs.onKeyDownInput}
            onKeyUp={outputs.onKeyUpInput}
            onClick={outputs.onClickInput}
            placeholder={props.inputPlaceholder}
            $hasError={!!props.error}
            disabled={props.disabled}
          />
          <ButtonsWrapper
            children={
              <ClearTextButton
                if={!!props.inputText.trim() && !props.disabled}
                onClick={outputs.onClickClearText}
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
          <Overlay
            if={props.showOptions}
            onClickBackdrop={outputs.onHideOptions}
            onEscapeKeyPressed={outputs.onHideOptions}
            blurBackdrop={false}
            overlay={
              <Options
                ref={inputs.floatingRef.refs.setFloating}
                style={inputs.floatingRef.floatingStyles}
                children={inputs.options.map(option => (
                  <OptionItem
                    type='button'
                    key={option.value}
                    tabIndex={0}
                    onKeyDown={outputs.onKeyDownOption}
                    onKeyUp={e => outputs.onKeyUpOption(option.value, e)}
                    onClick={e => outputs.onClickOption(option.value, e)}
                    children={props.renderOption?.(option) || option.label}
                  />
                ))}
              />
            }
          />
        </>
      }
    />
  );
});
