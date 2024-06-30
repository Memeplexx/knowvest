"use client";
import { useHtmlPropsOnly } from "@/utils/react-utils";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ControlButtonFancyWrapper } from "./styles";

export const ControlButtonFancy = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <ControlButtonFancyWrapper
      {...useHtmlPropsOnly(props)}
      $highlighted={props.highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

