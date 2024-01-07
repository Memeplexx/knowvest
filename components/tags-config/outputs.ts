import { useEventHandlerForDocument } from '@/utils/hooks';

import { GroupId, SynonymId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { type ChangeEvent, type MouseEvent } from 'react';
import { TypedKeyboardEvent } from '@/utils/types';
import { Inputs } from './constants';
import { indexeddb } from '@/utils/indexed-db';
import { useSharedFunctions } from './shared';


export const useOutputs = (inputs: Inputs) => {
  const shared = useSharedFunctions(inputs);
  const { store, notify } = inputs;
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => () => {
      store.config.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => () => {
      store.config.focusedGroupNameInputText.$set(store.$state.groups.findOrThrow(g => g.id === groupId).name);
    },
    onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        await shared.completeEditGroupName();
      } else if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        store.config.groupId.$set(null);
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      store.config.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      store.config.modal.$set(null);
    },
    onClickHideOptionsForGroup: () => {
      store.config.modal.$set(null);
    },
    onClickTagSynonym: (tagId: TagId) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.tagId === tagId) {
        return store.config.$patch({
          tagId: null,
          autocompleteText: '',
          groupSynonymId: null,
        })
      }
      store.config.$patch({
        tagId,
        groupId: null,
        autocompleteText: store.$state.tags.findOrThrow(t => t.id === tagId).text,
        groupSynonymId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickGroupSynonym: (groupId: GroupId, groupSynonymId: SynonymId) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.groupId === groupId && inputs.groupSynonymId === groupSynonymId) {
        return store.config.groupSynonymId.$set(null);
      }
      const focusedGroupNameInputText = store.$state.groups.findOrThrow(g => g.id === groupId).name;
      store.config.$patch({
        tagId: null,
        groupId,
        groupSynonymId,
        autocompleteText: '',
        focusedGroupNameInputText,
      });
    },
    onClickRemoveTagFromSynonyms: async () => {
      if (!inputs.tagId) { return; }
      const apiResponse = await trpc.synonym.removeTagFromItsCurrentSynonym.mutate({ tagId: inputs.tagId });
      await indexeddb.write(store, { synonymGroups: apiResponse.archivedSynonymGroups, tags: apiResponse.tagUpdated });
      store.config.$patch({ tagId: null, autocompleteText: '' });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId) { return; }
      const response = await trpc.group.removeSynonym.mutate({ groupId: inputs.groupId!, synonymId: inputs.groupSynonymId! });
      await indexeddb.write(store, { groups: response.archivedGroup, synonymGroups: response.archivedSynonymGroups });
      store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null });
      notify.success('Tag-Synonym removed from group');
    },
    onClickConfirmDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      store.config.modal.$set('confirmDeleteTag');
    },
    onClickEnterEditTextMode: () => {
      shared.focusAutocompleteInput();
    },
    onAutocompleteInputEnter: async () => {
      if (!inputs.synonymId) {
        await shared.completeCreateTag()
      } else if (inputs.tagId) {
        await shared.completeEditTag()
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await shared.completeCreateTagForSynonym()
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveGroup') {
        await shared.completeCreateTagForGroup()
      } else if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await shared.completeCreateGroup()
      }
    },
    onAutocompleteInputChange: (value: string) => {
      store.config.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!inputs.tagId && !inputs.showAutocompleteOptions) {
        store.config.showAutocompleteOptions.$set(true);
      }
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !inputs.tagId ? '' : store.$state.tags.findOrThrow(t => t.id === inputs.tagId).text;
      store.config.autocompleteText.$set(autocompleteText);
      shared.blurAutocompleteInput();
    },
    onClickAddNewTagToSynonymGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddSynonymToCustomGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      shared.focusAutocompleteInput();
    },
    onClickUpdateGroupSynonym: () => {
      if (!inputs.groupId || !inputs.groupSynonymId) { throw new Error(); }
      const synonymId = store.$state.synonymGroups
        .findOrThrow(sg => sg.groupId === inputs.groupId && sg.synonymId === inputs.groupSynonymId)
        .synonymId;
      store.config.$patch({
        tagId: null,
        groupId: null,
        synonymId,
        groupSynonymId: null,
        autocompleteAction: 'addSynonymsToActiveSynonyms',
      });
    },
    onClickStartOver: (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      store.config.$patch({
        tagId: null,
        groupId: null,
        synonymId: null,
        modal: null,
        autocompleteText: '',
        groupSynonymId: null,
        autocompleteAction: null,
        focusedGroupNameInputText: '',
      });
      shared.focusAutocompleteInput();
    },
    onClickDeleteGroup: (event: MouseEvent) => {
      event.stopPropagation();
      store.config.modal.$set('confirmDeleteGroup');
    },
    onAutocompleteSelected: async (id: TagId | GroupId | null) => {
      if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await shared.onAutocompleteSelectedWhileAddActiveSynonymsToGroup({ groupId: id as GroupId });
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await shared.onAutocompleteSelectedWhileSynonymIsSelected({ tagId: id as TagId });
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveGroup') {
        await shared.onAutocompleteSelectedWhileGroupIsSelected({ tagId: id as TagId });
      } else {
        await shared.onAutocompleteSelectedWhileNothingIsSelected({ tagId: id as TagId });
      }
    },
    onClickRenameTag: () => {
      shared.focusAutocompleteInput();
    },
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.detail === 0) { return; } // Events with a detail of 0 come from enter presses of autocomplete option. (https://github.com/facebook/react/issues/3907#issuecomment-363948471)
      shared.doCancel(event.target);
    }),
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape') {
        return;
      }
      if (event.target.tagName === 'INPUT') {
        inputs.autocompleteRef.current?.blurInput();
        if (inputs.showAutocompleteOptions) {
          store.config.showAutocompleteOptions.$set(false)
        }
        return;
      }
      shared.doCancel(event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (inputs.modal) {
        return store.config.modal.$set(null);
      }
      store.config.$patch({
        tagId: null,
        groupId: null,
        autocompleteText: '',
        focusedGroupNameInputText: '',
      })
      shared.blurAutocompleteInput();
    },
    onClickConfirmArchiveTag: async () => {
      const apiResponse = await trpc.tag.archive.mutate({ tagId: inputs.tagId! });
      const synonymId = inputs.tagsInSynonymGroup.length === 1 ? null : inputs.synonymId;
      const lastTag = inputs.tagsInSynonymGroup.length === 1;
      store.config.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction: lastTag ? null : inputs.autocompleteAction });
      await indexeddb.write(store, { tags: apiResponse.tagArchived, noteTags: apiResponse.archivedNoteTags, synonymGroups: apiResponse.archivedSynonymGroups });
      notify.success('Tag archived');
    },
    onClickConfirmArchiveGroup: async () => {
      const response = await trpc.group.archive.mutate({ groupId: inputs.groupId! });
      store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      await indexeddb.write(store, { synonymGroups: response.synonymGroupsArchived, groups: response.groupArchived });
      notify.success('Group archived');
    },
    onCancelConfirmation: () => {
      store.config.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (inputs.modal) {
        return store.config.modal.$set(null);
      }
      store.config.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => () => {
      if (inputs.groupId === groupId && inputs.modal) {
        return store.config.modal.$set(null);
      }
      const focusedGroupNameInputText = store.$state.groups.findOrThrow(g => g.id === groupId).name;
      store.config.$patch({
        modal: 'groupOptions',
        groupId,
        tagId: null,
        focusedGroupNameInputText,
      });
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => () => {
      store.config.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.config.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      store.config.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
    onClickCloseButton: () => {
      inputs.props.onHide();
    },
  };
}
