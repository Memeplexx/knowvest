import { HTMLAttributes, ReactNode } from "react";
import { useInputs } from "./inputs";

export type Position = 'left' | 'right' | 'top' | 'bottom';

export type Props = {
  menuContent: ReactNode,
  mainContent: ReactNode,
  edgeThreshold: number,
  show: boolean,
  onShow: (show: boolean) => void,
  position: Position,
  size: number,
} & HTMLAttributes<HTMLElement>;


export type Inputs = ReturnType<typeof useInputs>;
