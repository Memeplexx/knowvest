"use client";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ButtonIconWrapper } from "./styles";

export const ButtonIcon = forwardRef(function ButtonIcon(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ButtonIconWrapper
      {...props}
      ref={ref}
      children={props.children}
    />
  )
});

