import { HTMLAttributes, ReactNode } from "react";
import { useInputs } from "./inputs";

export type Position = 'left' | 'right' | 'top' | 'bottom';

export type Props = {
  menuContent: ReactNode,
  mainContent: ReactNode,
  edgeThreshold?: number,
  show: boolean,
  onShow: (show: boolean) => void,
  position: Position,
  size: number,
} & HTMLAttributes<HTMLElement>;

export const defaultProps: Partial<Props> = {
  edgeThreshold: 25,
  position: 'left',
};

export type Inputs = ReturnType<typeof useInputs>;
