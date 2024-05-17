import { NoteId } from "@/actions/types";
import { State } from "./constants";
import { useSharedFunctions } from "./shared";
import { initialState } from './constants';

export const useOutputs = (inputs: State) => {
  const { store, similarExpanded, historyExpanded, tagsExpanded, headerExpanded } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      store.$local.$patch({
        ...initialState,
        headerExpanded: headerExpanded,
        historyExpanded: !historyExpanded,
      });
    },
    onClickSimilarToggle: () => {
      store.$local.$patch({
        ...initialState,
        headerExpanded,
        similarExpanded: !similarExpanded,
      });
    },
    onClickTagsToggle: () => {
      store.$local.$patch({
        ...initialState,
        headerExpanded,
        tagsExpanded: !tagsExpanded,
      });
    },
    onClickHeaderToggle: () => {
      store.$local.$patch({
        ...initialState,
        headerExpanded: !headerExpanded,
      });
    },
    onClickRelatedNote: async (noteId: NoteId) => {
      similarExpanded && store.$local.similarExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      historyExpanded && store.$local.historyExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onSelectTab: (tab: string) => {
      store.$local.selectedTab.$set(tab);
    },
  }
};