import { GroupId, SynonymId } from "@/server/dtos";
import { State } from "./constants";
import { store } from "@/utils/store";

export const onSelectSynonym = (state: State, synonymId: SynonymId) => {
  if (state.selectedSynonymIds.includes(synonymId)) {
    store.search.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    store.search.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (state: State, groupId: GroupId) => {
  if (state.selectedGroupIds.includes(groupId)) {
    store.search.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    store.search.selectedGroupIds.$push(groupId);
  }
}
