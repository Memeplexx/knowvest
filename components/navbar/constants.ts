import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement>;

export const navBarInitialState = {
  showOptions: false,
  showDialog: false,
};

export type Inputs = ReturnType<typeof useInputs>;