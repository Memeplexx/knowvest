import { MouseEvent, ReactNode } from "react";
import { useInputs } from "./inputs";

export type Props = {
  show?: boolean;
  onCloseComplete?: () => void;
  onBackdropClick?: (event: MouseEvent) => void;
  children: ReactNode | undefined,
};

export type Inputs = ReturnType<typeof useInputs>;

export const animationDuration = 200;