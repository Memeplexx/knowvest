import { type ForwardedRef, forwardRef } from 'react';
import { Body, Header, Loader, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardHandle, CardProps } from './constants';

export const Card = forwardRef(function Card(
  props: CardProps,
  ref: ForwardedRef<CardHandle>
) {
  const { title, actions, body, loading, className } = props;
  const inputs = useInputs(ref);
  const outputs = useOutputs(inputs);
  const { refs } = inputs;
  return (
    <Wrapper
      className={className}
      children={
        <>
          <Header
            ref={refs.head}
            children={
              <>
                {title}
                {actions}
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