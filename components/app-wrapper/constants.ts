import { useInputs } from "./inputs";

export const initialState = {
  showDrawer: false,
}

export type Inputs = ReturnType<typeof useInputs>;
