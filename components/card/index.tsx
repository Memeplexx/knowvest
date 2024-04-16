"use client";
import { type ForwardedRef, forwardRef } from 'react';
import { Actions, Body, Header, Heading, LoaderPlaceholder, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardHandle, Props } from './constants';

export const Card = forwardRef(function Card(
  props: Props,
  ref: ForwardedRef<CardHandle>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  return (
    <Wrapper
      id={props.id}
      className={props.className}
      children={
        <>
          <Header
            ref={inputs.headRef}
            children={
              <>
                <Heading 
                  children={props.heading}
                 />
                <Actions
                  children={props.actions?.()}
                />
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