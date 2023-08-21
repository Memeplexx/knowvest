import { HTMLAttributes } from "react";
import { useHooks } from "./hooks";

export type CardProps = {
  title?: string,
  actions?: JSX.Element,
  $themeType: 'light' | 'dark',
  body: JSX.Element,
} & HTMLAttributes<HTMLElement>;

export type State = ReturnType<typeof useHooks>;