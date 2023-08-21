import React, { ForwardedRef, forwardRef } from "react";
import { Wrapper } from "./styles";
import { Props } from "./constants";

export const Button = forwardRef(function Button(
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

