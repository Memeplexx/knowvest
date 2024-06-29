"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { forwardRef, type ForwardedRef } from 'react';
import { CardHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Body, CardWrapper, HamburgerButton, HamburgerIcon, Header } from './styles';

export const Card = forwardRef(function Card(
  props: Props,
  ref: ForwardedRef<CardHandle>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  return (
    <CardWrapper
      id={props.id}
      {...useUnknownPropsStripper(props)}
      children={
        <>
          <Header
            ref={inputs.headRef}
            children={
              <>
                <HamburgerButton
                  if={inputs.isMobileWidth}
                  onClick={outputs.onClickHamburger}
                  children={
                    <HamburgerIcon />
                  }
                />
                {props.heading}
              </>
            }
          />
          <Body
            ref={inputs.bodyRef}
            children={props.body}
            onScroll={outputs.onBodyScroll}
          />
        </>
      }
    />
  );
})