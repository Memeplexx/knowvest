import { NoteId } from "@/actions/types";
import { Inputs, initialState } from "./constants";
import { useSharedFunctions } from "./shared";

export const useOutputs = (inputs: Inputs) => {
  const { store, local, similarExpanded, historyExpanded, tagsExpanded } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      local.$patch({
        ...initialState,
        historyExpanded: !historyExpanded,
      });
    },
    onClickSimilarToggle: () => {
      local.$patch({
        ...initialState,
        similarExpanded: !similarExpanded,
      });
    },
    onClickTagsToggle: () => {
      local.$patch({
        ...initialState,
        tagsExpanded: !tagsExpanded,
      });
    },
    onClickHeaderToggle: () => {
      store.headerExpanded.$toggle();
    },
    onClickRelatedNote: async (noteId: NoteId) => {
      if (similarExpanded)
        local.similarExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      if (historyExpanded)
        local.historyExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onSelectTab: (tab: string) => {
      local.selectedTab.$set(tab);
    },
  }
};