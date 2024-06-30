import { ReactNode } from "react";
import { useInputs } from "./inputs";

export interface Props {
  if: boolean;
  title?: ReactNode;
  message?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
  storeKey: string,
}

export type Inputs = ReturnType<typeof useInputs>;

export type Selection = 'none' | 'confirm' | 'cancel';

export const initialState = {
  selection: 'none' as Selection
};
