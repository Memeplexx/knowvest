"use client";
import { type ForwardedRef, forwardRef } from 'react';
import { Body, Header, LoaderPlaceholder, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardHandle, Props } from './constants';
import { useUnknownPropsStripper } from '@/utils/react-utils';

export const Card = forwardRef(function Card(
  props: Props,
  ref: ForwardedRef<CardHandle>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  return (
    <Wrapper
      id={props.id}
      {...useUnknownPropsStripper(props)}
      children={
        <>
          <Header
            ref={inputs.headRef}
            children={
              <>
                {props.heading}
                {props.actions}
              </>
            }
          />
          <Body
            ref={inputs.bodyRef}
            children={props.body}
            onScroll={outputs.onBodyScroll}
          />
          <LoaderPlaceholder
            if={!!props.loading}
          />
        </>
      }
    />
  );
})