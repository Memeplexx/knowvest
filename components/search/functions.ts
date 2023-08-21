import { GroupId, SynonymId } from "@/server/dtos";
import { State } from "./constants";

export const onSelectSynonym = (state: State, synonymId: SynonymId) => {
  if (state.selectedSynonymIds.includes(synonymId)) {
    state.store.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    state.store.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (state: State, groupId: GroupId) => {
  if (state.selectedGroupIds.includes(groupId)) {
    state.store.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    state.store.selectedGroupIds.$push(groupId);
  }
}
