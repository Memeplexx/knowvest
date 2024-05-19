import { SynonymId, GroupId } from "@/actions/types";
import { Inputs } from "./constants";


export const useOutputs = (inputs: Inputs) => {
  const { store, groupsWithSynonyms, tagsForActiveNote } = inputs;
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
      void store.synonymIds.$pushMany(synonymIds);
    },
    onChangeAllActiveTagsSelected: () => {
      const synonymIds = tagsForActiveNote.map(s => s.synonymId);
      if (tagsForActiveNote.some(s => s.selected))
        return store.synonymIds.$filter.$in(synonymIds).$delete();
      void store.synonymIds.$pushMany(synonymIds);
    },
    onShowDialog: () => {
      void store.$local.configure.$set(true);
    },
    onHideDialog: () => {
      if (!store.$local.$state.configure) 
        return;
      store.$local.configure.$set(false);
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      store.$local.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.$local.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
  };
}
