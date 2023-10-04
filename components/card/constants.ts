import { HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type CardProps = {
  title?: string,
  actions?: JSX.Element,
  body: JSX.Element,
  loading?: boolean,
} & HTMLAttributes<HTMLElement>;

export type CardHandle = {
  scrollToTop: () => void;
};

export type Inputs = ReturnType<typeof useInputs>;