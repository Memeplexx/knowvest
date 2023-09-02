import { State } from "./constants";

export const useOutputs = (state: State) => ({
  onClickHistoryToggle: () => {
    state.store.home.$patch({
      tagsExpanded: false,
      similarExpanded: false,
      historyExpanded: !state.store.home.historyExpanded.$state,
    });
  },
  onClickSimilarToggle: () => {
    state.store.home.$patch({
      tagsExpanded: false,
      historyExpanded: false,
      similarExpanded: !state.store.home.similarExpanded.$state,
    });
  },
  onClickTagsToggle: () => {
    state.store.home.$patch({
      historyExpanded: false,
      similarExpanded: false,
      tagsExpanded: !state.store.home.tagsExpanded.$state,
    });
  },
  onClickHeaderToggle: () => {
    state.store.home.headerContracted.$toggle();
  },
  onClickRelatedNote: () => {
    state.similarExpanded && state.store.home.similarExpanded.$set(false);
  },
  onClickHistoricalNote: () => {
    state.historyExpanded && state.store.home.historyExpanded.$set(false);
  },
  onNotifyError: (message: string) => {
    state.set({
      message,
      status: 'error',
    });
  },
  onNotifySuccess: (message: string) => {
    state.set({
      message,
      status: 'success',
    });
  },
  onNotifyInfo: (message: string) => {
    state.set({
      message,
      status: 'info',
    });
  },
  onMessageClear: () => {
    state.set({ message: '' });
  }
});