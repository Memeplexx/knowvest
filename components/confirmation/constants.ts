import { ReactNode } from "react";
import { useInputs } from "./inputs";

export interface Props {
  show: boolean;
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
}

export type Inputs = ReturnType<typeof useInputs>;

export type Selection = 'none' | 'confirm' | 'cancel';
