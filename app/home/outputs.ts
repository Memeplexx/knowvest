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
        historyExpanded: !store.home.historyExpanded.$state,
      });
    },
    onClickSimilarToggle: () => {
      store.home.$patch({
        ...initialState.home,
        similarExpanded: !store.home.similarExpanded.$state,
      });
    },
    onClickTagsToggle: () => {
      store.home.$patch({
        ...initialState.home,
        tagsExpanded: !store.home.tagsExpanded.$state,
      });
    },
    onClickHeaderToggle: () => {
      store.home.headerExpanded.$toggle();
    },
    onClickRelatedNote: async (noteId: NoteId) => {
      await shared.onSelectNote(noteId);
      similarExpanded && store.home.similarExpanded.$set(false);
    },
    onClickHistoricalNote: async (noteId: NoteId) => {
      await shared.onSelectNote(noteId);
      historyExpanded && store.home.historyExpanded.$set(false);
    },
  }
};