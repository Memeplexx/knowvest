"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { forwardRef, type ForwardedRef } from 'react';
import { CardHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Body, Header, LoaderPlaceholder, Wrapper } from './styles';

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