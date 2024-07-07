import { archiveGroup, removeSynonymFromGroup } from '@/actions/group';
import { removeTagFromItsCurrentSynonym } from '@/actions/synonym';
import { archiveTag } from '@/actions/tag';
import { GroupId, SynonymId, TagId } from '@/actions/types';
import { TypedKeyboardEvent, useEventHandlerForDocument } from '@/utils/dom-utils';
import { store } from '@/utils/store-utils';
import { type ChangeEvent, type MouseEvent } from 'react';
import { Inputs } from './constants';
import { useSharedFunctions } from './shared';


export const useOutputs = (inputs: Inputs) => {
  const shared = useSharedFunctions(inputs);
  const { local, notify } = inputs;
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => {
      local.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => {
      const groupName = store.$state.groups.findOrThrow(g => g.id === groupId).name;
      local.focusedGroupNameInputText.$set(groupName);
    },
    onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        return await shared.completeEditGroupName(event);
      }
      if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        local.groupId.$nullify();
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      local.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      local.modal.$nullify();
    },
    onClickHideOptionsForGroup: () => {
      local.modal.$nullify();
    },
    onClickTagSynonym: (tagId: TagId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (local.$state.tagId === tagId)
        return local.$patch({
          tagId: null,
          autocompleteText: '',
          groupSynonymId: null
        })
      local.$patch({
        tagId,
        groupId: null,
        groupSynonymId: null,
        autocompleteText: store.$state.tags.findOrThrow(t => t.id === tagId).text,
      });
      shared.focusAutocompleteInput();
    },
    onClickGroupSynonym: (groupId: GroupId, groupSynonymId: SynonymId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (local.$state.groupId === groupId && local.$state.groupSynonymId === groupSynonymId)
        return local.groupSynonymId.$nullify();
      local.$patch({
        tagId: null,
        groupId,
        groupSynonymId,
        autocompleteText: '',
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onClickRemoveTagFromSynonyms: async () => {
      if (!local.$state.tagId)
        return;
      const apiResponse = await removeTagFromItsCurrentSynonym(local.$state.tagId);
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      store.tags.$mergeMatching.id.$with(apiResponse.tag);
      local.$patch({ tagId: null, autocompleteText: '' });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!local.$state.groupSynonymId)
        return;
      if (!local.$state.groupId)
        throw new Error();
      const apiResponse = await removeSynonymFromGroup(local.$state.groupId, local.$state.groupSynonymId);
      if (apiResponse.group) store.groups.$mergeMatching.id.$with(apiResponse.group);
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      local.$patch({ tagId: null, groupId: null, groupSynonymId: null });
      notify.success('Tag-Synonym removed from group');
    },
    onClickConfirmDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      local.modal.$set('confirmDeleteTag');
    },
    onClickEnterEditTextMode: () => {
      shared.focusAutocompleteInput();
    },
    onAutocompleteInputEnter: async () => {
      if (!local.$state.synonymId)
        return await shared.completeCreateTag()
      if (local.$state.tagId)
        return await shared.completeEditTag()
      if (local.$state.autocompleteAction === 'addSynonymsToActiveSynonyms')
        return await shared.completeCreateTagForSynonym()
      if (local.$state.autocompleteAction === 'addSynonymsToActiveGroup')
        return await shared.completeCreateTagForGroup()
      if (local.$state.autocompleteAction === 'addActiveSynonymsToAGroup')
        return await shared.completeCreateGroup()
    },
    onAutocompleteInputChange: (value: string) => {
      local.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!local.$state.tagId && !local.$state.showAutocompleteOptions)
        local.showAutocompleteOptions.$set(true);
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !local.$state.tagId ? '' : store.$state.tags.findOrThrow(t => t.id === local.$state.tagId).text;
      local.autocompleteText.$set(autocompleteText);
      shared.blurAutocompleteInput();
    },
    onClickAddNewTagToSynonymGroup: () => {
      local.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      local.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddSynonymToCustomGroup: () => {
      local.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      shared.focusAutocompleteInput();
    },
    onClickUpdateGroupSynonym: () => {
      if (!local.$state.groupId || !local.$state.groupSynonymId)
        throw new Error();
      const synonymId = store.$state.synonymGroups
        .findOrThrow(sg => sg.groupId === local.$state.groupId && sg.synonymId === local.$state.groupSynonymId)
        .synonymId;
      local.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        tagId: null,
        groupId: null,
        synonymId,
        groupSynonymId: null,
      });
    },
    onClickStartOver: (event: MouseEvent) => {
      event.stopPropagation();
      local.$patch({
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
      local.modal.$set('confirmDeleteGroup');
    },
    onAutocompleteSelected: async (id: TagId | GroupId | null) => {
      if (local.$state.autocompleteAction === 'addActiveSynonymsToAGroup')
        return await shared.onAutocompleteSelectedWhileAddActiveSynonymsToGroup({ groupId: id as GroupId });
      if (local.$state.autocompleteAction === 'addSynonymsToActiveSynonyms')
        return await shared.onAutocompleteSelectedWhileSynonymIsSelected({ tagId: id as TagId });
      if (local.$state.autocompleteAction === 'addSynonymsToActiveGroup')
        return await shared.onAutocompleteSelectedWhileGroupIsSelected({ tagId: id as TagId });
      await shared.onAutocompleteSelectedWhileNothingIsSelected({ tagId: id as TagId });
    },
    onClickRenameTag: () => {
      shared.focusAutocompleteInput();
    },
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape')
        return;
      shared.doCancel(event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (local.$state.modal)
        return local.modal.$nullify();
      local.$patch({
        tagId: null,
        groupId: null,
        autocompleteText: '',
        focusedGroupNameInputText: '',
      })
      shared.blurAutocompleteInput();
    },
    onClickConfirmArchiveTag: async () => {
      const apiResponse = await archiveTag(local.$state.tagId!);
      const isLastTag = inputs.tagsInSynonymGroup.length === 1;
      const synonymId = isLastTag ? null : local.$state.synonymId;
      const autocompleteAction = isLastTag ? null : local.$state.autocompleteAction;
      local.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction });
      if (synonymId)
        store.synonymIds.$filter.$eq(synonymId).$delete();
      store.tags.$find.id.$eq(apiResponse.tag.id).$delete();
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      notify.success('Tag archived');
    },
    onClickConfirmArchiveGroup: async () => {
      const apiResponse = await archiveGroup(local.$state.groupId!);
      local.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      store.groups.$mergeMatching.id.$with(apiResponse.group);
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      notify.success('Group archived');
    },
    onCancelConfirmation: () => {
      local.modal.$nullify();
    },
    onClickShowOptionsForSynonyms: () => {
      if (local.$state.modal)
        return local.modal.$nullify();
      local.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (local.$state.groupId === groupId && local.$state.modal)
        return local.modal.$nullify();
      local.$patch({
        modal: 'groupOptions',
        groupId,
        tagId: null,
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      local.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      local.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      local.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
  };
}
