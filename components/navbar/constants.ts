import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement>;

export const initialState = {
  showOptions: false,
  showSearchDialog: false,
  showFlashCardsDialog: false,
};

export type Inputs = ReturnType<typeof useInputs>;

export const tag = 'navbarComponent';