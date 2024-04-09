import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement> & { showIf?: boolean };

export const initialState = {
  navBar: {
    showOptions: false,
    showSearchDialog: false,
    showFlashCardsDialog: false,
  }
};

export type Inputs = ReturnType<typeof useInputs>;
