import { ForwardedRef, forwardRef } from "react";
import { Wrapper } from "./styles";
import { Props } from "./constants";

export const Button = forwardRef(function Button(
  props: Props,
  ref?: ForwardedRef<HTMLButtonElement>
) {
  return (
    <Wrapper
      showIf={props.showIf}
      $highlighted={props.highlighted}
      ref={ref}
      children={props.children}
    />
  )
});

