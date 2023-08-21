import { GroupId, SynonymId } from "@/server/dtos";
import { State } from "./constants";


export const useEvents = (state: State) => ({
  onClickSynonym: (synonymId: SynonymId) => {
    if (state.appStore.$state.synonymIds.includes(synonymId)) {
      state.appStore.synonymIds.$filter.$eq(synonymId).$delete();
    } else {
      state.appStore.synonymIds.$push(synonymId);
    }
  },
  onChangeAllGroupTagsSelected: (groupId: GroupId) => {
    const synonyms = state.groupsWithSynonyms
      .findOrThrow(g => g.groupId === groupId).synonyms;
    if (synonyms.some(s => s.selected)) {
      state.appStore.synonymIds.$filter.$in(synonyms.map(s => s.id)).$delete();
    } else {
      state.appStore.synonymIds.$push(synonyms.map(s => s.id));
    }
  },
  onChangeAllActiveTagsSelected: () => {
    if (state.tagsForActiveNote.some(s => s.selected)) {
      state.appStore.synonymIds.$filter.$in(state.tagsForActiveNote.map(s => s.synonymId)).$delete();
    } else {
      state.appStore.synonymIds.$push(state.tagsForActiveNote.map(s => s.synonymId));
    }
  },
  onShowDialog: () => {
    state.store.showConfigDialog.$set(true);
  },
  onHideDialog: () => {
    state.store.showConfigDialog.$set(false);
  },
  onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
    state.store.$patch({ hoveringGroupId, hoveringSynonymId });
  },
  onMouseOutGroupTag: () => {
    state.store.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
  },
});
