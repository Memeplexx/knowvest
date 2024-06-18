import { GroupId, NoteId, SynonymId } from "@/actions/types";
import { useEventHandlerForDocument } from "@/utils/dom-utils";
import { MouseEvent } from "react";
import { Inputs } from "./constants";

export const useOutputs = (inputs: Inputs) => {
  const { store, local } = inputs;
  return {
    onAutocompleteSelected: (value: string | null) => {
      inputs.autocompleteText && local.autocompleteText.$set('');
      const selection = inputs.autocompleteOptions.findOrThrow(o => o.value === value);
      if (selection.type === 'synonym') {
        local.selectedSynonymIds.$push(selection.id as SynonymId);
        local.enabledSynonymIds.$push(selection.id as SynonymId);
      }
      if (selection.type === 'group') {
        local.selectedGroupIds.$push(selection.id as GroupId);
        local.enabledSynonymIds.$pushMany(store.$state.tags.filter(tag => tag.synonymId === selection.id).map(t => t.synonymId).distinct());
      }
    },
    onAutocompleteInputChange: (value: string) => {
      local.autocompleteText.$set(value);
    },
    onClickRemoveSynonym: (synonymId: SynonymId) => {
      local.selectedSynonymIds.$find.$eq(synonymId).$delete();
    },
    onClickRemoveGroup: (groupId: GroupId) => {
      local.selectedGroupIds.$find.$eq(groupId).$delete();
    },
    onMouseOverSelectedSynonym: (hoveredSynonymId: SynonymId) => {
      local.hoveredSynonymId.$set(hoveredSynonymId);
    },
    onMouseOutSelectedSynonym: () => {
      local.hoveredSynonymId.$set(null);
    },
    onClickResult: (noteId: NoteId) => {
      const tagIds = store.$state.noteTags[noteId]!.map(tag => tag.id);
      const synonymIds = store.$state.tags.filter(tag => tagIds.includes(tag.id)).map(t => t.synonymId).distinct();
      store.activeNoteId.$set(noteId);
      store.synonymIds.$set(synonymIds);
      inputs.router.push('./home');
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
    }),
    onClickTabButton: () => {
      if (inputs.showingTab === 'search')
        return local.$patch({ showingTab: 'results', showSearchPane: false, showResultsPane: true })
      if (inputs.showingTab === 'results')
        return local.$patch({ showingTab: 'search', showSearchPane: true, showResultsPane: false })
    },
    onClickToggleSynonym: (synonymId: SynonymId) => (event: MouseEvent) => {
      event.stopPropagation();
      const toggledSynonymIds = local.$state.enabledSynonymIds;
      if (toggledSynonymIds.includes(synonymId))
        local.enabledSynonymIds.$set(toggledSynonymIds.filter(id => id !== synonymId));
      else
        local.enabledSynonymIds.$set([...toggledSynonymIds, synonymId]);
    },
    onClickStartOver: () => {
      local.selectedSynonymIds.$set([]);
      local.selectedGroupIds.$set([]);
      local.enabledSynonymIds.$set([]);
      local.autocompleteText.$set('');
    }
  };
}