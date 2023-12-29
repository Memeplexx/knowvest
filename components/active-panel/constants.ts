import { useInputs } from "./inputs";

export const initialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  loadingSelection: false,
  loadingNote: false,
  editorHasText: false,
};

export type Inputs = ReturnType<typeof useInputs>;

export const tag = 'activePanel';

