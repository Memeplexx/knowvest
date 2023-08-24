import { GroupId, SynonymId } from "@/server/dtos";
import { State } from "./constants";
import { store } from "@/utils/store";

export const onSelectSynonym = (hooks: State, synonymId: SynonymId) => {
  const { state } = hooks;
  if (state.selectedSynonymIds.includes(synonymId)) {
    store.search.selectedSynonymIds.$find.$eq(synonymId).$delete();
  } else {
    store.search.selectedSynonymIds.$push(synonymId);
  }
}

export const onSelectGroup = (hooks: State, groupId: GroupId) => {
  const { state } = hooks;
  if (state.selectedGroupIds.includes(groupId)) {
    store.search.selectedGroupIds.$find.$eq(groupId).$delete();
  } else {
    store.search.selectedGroupIds.$push(groupId);
  }
}
