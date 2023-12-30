import { MouseEventHandler, ReactNode, Ref } from "react";
import { useInputs } from "./inputs";

export type Props = {
  trigger: (args: { ref?: Ref<HTMLButtonElement>, onClick: MouseEventHandler<HTMLElement> }) => ReactNode,
  overlay: ReactNode,
};

export type Inputs = ReturnType<typeof useInputs>;

export const animationDuration = 200;

export type PopupHandle = {
  hide: () => void;
};