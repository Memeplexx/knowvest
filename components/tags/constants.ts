import { GroupId, SynonymId } from "@/server/dtos";
import { useHooks } from "./hooks";

export type State = ReturnType<typeof useHooks>;

export const initialState = {
  tagsPanel: {
    showConfigDialog: false,
    hoveringGroupId: null as null | GroupId,
    hoveringSynonymId: null as null | SynonymId,
  },
}
