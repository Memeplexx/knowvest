import { GroupId, SynonymId } from "@/server/dtos";
import { useInputs } from "./inputs";

export type Inputs = ReturnType<typeof useInputs>;

export const initialState = {
  tagsComponent: {
    showConfigDialog: false,
  }
}

export const initialTransientState = {
  hoveringGroupId: null as null | GroupId,
  hoveringSynonymId: null as null | SynonymId,
};
