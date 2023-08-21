import { State } from "./constants";

export const useEvents = (state: State) => ({
  onClickHistoryToggle: () => {
    state.store.$patch({
      tagsExpanded: false,
      similarExpanded: false,
      historyExpanded: !state.store.historyExpanded.$state,
    });
  },
  onClickSimilarToggle: () => {
    state.store.$patch({
      tagsExpanded: false,
      historyExpanded: false,
      similarExpanded: !state.store.similarExpanded.$state,
    });
  },
  onClickTagsToggle: () => {
    state.store.$patch({
      historyExpanded: false,
      similarExpanded: false,
      tagsExpanded: !state.store.tagsExpanded.$state,
    });
  },
  onClickHeaderToggle: () => {
    state.store.headerExpanded.$toggle();
  },
  onClickRelatedNote: () => {
    state.similarExpanded && state.store.similarExpanded.$set(false);
  },
  onClickHistoricalNote: () => {
    state.historyExpanded && state.store.historyExpanded.$set(false);
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