import { useEventHandlerForDocument } from '@/utils/hooks';

import {
  blurAutocompleteInput,
  completeCreateGroup,
  completeCreateTag,
  completeCreateTagForGroup,
  completeCreateTagForSynonym,
  completeEditGroupName,
  completeEditTag,
  doCancel,
  focusAutocompleteInput,
  onAutocompleteSelectedWhileAddActiveSynonymsToGroup,
  onAutocompleteSelectedWhileGroupIsSelected,
  onAutocompleteSelectedWhileNothingIsSelected,
  onAutocompleteSelectedWhileSynonymIsSelected,
} from './shared';
import { GroupId, SynonymId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { type ChangeEvent, type MouseEvent } from 'react';
import { TypedKeyboardEvent } from '@/utils/types';
import { Inputs } from './constants';
import { indexeddb } from '@/utils/indexed-db';


export const useOutputs = (inputs: Inputs) => {
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
        await completeEditGroupName(inputs);
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
      focusAutocompleteInput(inputs);
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
      store.config.$patch({ tagId: null, autocompleteText: '' });
      store.synonymGroups.$mergeMatching.id.$withMany(apiResponse.archivedSynonymGroups);
      store.tags.$mergeMatching.id.$withOne(apiResponse.tagUpdated);
      await indexeddb.write({ synonymGroups: apiResponse.archivedSynonymGroups, tags: apiResponse.tagUpdated });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId) { return; }
      const response = await trpc.group.removeSynonym.mutate({ groupId: inputs.groupId!, synonymId: inputs.groupSynonymId! });
      response.archivedGroup && store.groups.$mergeMatching.id.$withOne(response.archivedGroup);
      store.synonymGroups.$mergeMatching.id.$withMany(response.archivedSynonymGroups);
      await indexeddb.write({ groups: response.archivedGroup, synonymGroups: response.archivedSynonymGroups });
      store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null });
      notify.success('Tag-Synonym removed from group');
    },
    onClickDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      store.config.modal.$set('confirmDeleteTag');
    },
    onClickEnterEditTextMode: () => {
      focusAutocompleteInput(inputs);
    },
    onAutocompleteInputEnter: async () => {
      if (!inputs.synonymId) {
        await completeCreateTag(inputs)
      } else if (inputs.tagId) {
        await completeEditTag(inputs)
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await completeCreateTagForSynonym(inputs)
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveGroup') {
        await completeCreateTagForGroup(inputs)
      } else if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await completeCreateGroup(inputs)
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
      blurAutocompleteInput(inputs);
    },
    onClickAddNewTagToSynonymGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      focusAutocompleteInput(inputs);
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      focusAutocompleteInput(inputs);
    },
    onClickAddSynonymToCustomGroup: () => {
      store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      focusAutocompleteInput(inputs);
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
      focusAutocompleteInput(inputs);
    },
    onClickDeleteGroup: (event: MouseEvent) => {
      event.stopPropagation();
      store.config.modal.$set('confirmDeleteGroup');
    },
    onAutocompleteSelected: async (id: TagId | GroupId | null) => {
      if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await onAutocompleteSelectedWhileAddActiveSynonymsToGroup({ inputs, groupId: id as GroupId });
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await onAutocompleteSelectedWhileSynonymIsSelected({ inputs, tagId: id as TagId });
      } else if (inputs.autocompleteAction === 'addSynonymsToActiveGroup') {
        await onAutocompleteSelectedWhileGroupIsSelected({ inputs, tagId: id as TagId });
      } else {
        await onAutocompleteSelectedWhileNothingIsSelected({ inputs, tagId: id as TagId });
      }
    },
    onClickRenameTag: () => {
      focusAutocompleteInput(inputs);
    },
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.detail === 0) { return; } // Events with a detail of 0 come from enter presses of autocomplete option. (https://github.com/facebook/react/issues/3907#issuecomment-363948471)
      doCancel(inputs, event.target);
    }),
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape') {
        return;
      }
      if ((event.target as HTMLElement).tagName === 'INPUT') {
        inputs.autocompleteRef.current?.blurInput();
        if (inputs.showAutocompleteOptions) {
          store.config.showAutocompleteOptions.$set(false)
        }
        return;
      }
      doCancel(inputs, event.target);
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
      blurAutocompleteInput(inputs);
    },
    onClickConfirmArchiveTag: async () => {
      const apiResponse = await trpc.tag.archive.mutate({ tagId: inputs.tagId! });
      const synonymId = inputs.tagsInSynonymGroup.length === 1 ? null : inputs.synonymId;
      const lastTag = inputs.tagsInSynonymGroup.length === 1;
      store.config.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction: lastTag ? null : inputs.autocompleteAction });
      store.tags.$mergeMatching.id.$withOne(apiResponse.tagArchived);
      store.noteTags.$mergeMatching.id.$withMany(apiResponse.archivedNoteTags);
      store.synonymGroups.$mergeMatching.id.$withMany(apiResponse.archivedSynonymGroups);
      await indexeddb.write({ tags: apiResponse.tagArchived, noteTags: apiResponse.archivedNoteTags, synonymGroups: apiResponse.archivedSynonymGroups });
      notify.success('Tag deleted');
    },
    onClickConfirmArchiveGroup: async () => {
      const response = await trpc.group.archive.mutate({ groupId: inputs.groupId! });
      store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      store.synonymGroups.$mergeMatching.groupId.$withMany(response.synonymGroupsArchived);
      store.groups.$mergeMatching.id.$withOne(response.groupArchived);
      await indexeddb.write({ synonymGroups: response.synonymGroupsArchived, groups: response.groupArchived });
      notify.success('Group deleted');
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
