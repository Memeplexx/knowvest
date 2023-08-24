import { GroupId, SynonymId } from "@/server/dtos";
import { Inputs } from "./constants";
import { store } from "@/utils/store";


export const useOutputs = (inputs: Inputs) => {
  const { state } = inputs;
  return {
    onClickSynonym: (synonymId: SynonymId) => {
      if (store.$state.synonymIds.includes(synonymId)) {
        store.synonymIds.$filter.$eq(synonymId).$delete();
      } else {
        store.synonymIds.$push(synonymId);
      }
    },
    onChangeAllGroupTagsSelected: (groupId: GroupId) => {
      const synonyms = state.groupsWithSynonyms
        .findOrThrow(g => g.groupId === groupId).synonyms;
      if (synonyms.some(s => s.selected)) {
        store.synonymIds.$filter.$in(synonyms.map(s => s.id)).$delete();
      } else {
        store.synonymIds.$push(synonyms.map(s => s.id));
      }
    },
    onChangeAllActiveTagsSelected: () => {
      if (state.tagsForActiveNote.some(s => s.selected)) {
        store.synonymIds.$filter.$in(state.tagsForActiveNote.map(s => s.synonymId)).$delete();
      } else {
        store.synonymIds.$push(state.tagsForActiveNote.map(s => s.synonymId));
      }
    },
    onShowDialog: () => {
      store.tagsPanel.showConfigDialog.$set(true);
    },
    onHideDialog: () => {
      store.tagsPanel.showConfigDialog.$set(false);
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      store.tagsPanel.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.tagsPanel.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
  };
}