import { GroupId, SynonymId } from "@/server/dtos";
import { useHooks } from "./hooks";

export type State = ReturnType<typeof useHooks>;

export const tagsPanelInitialState = {
  showConfigDialog: false,
  hoveringGroupId: null as null | GroupId,
  hoveringSynonymId: null as null | SynonymId,
}
