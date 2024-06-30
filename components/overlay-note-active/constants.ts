import { useInputs } from "./inputs";

export type Inputs = ReturnType<typeof useInputs>;

export const initialState = {
  showConfirmDeleteDialog: false
}
