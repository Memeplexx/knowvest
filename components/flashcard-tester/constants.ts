import { useInputs } from "./inputs";

export const initialState = {
  showOptions: false,
  showSearchDialog: false,
  showFlashCardsDialog: false,
  showQuestions: true,
};

export type Inputs = ReturnType<typeof useInputs>;