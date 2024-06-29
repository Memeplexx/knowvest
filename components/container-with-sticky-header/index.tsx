"use client";
import { useUnknownPropsStripper } from '@/utils/react-utils';
import { forwardRef, type ForwardedRef } from 'react';
import { ContainerWithStickyHeaderHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Body, ContainerWithStickyHeaderWrapper, Header } from './styles';

export const ContainerWithStickyHeader = forwardRef(function Wrapper(
  props: Props,
  ref: ForwardedRef<ContainerWithStickyHeaderHandle>
) {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  return (
    <ContainerWithStickyHeaderWrapper
      id={props.id}
      {...useUnknownPropsStripper(props)}
      children={
        <>
          <Header
            ref={inputs.headerRef}
            children={props.heading}
          />
          <Body
            ref={inputs.bodyRef}
            children={props.body}
            onScroll={outputs.onBodyScroll}
            $headerHeight={inputs.headerHeight}
          />
        </>
      }
    />
  );
})