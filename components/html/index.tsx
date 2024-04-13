"use client";
import { TypedKeyboardEvent } from "@/utils/dom-utils";
import { ButtonHTMLAttributes, ComponentType, ForwardedRef, Fragment, HTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, forwardRef } from "react";


type ReplaceKeyboardEvents<E extends HTMLElement, A extends HTMLAttributes<E>> = {
  [key in keyof A]: 
    key extends ('onKeyUp' | 'onKeyDown') ? (e: TypedKeyboardEvent<E>) => void 
    : A[key]
};

export type IfProps = { if?: boolean };

export type ButtonProps = ReplaceKeyboardEvents<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>;

export type InputProps = ReplaceKeyboardEvents<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>;

export type TextAreaProps = ReplaceKeyboardEvents<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>;

export type DivProps = ReplaceKeyboardEvents<HTMLDivElement, HTMLAttributes<HTMLDivElement>>;

export type SpanProps = ReplaceKeyboardEvents<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>;

export type ElementProps = ReplaceKeyboardEvents<HTMLElement, HTMLAttributes<HTMLElement>>;

const stripUnKnownProps = function <P extends { children?: ReactNode } & IfProps>(props: P) {
  return Object.keysTyped(props)
    .reduce((acc, key) => { if (key !== 'if' && key !== 'children') { acc[key] = props[key]; } return acc; }, {} as P);
}

export const possible = {
  div: forwardRef(function Div(
    props: DivProps & IfProps,
    ref?: ForwardedRef<HTMLDivElement>,
  ) {
    if (props.if === false) return null;
    return <div ref={ref} {...stripUnKnownProps(props)}>{props.children}</div>;
  }),
  span: forwardRef(function Span(
    props: SpanProps & IfProps,
    ref?: ForwardedRef<HTMLSpanElement>,
  ) {
    if (props.if === false) return null;
    return <span ref={ref} {...stripUnKnownProps(props)}>{props.children}</span>;
  }),
  input: forwardRef(function Input(
    props: InputProps & IfProps,
    ref?: ForwardedRef<HTMLInputElement>
  ) {
    if (props.if === false) return null;
    return <input ref={ref} {...stripUnKnownProps(props)}>{props.children}</input>;
  }),
  textarea: forwardRef(function TextArea(
    props: TextAreaProps & IfProps,
    ref?: ForwardedRef<HTMLTextAreaElement>
  ) {
    if (props.if === false) return null;
    return <textarea ref={ref} {...stripUnKnownProps(props)}>{props.children}</textarea>;
  }),
  button: forwardRef(function Button(
    props: ButtonProps & IfProps,
    ref?: ForwardedRef<HTMLButtonElement>
  ) {
    if (props.if === false) return null;
    return <button ref={ref} {...stripUnKnownProps(props)}>{props.children}</button>;
  }),
  element: function Element<P>(ComponentType: ComponentType<P>) {
    return forwardRef(function Element(
      props: P & { children?: React.ReactNode } & IfProps,
      ref?: ForwardedRef<HTMLElement>
    ) {
      if (props.if === false) return null;
      return <ComponentType ref={ref} {...stripUnKnownProps(props)}>{props.children}</ComponentType>;
    });
  },
}

export const Frag = (props: { if?: boolean, children?: ReactNode }) => {
  return props.if === false ? null : <Fragment children={props.children} />
}

export const RenderedList = function <T>(
  props: { list: T[], item: (item: T, index: number) => JSX.Element } & IfProps,
) {
  if (props.if === false) return null;
  return (
    <>
      {props.list.map((it, index) => props.item(it, index))}
    </>
  )
};

export const RenderedListInDiv = forwardRef(function RenderList<T>(
  props: HTMLAttributes<HTMLDivElement> & IfProps & { list: T[], item: (item: T, index: number) => JSX.Element },
  ref?: ForwardedRef<HTMLDivElement>,
) {
  if (props.if === false) return null;
  return (
    <div ref={ref} data-testid={props.className} {...stripUnKnownProps(props)}>
      {props.list.map((it, index) => props.item(it, index))}
    </div>
  )
})