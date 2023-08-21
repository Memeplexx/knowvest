import { ForwardedRef, forwardRef } from "react";
import { Props } from "./constants";
import { Wrapper } from "./styles";

export const IconButton = forwardRef(function Button(
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

