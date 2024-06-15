import { archiveGroup, removeSynonymFromGroup } from '@/actions/group';
import { removeTagFromItsCurrentSynonym } from '@/actions/synonym';
import { archiveTag } from '@/actions/tag';
import { GroupId, SynonymId, TagId } from '@/actions/types';
import { TypedKeyboardEvent, useEventHandlerForDocument } from '@/utils/dom-utils';
import { type ChangeEvent, type MouseEvent } from 'react';
import { Inputs, Props } from './constants';
import { useSharedFunctions } from './shared';


export const useOutputs = (props: Props, inputs: Inputs) => {
  const shared = useSharedFunctions(props, inputs);
  const { store, local, notify } = inputs;
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
      if (event.key === 'Enter')
        return await shared.completeEditGroupName();
      if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        local.groupId.$set(null);
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      local.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      local.modal.$set(null);
    },
    onClickHideOptionsForGroup: () => {
      local.modal.$set(null);
    },
    onClickTagSynonym: (tagId: TagId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.tagId === tagId)
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
      if (inputs.groupId === groupId && inputs.groupSynonymId === groupSynonymId)
        return local.groupSynonymId.$set(null);
      local.$patch({
        tagId: null,
        groupId,
        groupSynonymId,
        autocompleteText: '',
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onClickRemoveTagFromSynonyms: async () => {
      if (!inputs.tagId)
        return;
      const apiResponse = await removeTagFromItsCurrentSynonym(inputs.tagId);
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      store.tags.$mergeMatching.id.$with(apiResponse.tag);
      local.$patch({ tagId: null, autocompleteText: '' });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId)
        return;
      if (!inputs.groupId)
        throw new Error();
      const apiResponse = await removeSynonymFromGroup(inputs.groupId, inputs.groupSynonymId);
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
      if (!inputs.synonymId)
        return await shared.completeCreateTag()
      if (inputs.tagId)
        return await shared.completeEditTag()
      if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms')
        return await shared.completeCreateTagForSynonym()
      if (inputs.autocompleteAction === 'addSynonymsToActiveGroup')
        return await shared.completeCreateTagForGroup()
      if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup')
        return await shared.completeCreateGroup()
    },
    onAutocompleteInputChange: (value: string) => {
      local.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!inputs.tagId && !inputs.showAutocompleteOptions)
        local.showAutocompleteOptions.$set(true);
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !inputs.tagId ? '' : store.$state.tags.findOrThrow(t => t.id === inputs.tagId).text;
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
      if (!inputs.groupId || !inputs.groupSynonymId)
        throw new Error();
      const synonymId = store.$state.synonymGroups
        .findOrThrow(sg => sg.groupId === inputs.groupId && sg.synonymId === inputs.groupSynonymId)
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
      if (inputs.autocompleteAction === 'addActiveSynonymsToAGroup')
        return await shared.onAutocompleteSelectedWhileAddActiveSynonymsToGroup({ groupId: id as GroupId });
      if (inputs.autocompleteAction === 'addSynonymsToActiveSynonyms')
        return await shared.onAutocompleteSelectedWhileSynonymIsSelected({ tagId: id as TagId });
      if (inputs.autocompleteAction === 'addSynonymsToActiveGroup')
        return await shared.onAutocompleteSelectedWhileGroupIsSelected({ tagId: id as TagId });
      await shared.onAutocompleteSelectedWhileNothingIsSelected({ tagId: id as TagId });
    },
    onClickRenameTag: () => {
      shared.focusAutocompleteInput();
    },
    onClickDocument: useEventHandlerForDocument('click', event => {
      if (event.detail === 0) return; // Events with a detail of 0 come from enter presses of autocomplete option. (https://github.com/facebook/react/issues/3907#issuecomment-363948471)
      shared.doCancel(event.target);
    }),
    onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
      if (event.key !== 'Escape')
        return;
      if (event.target.tagName === 'INPUT') {
        inputs.autocompleteRef.current?.blurInput();
        if (inputs.showAutocompleteOptions)
          local.showAutocompleteOptions.$set(false)
        return;
      }
      shared.doCancel(event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (inputs.modal)
        return local.modal.$set(null);
      local.$patch({
        tagId: null,
        groupId: null,
        autocompleteText: '',
        focusedGroupNameInputText: '',
      })
      shared.blurAutocompleteInput();
    },
    onClickConfirmArchiveTag: async () => {
      const apiResponse = await archiveTag(inputs.tagId!);
      const isLastTag = inputs.tagsInSynonymGroup.length === 1;
      const synonymId = isLastTag ? null : inputs.synonymId;
      const autocompleteAction = isLastTag ? null : inputs.autocompleteAction;
      local.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction });
      if (synonymId)
        store.synonymIds.$filter.$eq(synonymId).$delete();
      store.tags.$find.id.$eq(apiResponse.tag.id).$delete();
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      notify.success('Tag archived');
    },
    onClickConfirmArchiveGroup: async () => {
      const apiResponse = await archiveGroup(inputs.groupId!);
      local.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      store.groups.$mergeMatching.id.$with(apiResponse.group);
      store.synonymGroups.$mergeMatching.synonymId.$with(apiResponse.synonymGroups);
      notify.success('Group archived');
    },
    onCancelConfirmation: () => {
      local.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (inputs.modal)
        return local.modal.$set(null);
      local.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (inputs.groupId === groupId && inputs.modal)
        return local.modal.$set(null);
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
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}
