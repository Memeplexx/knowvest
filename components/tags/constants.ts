import { GroupId, SynonymId } from "@/actions/types";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";

export type Inputs = ReturnType<typeof useInputs>;

export type Outputs = ReturnType<typeof useOutputs>;

export type FragmentProps = { inputs: Inputs, outputs: Outputs };

export const initialState = {
  showConfigDialog: false,
  hoveringGroupId: null as null | GroupId,
  hoveringSynonymId: null as null | SynonymId,
}
