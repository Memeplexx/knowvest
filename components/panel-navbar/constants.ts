import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement>;

export const initialState = {
  showOptions: false,
};

export type Inputs = ReturnType<typeof useInputs>;