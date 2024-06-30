"use client";
import { useUnknownPropsStripper } from "@/utils/react-utils";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ControlButtonIconWrapper } from "./styles";

export const ControlButtonIcon = forwardRef(function ButtonIcon(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ControlButtonIconWrapper
      {...useUnknownPropsStripper(props)}
      ref={ref}
      children={props.children}
    />
  )
});

