import { HTMLAttributes, ReactNode } from "react";
import { useInputs } from "./inputs";

export type Props = {
  heading?: ReactNode,
  body: ReactNode | null,
  onScrolledToBottom?: () => void,
} & HTMLAttributes<HTMLElement>;

export type ContainerWithStickyHeaderHandle = {
  scrollToTop: () => void;
};

export type Inputs = ReturnType<typeof useInputs>;