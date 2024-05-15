import { SynonymId, GroupId } from "@/actions/types";
import { Inputs } from "./constants";


export const useOutputs = (inputs: Inputs) => {
  const { store, groupsWithSynonyms, tagsForActiveNote, localStore, showConfigDialog } = inputs;
  return {
    onClickSynonym: (synonymId: SynonymId) => {
      if (store.$state.synonymIds.includes(synonymId))
        return store.synonymIds.$filter.$eq(synonymId).$delete();
      store.synonymIds.$push(synonymId);
    },
    onChangeAllGroupTagsSelected: (groupId: GroupId) => {
      const synonyms = groupsWithSynonyms
        .findOrThrow(g => g.groupId === groupId).synonyms;
      const synonymIds = synonyms.map(s => s.id);
      if (synonyms.some(s => s.selected))
        return store.synonymIds.$filter.$in(synonymIds).$delete();
      store.synonymIds.$pushMany(synonymIds);
    },
    onChangeAllActiveTagsSelected: () => {
      const synonymIds = tagsForActiveNote.map(s => s.synonymId);
      if (tagsForActiveNote.some(s => s.selected))
        return store.synonymIds.$filter.$in(synonymIds).$delete();
      store.synonymIds.$pushMany(synonymIds);
    },
    onShowDialog: () => {
      localStore.showConfigDialog.$set(true);
    },
    onHideDialog: () => {
      if (!showConfigDialog) 
        return;
      localStore.showConfigDialog.$set(false);
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      localStore.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      localStore.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
  };
}
