"use client";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ControlButtonIconWrapper } from "./styles";

export const ControlButtonIcon = forwardRef(function ButtonIcon(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ControlButtonIconWrapper
      {...props}
      ref={ref}
      children={props.children}
    />
  )
});

