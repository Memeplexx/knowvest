"use client";
import { TypedKeyboardEvent } from "@/utils/dom-utils";
import { ButtonHTMLAttributes, ForwardedRef, Fragment, HTMLAttributes, InputHTMLAttributes, ReactNode, forwardRef } from "react";


type ReplaceKeyboardEvents<E extends HTMLElement, A extends HTMLAttributes<E>> = {
  [key in keyof A]: 
    key extends ('onKeyUp' | 'onKeyDown') ? (e: TypedKeyboardEvent<E>) => void 
    : A[key]
};

export type ButtonProps = ReplaceKeyboardEvents<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>;

export type InputProps = ReplaceKeyboardEvents<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>;

export type DivProps = ReplaceKeyboardEvents<HTMLDivElement, HTMLAttributes<HTMLDivElement>>;

export const possible = {
  div: forwardRef(function Div(
    { children, showIf, ...props }: DivProps,
    ref?: ForwardedRef<HTMLDivElement>,
  ) {
    return showIf === false ? null : <div ref={ref} data-testid={props.className} {...props}>{children}</div>;
  }),
  input: forwardRef(function Input(
    { children, showIf, ...props }: InputProps,
    ref?: ForwardedRef<HTMLInputElement>
  ) {
    return showIf === false ? null : <input ref={ref} data-testid={props.className} {...props}>{children}</input>;
  }),
  button: forwardRef(function Button(
    { children, showIf, ...props }: ButtonProps,
    ref?: ForwardedRef<HTMLButtonElement>
  ) {
    return showIf === false ? null : <button ref={ref} data-testid={props.className} {...props}>{children}</button>;
  }),
  fragment: ({ showIf, children }: { showIf: boolean, children?: ReactNode }) => {
    return showIf === false ? null : <Fragment children={children} />
  }
}

export const RenderedList = function <T>(
  { showIf, list, item }: { list: T[], item: (item: T, index: number) => JSX.Element } & { showIf?: boolean },
) {
  return showIf === false ? null : (
    <>
      {list.map((it, index) => item(it, index))}
    </>
  )
};

export const RenderedListInDiv = forwardRef(function RenderList<T>(
  { showIf, list, item, ...props }: HTMLAttributes<HTMLDivElement> & { list: T[], item: (item: T, index: number) => JSX.Element },
  ref?: ForwardedRef<HTMLDivElement>,
) {
  return showIf === false ? null : (
    <div ref={ref} data-testid={props.className} {...props}>
      {list.map((it, index) => item(it, index))}
    </div>
  )
})
