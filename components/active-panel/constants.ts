import { useInputs } from "./inputs";
import { AppState } from "@/utils/store-utils";
import { useOutputs } from "./outputs";
import { ReactStoreLocal } from "olik-react";

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

export type ActivePanelStore = ReactStoreLocal<AppState, 'activePanel', typeof initialState>;
