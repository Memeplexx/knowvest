import { NoteId } from "@/actions/types";
import { Inputs } from "./constants";
import { useSharedFunctions } from "./shared";
import { initialState } from './constants';

export const useOutputs = (inputs: Inputs) => {
  const { local, similarExpanded, historyExpanded, tagsExpanded, headerExpanded } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      local.$patch({
        ...initialState,
        headerExpanded: headerExpanded,
        historyExpanded: !historyExpanded,
      });
    },
    onClickSimilarToggle: () => {
      local.$patch({
        ...initialState,
        headerExpanded,
        similarExpanded: !similarExpanded,
      });
    },
    onClickTagsToggle: () => {
      local.$patch({
        ...initialState,
        headerExpanded,
        tagsExpanded: !tagsExpanded,
      });
    },
    onClickHeaderToggle: () => {
      local.$patch({
        ...initialState,
        headerExpanded: !headerExpanded,
      });
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