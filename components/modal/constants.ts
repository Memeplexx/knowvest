import { MouseEvent, ReactNode } from "react";
import { useInputs } from "./inputs";

export type Props = {
  showIf?: boolean;
  onClose?: () => void;
  onBackdropClick?: (event: MouseEvent) => void;
  children: ReactNode | undefined,
};

export type Inputs = ReturnType<typeof useInputs>;

export const animationDuration = 200;