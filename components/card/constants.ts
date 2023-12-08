import { HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type CardProps = {
  heading?: string | JSX.Element,
  actions?: () => JSX.Element,
  body: JSX.Element,
  loading?: boolean,
} & HTMLAttributes<HTMLElement>;

export type CardHandle = {
  scrollToTop: () => void;
};

export type Inputs = ReturnType<typeof useInputs>;