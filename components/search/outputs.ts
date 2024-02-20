import { Inputs } from "./constants";
import { onSelectGroup, onSelectSynonym } from "./shared";
import { SynonymId, GroupId, NoteId } from "@/actions/types";
import { ancestorMatches, useEventHandlerForDocument } from "@/utils/dom-utils";

export const useOutputs = (inputs: Inputs) => {
  const { props, store } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if ((event.target as HTMLElement).parentNode === null) { // element was removed from the DOM
        return;
      }
      if (ancestorMatches(event.target, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
        return;
      }
      if (inputs.showAutocompleteOptions) {
        return store.search.showAutocompleteOptions.$set(false);
      }
      if (inputs.bodyRef.current?.contains(event.target as HTMLElement)) {
        return;
      }
      props.onHide();
    }),
    onAutocompleteSelected: (value: string | null) => {
      inputs.autocompleteText && store.search.autocompleteText.$set('');
      const selection = inputs.autocompleteOptions.findOrThrow(o => o.value === value);
      if (selection.type === 'synonym') {
        onSelectSynonym(inputs, selection.id as SynonymId);
      } else if (selection.type === 'group') {
        onSelectGroup(inputs, selection.id as GroupId);
      }
    },
    onAutocompleteInputChange: (value: string) => {
      store.search.autocompleteText.$set(value);
    },
    onClickSelectedSynonym: (synonymId: SynonymId) => {
      onSelectSynonym(inputs, synonymId);
    },
    onClickSelectedGroup: (groupId: GroupId) => {
      onSelectGroup(inputs, groupId);
    },
    onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
      store.search.hoveredSynonymId.$set(hoveredSynonymId);
    },
    onMouseOutSelectedSynonym: () => {
      store.search.hoveredSynonymId.$set(null);
    },
    onClickResult: (noteId: NoteId) => {
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      props.onHide();
    },
    onAutocompleteShowOptionsChange: (showAutocompleteOptions: boolean) => {
      store.search.showAutocompleteOptions.$set(showAutocompleteOptions);
    },
    onAutocompleteInputFocused: () => {
      store.search.showAutocompleteOptions.$set(true);
    },
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape') { return; }
      if (inputs.showAutocompleteOptions) {
        return store.search.showAutocompleteOptions.$set(false);
      }
      props.onHide();
    }),
    onClickTabButton: () => {
      if (inputs.showingTab === 'search') {
        store.search.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
      } else if (inputs.showingTab === 'results') {
        store.search.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
      }
    },
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}