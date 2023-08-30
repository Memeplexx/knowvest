import { HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type CardProps = {
  title?: string,
  actions?: JSX.Element,
  body: JSX.Element,
} & HTMLAttributes<HTMLElement>;

export type Inputs = ReturnType<typeof useInputs>;