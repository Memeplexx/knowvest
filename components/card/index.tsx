import { type ForwardedRef, forwardRef } from 'react';
import { Body, Header, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardProps } from './constants';

export const Card = forwardRef(function Card(
  props: CardProps,
  ref: ForwardedRef<HTMLElement>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(inputs);
  const { refs } = inputs;
  return (
    <Wrapper
      {...props}
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
            onScroll={outputs.onBodyScroll}
          />
        </>
      }
    />
  );
})