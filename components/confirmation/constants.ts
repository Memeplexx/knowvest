import { ReactNode } from "react";
import { useHooks } from "./hooks";

export interface Props {
  show: boolean;
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
}

export type State = ReturnType<typeof useHooks>;

export type Selection = 'none' | 'confirm' | 'cancel';
