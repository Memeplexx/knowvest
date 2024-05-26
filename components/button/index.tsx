"use client";
import { useUnknownPropsStripper } from "@/utils/react-utils";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { Wrapper } from "./styles";

export const Button = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  const htmlProps = useUnknownPropsStripper(props);
  return (
    <Wrapper
      {...htmlProps}
      $highlighted={props.highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

