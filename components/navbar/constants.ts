import { type HTMLAttributes } from "react";
import { useInputs } from "./inputs";

export type Props = HTMLAttributes<HTMLDivElement>;

export const initialState = {
  navBar: {
    showOptions: false,
    showDialog: false,
    flashCardCount: 0,
  }
};

export type Inputs = ReturnType<typeof useInputs>;