import { useInputs } from "./inputs";

export const initialState = {
  showConfirmDeleteDialog: false,
  showConfirmDeleteFlashCardDialog: false,
};

export type Inputs = ReturnType<typeof useInputs>;
