import { GroupId, SynonymId } from "@/server/dtos";
import { Inputs } from "./constants";
import { store } from "@/utils/store";

export const onSelectSynonym = (inputs: Inputs, synonymId: SynonymId) => {
  const { state } = inputs;
  if (state.selectedSynonymIds.includes(synonymId)) {
    store.search.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    store.search.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (inputs: Inputs, groupId: GroupId) => {
  const { state } = inputs;
  if (state.selectedGroupIds.includes(groupId)) {
    store.search.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    store.search.selectedGroupIds.$push(groupId);
  }
}
