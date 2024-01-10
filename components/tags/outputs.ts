import { GroupId, SynonymId } from "@/server/dtos";
import { Inputs } from "./constants";


export const useOutputs = ({ store, groupsWithSynonyms, tagsForActiveNote }: Inputs) => {
  return {
    onClickSynonym: (synonymId: SynonymId) => () => {
      if (store.$state.synonymIds.includes(synonymId)) {
        store.synonymIds.$filter.$eq(synonymId).$delete();
      } else {
        store.synonymIds.$push(synonymId);
      }
    },
    onChangeAllGroupTagsSelected: (groupId: GroupId) => () => {
      const synonyms = groupsWithSynonyms
        .findOrThrow(g => g.groupId === groupId).synonyms;
      const synonymIds = synonyms.map(s => s.id);
      if (synonyms.some(s => s.selected)) {
        store.synonymIds.$filter.$in(synonymIds).$delete();
      } else {
        store.synonymIds.$push(synonymIds);
      }
    },
    onChangeAllActiveTagsSelected: () => {
      const synonymIds = tagsForActiveNote.map(s => s.synonymId);
      if (tagsForActiveNote.some(s => s.selected)) {
        store.synonymIds.$filter.$in(synonymIds).$delete();
      } else {
        store.synonymIds.$push(synonymIds);
      }
    },
    onShowDialog: () => {
      store.tagsComponent.showConfigDialog.$set(true);
    },
    onHideDialog: () => {
      store.tagsComponent.showConfigDialog.$set(false);
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => () => {
      store.tagsComponent.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.tagsComponent.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
  };
}
