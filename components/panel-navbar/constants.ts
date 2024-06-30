import { useInputs } from "./inputs";


export const initialState = {
  showOptions: false,
};

export type Inputs = ReturnType<typeof useInputs>;
