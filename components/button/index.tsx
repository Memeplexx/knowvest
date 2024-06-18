"use client";
import { useUnknownPropsStripper } from "@/utils/react-utils";
import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { ButtonWrapper } from "./styles";

export const Button = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  const htmlProps = useUnknownPropsStripper(props);
  return (
    <ButtonWrapper
      {...htmlProps}
      $highlighted={props.highlighted ?? false}
      ref={ref}
      children={props.children}
    />
  )
});

