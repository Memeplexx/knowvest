import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Store } from "olik";

export const initialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  loadingSelection: false,
  loadingNote: false,
  editorHasText: false,
};

export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export type ActivePanelStore = Store<typeof initialState>;
