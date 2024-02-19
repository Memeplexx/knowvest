import { SynonymId, GroupId } from "@/actions/types";
import { Inputs } from "./constants";

export const onSelectSynonym = (inputs: Inputs, synonymId: SynonymId) => {
  const { store } = inputs;
  if (inputs.selectedSynonymIds.includes(synonymId)) {
    store.search.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    store.search.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (inputs: Inputs, groupId: GroupId) => {
  const { store } = inputs;
  if (inputs.selectedGroupIds.includes(groupId)) {
    store.search.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    store.search.selectedGroupIds.$push(groupId);
  }
}
