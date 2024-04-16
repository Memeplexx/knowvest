"use client";
import { ForwardedRef, forwardRef } from "react";
import { Wrapper } from "./styles";
import { Props } from "./constants";
import { useUnknownPropsStripper } from "@/utils/react-utils";

export const Button = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  const htmlProps = useUnknownPropsStripper('div', props);
  return (
    <Wrapper
      {...htmlProps}
      $highlighted={props.highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

