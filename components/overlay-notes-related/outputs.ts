import { GroupId, SynonymId } from "@/actions/types";
import { store } from "@/utils/store-utils";
import { Inputs } from "./constants";


export const useOutputs = (inputs: Inputs) => {
  const { local, groupsWithSynonyms, tagsForActiveNote } = inputs;
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
      store.configureTags.$set(true);
    },
    onHideDialog: () => {
      if (!store.$state.configureTags)
        return;
      store.configureTags.$set(false);
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      local.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      local.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
  };
}
