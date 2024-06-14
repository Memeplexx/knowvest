import { Store } from "olik";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";

export const initialState = {
  selection: '',
  showConfirmDeleteDialog: false,
  loadingSelection: false,
  initialized: false,
};

export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export type ActivePanelStore = Store<typeof initialState>;

