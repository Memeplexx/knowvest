import { GroupId, NoteId, SynonymId } from "@/actions/types";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { Inputs, Props } from "./constants";
import { onSelectGroup, onSelectSynonym } from "./shared";

export const useOutputs = (props: Props, inputs: Inputs) => {
  const { store, local } = inputs;
  return {
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.target.parentNode === null) // element was removed from the DOM
        return;
      if (event.target.hasAncestorWithTagNames('BUTTON', 'INPUT'))
        return;
      if (inputs.showAutocompleteOptions)
        return local.showAutocompleteOptions.$set(false);
      if (inputs.bodyRef.current?.contains(event.target))
        return;
      props.onHide();
    }),
    onAutocompleteSelected: (value: string | null) => {
      inputs.autocompleteText && local.autocompleteText.$set('');
      const selection = inputs.autocompleteOptions.findOrThrow(o => o.value === value);
      if (selection.type === 'synonym')
        return onSelectSynonym(inputs, selection.id as SynonymId);
      if (selection.type === 'group')
        return onSelectGroup(inputs, selection.id as GroupId);
    },
    onAutocompleteInputChange: (value: string) => {
      local.autocompleteText.$set(value);
    },
    onClickSelectedSynonym: (synonymId: SynonymId) => {
      onSelectSynonym(inputs, synonymId);
    },
    onClickSelectedGroup: (groupId: GroupId) => {
      onSelectGroup(inputs, groupId);
    },
    onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
      local.hoveredSynonymId.$set(hoveredSynonymId);
    },
    onMouseOutSelectedSynonym: () => {
      local.hoveredSynonymId.$set(null);
    },
    onClickResult: (noteId: NoteId) => {
      const tagIds = store.$state.noteTags.filter(nt => nt.noteId === noteId).map(nt => nt.tagId);
      const synonymIds = store.$state.tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId).distinct();
      store.activeNoteId.$set(noteId);
      store.synonymIds.$setUnique(synonymIds);
      props.onHide();
    },
    onAutocompleteShowOptionsChange: (showAutocompleteOptions: boolean) => {
      local.showAutocompleteOptions.$set(showAutocompleteOptions);
    },
    onAutocompleteInputFocused: () => {
      local.showAutocompleteOptions.$set(true);
    },
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape')
        return;
      if (inputs.showAutocompleteOptions)
        return local.showAutocompleteOptions.$set(false);
      props.onHide();
    }),
    onClickTabButton: () => {
      if (inputs.showingTab === 'search')
        return local.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
      if (inputs.showingTab === 'results')
        return local.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
    },
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}