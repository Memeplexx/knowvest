import { GroupId, NoteId, SynonymId } from "@/server/dtos";
import { State } from "./constants";
import { onSelectGroup, onSelectSynonym } from "./functions";
import { useEventHandlerForDocument } from "@/utils/hooks";
import { ancestorMatches } from "@/utils/functions";
import { store } from "@/utils/store";

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
      return store.search.showAutocompleteOptions.$set(false);
    }
    if (state.bodyRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    state.props.onHide();
  }),
  onAutocompleteSelected: (value: string | null) => {
    state.autocompleteText && store.search.autocompleteText.$set('');
    const selection = state.autocompleteOptions.findOrThrow(o => o.value === value);
    if (selection.type === 'synonym') {
      onSelectSynonym(state, selection.id as SynonymId);
    } else if (selection.type === 'group') {
      onSelectGroup(state, selection.id as GroupId);
    }
  },
  onAutocompleteInputChange: (value: string) => {
    store.search.autocompleteText.$set(value);
  },
  onClickSelectedSynonym: (synonymId: SynonymId) => {
    onSelectSynonym(state, synonymId);
  },
  onClickSelectedGroup: (groupId: GroupId) => {
    onSelectGroup(state, groupId);
  },
  onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
    store.search.hoveredSynonymId.$set(hoveredSynonymId);
  },
  onMouseOutSelectedSynonym: () => {
    store.search.hoveredSynonymId.$set(null);
  },
  onClickResult: (noteId: NoteId) => {
    store.activeNoteId.$set(noteId);
    const tagIds = store.noteTags.$state.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
    const synonymIds = store.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
    store.synonymIds.$set(synonymIds);
    state.props.onHide();
  },
  onAutocompleteShowOptionsChange: (showAutocompleteOptions: boolean) => {
    store.search.showAutocompleteOptions.$set(showAutocompleteOptions);
  },
  onAutocompleteInputFocused: () => {
    store.search.showAutocompleteOptions.$set(true);
  },
  onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
    if (event.key !== 'Escape') { return; }
    if (state.showAutocompleteOptions) {
      return store.search.showAutocompleteOptions.$set(false);
    }
    state.props.onHide();
  }),
  onClickTabButton: () => {
    if (state.showingTab === 'search') {
      store.search.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
    } else if (state.showingTab === 'results') {
      store.search.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
    }
  },
})