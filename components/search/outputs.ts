import { GroupId, NoteId, SynonymId } from "@/actions/types";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { Inputs, Props } from "./constants";
import { onSelectGroup, onSelectSynonym } from "./shared";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { store, localStore } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.target.parentNode === null) // element was removed from the DOM
        return;
      if (event.target.hasAncestorWithTagNames('BUTTON', 'INPUT'))
        return;
      if (inputs.showAutocompleteOptions)
        return localStore.showAutocompleteOptions.$set(false);
      if (inputs.bodyRef.current?.contains(event.target))
        return;
      props.onHide();
    }),
    onAutocompleteSelected: (value: string | null) => {
      inputs.autocompleteText && localStore.autocompleteText.$set('');
      const selection = inputs.autocompleteOptions.findOrThrow(o => o.value === value);
      if (selection.type === 'synonym')
        return onSelectSynonym(inputs, selection.id as SynonymId);
      if (selection.type === 'group')
        return onSelectGroup(inputs, selection.id as GroupId);
    },
    onAutocompleteInputChange: (value: string) => {
      localStore.autocompleteText.$set(value);
    },
    onClickSelectedSynonym: (synonymId: SynonymId) => {
      onSelectSynonym(inputs, synonymId);
    },
    onClickSelectedGroup: (groupId: GroupId) => {
      onSelectGroup(inputs, groupId);
    },
    onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
      localStore.hoveredSynonymId.$set(hoveredSynonymId);
    },
    onMouseOutSelectedSynonym: () => {
      localStore.hoveredSynonymId.$set(null);
    },
    onClickResult: (noteId: NoteId) => {
      const tagIds = store.noteTags.$filter.noteId.$eq(noteId).tagId;
      const synonymIds = store.tags.$filter.id.$in(tagIds).synonymId;
      store.activeNoteId.$set(noteId);
      store.synonymIds.$setUnique(synonymIds);
      props.onHide();
    },
    onAutocompleteShowOptionsChange: (showAutocompleteOptions: boolean) => {
      store.search.showAutocompleteOptions.$set(showAutocompleteOptions);
    },
    onAutocompleteInputFocused: () => {
      store.search.showAutocompleteOptions.$set(true);
    },
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape') 
        return;
      if (inputs.showAutocompleteOptions)
        return localStore.showAutocompleteOptions.$set(false);
      props.onHide();
    }),
    onClickTabButton: () => {
      if (inputs.showingTab === 'search')
        return localStore.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
      if (inputs.showingTab === 'results')
        return localStore.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
    },
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}