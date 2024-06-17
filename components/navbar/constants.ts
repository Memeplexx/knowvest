import { type HTMLAttributes } from "react";
import { IfProps } from "../html";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement> & IfProps;

export const initialState = {
  showOptions: false,
  showFlashCardsDialog: false,
};

export type Inputs = ReturnType<typeof useInputs>;
