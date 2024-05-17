import { SynonymId, GroupId } from "@/actions/types";
import { Inputs } from "./constants";

export const onSelectSynonym = (inputs: Inputs, synonymId: SynonymId) => {
  const { store } = inputs;
  if (inputs.selectedSynonymIds.includes(synonymId)) {
    store.$local.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    store.$local.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (inputs: Inputs, groupId: GroupId) => {
  const { store } = inputs;
  if (inputs.selectedGroupIds.includes(groupId)) {
    store.$local.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    store.$local.selectedGroupIds.$push(groupId);
  }
}
