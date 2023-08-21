import { MouseEvent, ReactNode } from "react";
import { useHooks } from "./hooks";

export type Props = {
  show?: boolean;
  onCloseComplete?: () => void;
  onBackdropClick?: (event: MouseEvent) => void;
  children: ReactNode | undefined,
};

export type State = ReturnType<typeof useHooks>;

export const animationDuration = 200;