"use client";
import { useHtmlPropsOnly } from '@/utils/react-utils';
import { forwardRef, type ForwardedRef } from 'react';
import { ContainerWithStickyHeaderHandle, Props } from './constants';
import { useInputs } from './inputs';
import { useOutputs } from './outputs';
import { Body, ContainerWithStickyHeaderWrapper, StickyHeader } from './styles';


const Container = (
  props: Props,
  ref: ForwardedRef<ContainerWithStickyHeaderHandle>
) => {
  const inputs = useInputs(ref);
  const outputs = useOutputs(props, inputs);
  return (
    <ContainerWithStickyHeaderWrapper
      id={props.id}
      {...useHtmlPropsOnly(props)}
      children={
        <>
          <StickyHeader
            ref={inputs.headerRef}
            children={props.heading}
          />
          <Body
            ref={inputs.bodyRef}
            children={props.body}
            onScroll={outputs.onBodyScroll.bind(this)}
            $headerHeight={inputs.headerHeight}
          />
        </>
      }
    />
  );
}

export const ContainerWithStickyHeader = forwardRef(Container)