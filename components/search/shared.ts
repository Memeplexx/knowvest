import { GroupId, SynonymId } from "@/actions/types";
import { Inputs } from "./constants";

export const onSelectSynonym = (inputs: Inputs, synonymId: SynonymId) => {
  const { local } = inputs;
  if (inputs.selectedSynonymIds.includes(synonymId)) {
    local.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    local.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (inputs: Inputs, groupId: GroupId) => {
  const { local } = inputs;
  if (inputs.selectedGroupIds.includes(groupId)) {
    local.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    local.selectedGroupIds.$push(groupId);
  }
}
