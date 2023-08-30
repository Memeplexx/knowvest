import { ButtonHTMLAttributes, ForwardedRef, HTMLAttributes, forwardRef } from "react";


export const possible = {
  div: forwardRef(function Div(
    { children, showIf, ...props }: HTMLAttributes<HTMLDivElement>,
    ref?: ForwardedRef<HTMLDivElement>
  ) {
    return showIf === false ? null : <div ref={ref} {...props}>{children}</div>;
  }),
  button: forwardRef(function Button(
    { children, showIf, ...props }: ButtonHTMLAttributes<HTMLButtonElement>,
    ref?: ForwardedRef<HTMLButtonElement>
  ) {
    return showIf === false ? null : <button ref={ref} {...props}>{children}</button>;
  }),
}