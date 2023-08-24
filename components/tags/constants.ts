import { GroupId, SynonymId } from "@/server/dtos";
import { useInputs } from "./inputs";

export type Inputs = ReturnType<typeof useInputs>;

export const tagsPanelInitialState = {
  showConfigDialog: false,
  hoveringGroupId: null as null | GroupId,
  hoveringSynonymId: null as null | SynonymId,
}
