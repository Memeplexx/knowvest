import { type ForwardedRef, forwardRef } from 'react';
import { Actions, Body, Header, Heading, Loader, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardHandle, CardProps } from './constants';

export const Card = forwardRef(function Card(
  props: CardProps,
  ref: ForwardedRef<CardHandle>
) {
  const { heading, actions, body, loading, className, id } = props;
  const inputs = useInputs(ref);
  const outputs = useOutputs(inputs);
  const { refs } = inputs;
  return (
    <Wrapper
      id={id}
      className={className}
      children={
        <>
          <Header
            ref={refs.head}
            children={
              <>
                <Heading 
                  children={heading}
                 />
                <Actions
                  children={actions?.()}
                />
              </>
            }
          />
          <Body
            ref={refs.body}
            children={body}
            onScroll={outputs.onBodyScroll}
          />
          <Loader
            isVisible={loading}
          />
        </>
      }
    />
  );
})