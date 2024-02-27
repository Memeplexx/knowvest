"use client";
import { ForwardedRef, forwardRef } from "react";
import { Wrapper } from "./styles";
import { Props } from "./constants";

export const Button = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  const { highlighted, ...remainingProps } = props;
  return (
    <Wrapper
      {...remainingProps}
      $highlighted={highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

