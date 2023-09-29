import { useInputs } from "./inputs";

export const activePanelInitialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  loadingSelection: false,
  loadingNote: false,
  editorHasText: false,
};

export type Inputs = ReturnType<typeof useInputs>;

