import { HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = {
  heading?: string | JSX.Element,
  actions?: () => JSX.Element,
  body: JSX.Element | null,
  loading?: boolean,
  onScrolledToBottom?: () => void,
} & HTMLAttributes<HTMLElement>;

export type CardHandle = {
  scrollToTop: () => void;
};

export type Inputs = ReturnType<typeof useInputs>;