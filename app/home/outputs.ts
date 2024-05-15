import { NoteId } from "@/actions/types";
import { State } from "./constants";
import { useSharedFunctions } from "./shared";
import { initialState } from './constants';

export const useOutputs = (inputs: State) => {
  const { store, similarExpanded, historyExpanded, tagsExpanded, localStore, headerExpanded } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      localStore.$patch({
        ...initialState.home,
        headerExpanded: headerExpanded,
        historyExpanded: !historyExpanded,
      });
    },
    onClickSimilarToggle: () => {
      localStore.$patch({
        ...initialState.home,
        headerExpanded,
        similarExpanded: !similarExpanded,
      });
    },
    onClickTagsToggle: () => {
      localStore.$patch({
        ...initialState.home,
        headerExpanded,
        tagsExpanded: !tagsExpanded,
      });
    },
    onClickHeaderToggle: () => {
      localStore.$patch({
        ...initialState.home,
        headerExpanded: !headerExpanded,
      });
    },
    onClickRelatedNote: async (noteId: NoteId) => {
      similarExpanded && store.home.similarExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      historyExpanded && store.home.historyExpanded.$set(false);
      await shared.onSelectNote(noteId);
    },
    onSelectTab: (tab: string) => {
      localStore.selectedTab.$set(tab);
    },
  }
};