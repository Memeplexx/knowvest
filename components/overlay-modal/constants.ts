import { ReactNode } from "react";

export type Props = {
  if: boolean;
  onClose?: () => void;
  onBackdropClick?: () => void;
  children: ReactNode | undefined,
};
