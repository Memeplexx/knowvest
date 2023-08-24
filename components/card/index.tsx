import { ForwardedRef, forwardRef } from 'react';
import { Body, Header, Wrapper } from './styles';
import { useHooks } from './hooks';
import { useEvents } from './events';
import { CardProps } from './constants';

export const Card = forwardRef(function Card(
  props: CardProps,
  ref: ForwardedRef<HTMLElement>
) {
  const hooks = useHooks(ref);
  const events = useEvents(hooks);
  const { refs } = hooks;
  return (
    <Wrapper
      {...props}
      $themeType={props.$themeType}
      children={
        <>
          {(props.title || props.actions) && (
            <Header
              ref={refs.head}
              children={
                <>
                  {props.title}
                  {props.actions}
                </>
              }
            />
          )}
          <Body 
            ref={refs.body}
            children={props.body}
            onScroll={events.onBodyScroll}
          />
        </>
      }
    />
  );
})