"use client";
import { type ForwardedRef, forwardRef } from 'react';
import { Actions, Body, Header, Heading, LoaderPlacehlder, Wrapper } from './styles';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { CardHandle, Props } from './constants';

export const Card = forwardRef(function Card(
  props: Props,
  ref: ForwardedRef<CardHandle>
) {
  const inputs = useInputs(ref, props);
  const outputs = useOutputs(inputs);
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
          <LoaderPlacehlder
            showIf={!!props.loading}
            opacity={0.1}
          />
        </>
      }
    />
  );
})