import { GroupId, NoteId, SynonymId } from "@/server/dtos";
import { State } from "./constants";
import { onSelectGroup, onSelectSynonym } from "./functions";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { ancestorMatches } from "@/utils/functions";

export const useEvents = (state: State) => ({
  onClickDocument: useEventHandlerForDocument('click', event => {
    if (!state.props.show) {
      return;
    }
    if ((event.target as HTMLElement).parentNode === null) { // element was removed from the DOM
      return;
    }
    if (ancestorMatches(event.target, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
      return;
    }
    if (state.showAutocompleteOptions) {
      return state.store.showAutocompleteOptions.$set(false);
    }
    if (state.bodyRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    state.props.onHide();
  }),
  onAutocompleteSelected: (value: string | null) => {
    state.autocompleteText && state.store.autocompleteText.$set('');
    const selection = state.autocompleteOptions.findOrThrow(o => o.value === value);
    if (selection.type === 'synonym') {
      onSelectSynonym(state, selection.id as SynonymId);
    } else if (selection.type === 'group') {
      onSelectGroup(state, selection.id as GroupId);
    }
  },
  onAutocompleteInputChange: (value: string) => {
    state.store.autocompleteText.$set(value);
  },
  onClickSelectedSynonym: (synonymId: SynonymId) => {
    onSelectSynonym(state, synonymId);
  },
  onClickSelectedGroup: (groupId: GroupId) => {
    onSelectGroup(state, groupId);
  },
  onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
    state.store.hoveredSynonymId.$set(hoveredSynonymId);
  },
  onMouseOutSelectedSynonym: () => {
    state.store.hoveredSynonymId.$set(null);
  },
  onClickResult: (noteId: NoteId) => {
    state.appStore.activeNoteId.$set(noteId);
    const tagIds = state.appStore.noteTags.$state.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
    const synonymIds = state.appStore.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    state.appStore.synonymIds.$set(synonymIds);
    state.props.onHide();
  },
  onAutocompleteShowOptionsChange: (showAutocompleteOptions: boolean) => {
    state.store.showAutocompleteOptions.$set(showAutocompleteOptions);
  },
  onAutocompleteInputFocused: () => {
    state.store.showAutocompleteOptions.$set(true);
  },
  onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
    if (event.key !== 'Escape') { return; }
    if (state.showAutocompleteOptions) {
      return state.store.showAutocompleteOptions.$set(false);
    }
    state.props.onHide();
  }),
  onClickTabButton: () => {
    if (state.showingTab === 'search') {
      state.store.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
    } else if (state.showingTab === 'results') {
      state.store.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
    }
  },
})