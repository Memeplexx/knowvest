import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";
import { IfProps } from "../html";

export type Props = HTMLAttributes<HTMLDivElement> & IfProps;

export const initialState = {
  showOptions: false,
  showSearchDialog: false,
  showFlashCardsDialog: false,
};

export type Inputs = ReturnType<typeof useInputs>;
