import { NoteId } from "@/actions/types";
import { State } from "./constants";
import { useSharedFunctions } from "./shared";
import { initialState } from './constants';

export const useOutputs = (inputs: State) => {
  const { store, similarExpanded, historyExpanded } = inputs;
  const shared = useSharedFunctions(inputs);
  return {
    onClickHistoryToggle: () => {
      store.home.$patch({
        ...initialState.home,
        headerExpanded: store.home.headerExpanded.$state,
        historyExpanded: !store.home.historyExpanded.$state,
      });
    },
    onClickSimilarToggle: () => {
      store.home.$patch({
        ...initialState.home,
        headerExpanded: store.home.headerExpanded.$state,
        similarExpanded: !store.home.similarExpanded.$state,
      });
    },
    onClickTagsToggle: () => {
      store.home.$patch({
        ...initialState.home,
        headerExpanded: store.home.headerExpanded.$state,
        tagsExpanded: !store.home.tagsExpanded.$state,
      });
    },
    onClickHeaderToggle: () => {
      store.home.$patch({
        ...initialState.home,
        headerExpanded: !store.home.headerExpanded.$state,
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
  }
};