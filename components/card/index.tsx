import { ForwardedRef, forwardRef } from 'react';
import { Body, Header, Wrapper } from './styles';
import { useHooks } from './hooks';
import { useEvents } from './events';
import { CardProps } from './constants';

export const Card = forwardRef(function Card(
  props: CardProps,
  ref: ForwardedRef<HTMLElement>
) {
  const state = useHooks(ref);
  const events = useEvents(state);
  return (
    <Wrapper
      {...props}
      $themeType={props.$themeType}
      children={
        <>
          {(props.title || props.actions) && (
            <Header
              ref={state.headEl}
              children={
                <>
                  {props.title}
                  {props.actions}
                </>
              }
            />
          )}
          <Body 
            ref={state.bodyEl}
            children={props.body}
            onScroll={events.onBodyScroll}
          />
        </>
      }
    />
  );
})