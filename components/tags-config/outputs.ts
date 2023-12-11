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


export const useOutputs = (inputs: Inputs) => {
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => {
      inputs.store.config.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: inputs.store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => {
      inputs.store.config.focusedGroupNameInputText.$set(inputs.store.$state.groups.findOrThrow(g => g.id === groupId).name);
    },
    onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        await completeEditGroupName(inputs);
      } else if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        inputs.store.config.groupId.$set(null);
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      inputs.store.config.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      inputs.store.config.modal.$set(null);
    },
    onClickHideOptionsForGroup: () => {
      inputs.store.config.modal.$set(null);
    },
    onClickTagSynonym: (event: MouseEvent<HTMLElement>, tagId: TagId) => {
      event.stopPropagation();
      if (inputs.tagId === tagId) {
        return inputs.store.config.$patch({
          tagId: null,
          autocompleteText: '',
          groupSynonymId: null,
        })
      }
      inputs.store.config.$patch({
        tagId,
        groupId: null,
        autocompleteText: inputs.store.$state.tags.findOrThrow(t => t.id === tagId).text,
        groupSynonymId: null,
      });
      focusAutocompleteInput(inputs);
    },
    onClickGroupSynonym: (event: MouseEvent<HTMLElement>, groupId: GroupId, groupSynonymId: SynonymId) => {
      event.stopPropagation();
      if (inputs.groupId === groupId && inputs.groupSynonymId === groupSynonymId) {
        return inputs.store.config.groupSynonymId.$set(null);
      }
      const focusedGroupNameInputText = inputs.store.$state.groups.findOrThrow(g => g.id === groupId).name;
      inputs.store.config.$patch({
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
      const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
      const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
      inputs.store.config.$patch({ tagId: null, autocompleteText: '' });
      inputs.store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete();
      inputs.store.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated);
      inputs.notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId) { return; }
      const response = await trpc.group.removeSynonym.mutate({ groupId: inputs.groupId!, synonymId: inputs.groupSynonymId! });
      response.deletedGroup && inputs.store.groups
        .$find.id.$eq(response.deletedGroup.id)
        .$delete();
      inputs.store.synonymGroups
        .$filter.groupId.$eq(response.deletedSynonymGroup.groupId).$and.synonymId.$eq(response.deletedSynonymGroup.synonymId)
        .$delete();
      inputs.store.config
        .$patch({ tagId: null, groupId: null, groupSynonymId: null });
      inputs.notify.success('Tag-Synonym removed from group');
    },
    onClickDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      inputs.store.config.modal.$set('confirmDeleteTag');
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
      inputs.store.config.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!inputs.tagId && !inputs.showAutocompleteOptions) {
        inputs.store.config.showAutocompleteOptions.$set(true);
      }
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !inputs.tagId ? '' : inputs.store.$state.tags.findOrThrow(t => t.id === inputs.tagId).text;
      inputs.store.config.autocompleteText.$set(autocompleteText);
      blurAutocompleteInput(inputs);
    },
    onClickAddNewTagToSynonymGroup: () => {
      inputs.store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      focusAutocompleteInput(inputs);
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      inputs.store.config.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      focusAutocompleteInput(inputs);
    },
    onClickAddSynonymToCustomGroup: () => {
      inputs.store.config.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      focusAutocompleteInput(inputs);
    },
    onClickUpdateGroupSynonym: () => {
      if (!inputs.groupId || !inputs.groupSynonymId) { throw new Error(); }
      const synonymId = inputs.store.$state.synonymGroups
        .findOrThrow(sg => sg.groupId === inputs.groupId && sg.synonymId === inputs.groupSynonymId)
        .synonymId;
      inputs.store.config.$patch({
        tagId: null,
        groupId: null,
        synonymId,
        groupSynonymId: null,
        autocompleteAction: 'addSynonymsToActiveSynonyms',
      });
    },
    onClickStartOver: (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      inputs.store.config.$patch({
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
      inputs.store.config.modal.$set('confirmDeleteGroup');
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
          inputs.store.config.showAutocompleteOptions.$set(false)
        }
        return;
      }
      doCancel(inputs, event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (inputs.modal) {
        return inputs.store.config.modal.$set(null);
      }
      inputs.store.config.$patch({
        tagId: null,
        groupId: null,
        autocompleteText: '',
        focusedGroupNameInputText: '',
      })
      blurAutocompleteInput(inputs);
    },
    onClickConfirmDeleteTag: async () => {
      const apiResponse = await trpc.tag.delete.mutate({ tagId: inputs.tagId! });
      const tagIds = apiResponse.noteTagsDeleted.map(nt => nt.tagId);
      const noteIds = apiResponse.noteTagsDeleted.map(nt => nt.noteId);
      const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
      const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
      const synonymId = inputs.tagsInSynonymGroup.length === 1 ? null : inputs.synonymId;
      const lastTag = inputs.tagsInSynonymGroup.length === 1;
      inputs.store.config.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction: lastTag ? null : inputs.autocompleteAction });
      inputs.store.tags.$find.id.$eq(apiResponse.tagDeleted.id).$delete();
      inputs.store.noteTags.$filter.tagId.$in(tagIds).$and.noteId.$in(noteIds).$delete();
      inputs.store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete();
      inputs.notify.success('Tag deleted');
    },
    onClickConfirmDeleteGroup: async () => {
      const response = await trpc.group.delete.mutate({ groupId: inputs.groupId! });
      inputs.store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      inputs.store.synonymGroups.$filter.groupId.$eq(response.groupDeleted.id).$delete();
      inputs.store.groups.$filter.id.$eq(response.groupDeleted.id).$delete();
      inputs.notify.success('Group deleted');
    },
    onCancelConfirmation: () => {
      inputs.store.config.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (inputs.modal) {
        return inputs.store.config.modal.$set(null);
      }
      inputs.store.config.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (inputs.groupId === groupId && inputs.modal) {
        return inputs.store.config.modal.$set(null);
      }
      const focusedGroupNameInputText = inputs.store.$state.groups.findOrThrow(g => g.id === groupId).name;
      inputs.store.config.$patch({
        modal: 'groupOptions',
        groupId,
        tagId: null,
        focusedGroupNameInputText,
      });
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      inputs.store.config.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      inputs.store.config.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      inputs.store.config.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
    onClickCloseButton: () => {
      inputs.props.onHide();
    },
  };
}
