import { useInputs } from "./inputs";

export const activePanelInitialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  showOptions: false,
  loadingSelection: false,
  loadingNote: false,
};

export type Inputs = ReturnType<typeof useInputs>;

