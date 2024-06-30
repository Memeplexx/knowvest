"use client";
import { useUnknownPropsStripper } from "@/utils/react-utils";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ControlButtonWrapper } from "./styles";

export const ControlButton = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ControlButtonWrapper
      {...useUnknownPropsStripper(props)}
      $highlighted={props.highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

