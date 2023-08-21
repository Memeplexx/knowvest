import { AutocompleteHandle, Props, OptionBase } from './constants';
import { ClearIcon, ClearTextButton, Container, ErrorMsg, Input, OptionItem, Options } from './styles';
import { useHooks } from './hooks';
import { defineEvents } from './events';
import { ForwardedRef, forwardRef } from 'react';


export const Autocomplete = forwardRef(function Autocomplete<Option extends OptionBase>(
  props: Props<Option>,
  ref: ForwardedRef<AutocompleteHandle>
) {
  const state = useHooks(props, ref);
  const events = defineEvents(state);
  return (
    <Container
      ref={state.refs.container}
      children={
        <>
          <Input
            ref={state.refs.floating.refs.setReference}
            value={props.inputText}
            onChange={events.onChangeInput}
            onKeyDown={events.onKeyDownInput}
            onKeyUp={events.onKeyUpInput}
            onFocus={events.onFocusInput}
            expanded={state.props.showOptions}
            placeholder={props.inputPlaceholder}
            hasError={!!props.error}
            disabled={props.disabled}
          />
          <ClearTextButton
            showIf={!!props.inputText.trim() && !props.disabled}
            onClick={events.onClickClearText}
            title="Clear text"
            children={<ClearIcon />}
          />
          <ErrorMsg
            showIf={!!props.error}
            children={props.error}
          />
          <Options
            ref={state.refs.floating.refs.setFloating}
            style={state.refs.floating.floatingStyles}
            showIf={state.props.showOptions}
            children={
              state.state.optionsFiltered.map(option => (
                <OptionItem
                  key={option.value}
                  tabIndex={0}
                  onKeyDown={events.onKeyDownOption}
                  onKeyUp={e => events.onKeyUpOption(option.value, e)}
                  onClick={() => events.onClickOption(option.value)}
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
