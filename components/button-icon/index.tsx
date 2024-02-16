"use client";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { Wrapper } from "./styles";

export const ButtonIcon = forwardRef(function ButtonIcon(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <Wrapper
      {...props}
      ref={ref}
      children={props.children}
    />
  )
});

