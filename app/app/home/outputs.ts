import { NoteId } from "@/actions/types";
import { Inputs, initialState } from "./constants";
import { useSharedFunctions } from "./shared";

export const useOutputs = (inputs: Inputs) => {
  const { store, local } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      local.$patch({
        ...initialState,
        historyExpanded: !local.$state.historyExpanded,
      });
    },
    onClickSimilarToggle: () => {
      local.$patch({
        ...initialState,
        similarExpanded: !local.$state.similarExpanded,
      });
    },
    onClickTagsToggle: () => {
      local.$patch({
        ...initialState,
        tagsExpanded: !local.$state.tagsExpanded,
      });
    },
    onClickHeaderToggle: () => {
      store.headerExpanded.$toggle();
    },
    onClickRelatedNote: async (noteId: NoteId) => {
      if (local.$state.similarExpanded)
        local.similarExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      if (local.$state.historyExpanded)
        local.historyExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onSelectTab: (tab: string) => {
      local.selectedTab.$set(tab);
    },
  }
};