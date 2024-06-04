import { Store } from "olik";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";

export const initialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  loadingSelection: false,
  stage: 'pristine' as 'pristine' | 'done',
};

export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export type ActivePanelStore = Store<typeof initialState>;
