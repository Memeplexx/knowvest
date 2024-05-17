import { archiveGroup, removeSynonymFromGroup } from '@/actions/group';
import { removeTagFromItsCurrentSynonym } from '@/actions/synonym';
import { archiveTag } from '@/actions/tag';
import { GroupId, SynonymId, TagId } from '@/actions/types';
import { TypedKeyboardEvent, useEventHandlerForDocument } from '@/utils/dom-utils';
import { writeToStoreAndDb } from '@/utils/storage-utils';
import { type ChangeEvent, type MouseEvent } from 'react';
import { Inputs, Props } from './constants';
import { useSharedFunctions } from './shared';


export const useOutputs = (props: Props, inputs: Inputs) => {
  const shared = useSharedFunctions(props, inputs);
  const { store, notify } = inputs;
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => {
      store.$local.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => {
      const groupName = store.groups.$find.id.$eq(groupId).name;
      store.$local.focusedGroupNameInputText.$set(groupName);
    },
    onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter')
        return await shared.completeEditGroupName();
      if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        store.$local.groupId.$set(null);
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      store.$local.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      store.$local.modal.$set(null);
    },
    onClickHideOptionsForGroup: () => {
      store.$local.modal.$set(null);
    },
    onClickTagSynonym: (tagId: TagId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.tagId === tagId)
        return store.$local.$patch({
          tagId: null,
          autocompleteText: '',
          groupSynonymId: null,
        })
      store.$local.$patch({
        tagId,
        groupId: null,
        groupSynonymId: null,
        autocompleteText: store.tags.$find.id.$eq(tagId).text,
      });
      shared.focusAutocompleteInput();
    },
    onClickGroupSynonym: (groupId: GroupId, groupSynonymId: SynonymId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.groupId === groupId && inputs.groupSynonymId === groupSynonymId)
        return store.$local.groupSynonymId.$set(null);
      store.$local.$patch({
        tagId: null,
        groupId,
        groupSynonymId,
        autocompleteText: '',
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onClickRemoveTagFromSynonyms: async () => {
      if (!inputs.tagId)
        return;
      const apiResponse = await removeTagFromItsCurrentSynonym(inputs.tagId);
      await writeToStoreAndDb(store, { synonymGroups: apiResponse.synonymGroups, tags: apiResponse.tag });
      store.$local.$patch({ tagId: null, autocompleteText: '' });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId)
        return;
      if (!inputs.groupId)
        throw new Error();
      const response = await removeSynonymFromGroup(inputs.groupId, inputs.groupSynonymId);
      await writeToStoreAndDb(store, { groups: response.group, synonymGroups: response.synonymGroups });
      store.$local.$patch({ tagId: null, groupId: null, groupSynonymId: null });
      notify.success('Tag-Synonym removed from group');
    },
    onClickConfirmDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      store.$local.modal.$set('confirmDeleteTag');
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
      store.$local.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!inputs.tagId && !inputs.showAutocompleteOptions)
        store.$local.showAutocompleteOptions.$set(true);
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !inputs.tagId ? '' : store.tags.$find.id.$eq(inputs.tagId).text;
      store.$local.autocompleteText.$set(autocompleteText);
      shared.blurAutocompleteInput();
    },
    onClickAddNewTagToSynonymGroup: () => {
      store.$local.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      store.$local.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddSynonymToCustomGroup: () => {
      store.$local.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      shared.focusAutocompleteInput();
    },
    onClickUpdateGroupSynonym: () => {
      if (!inputs.groupId || !inputs.groupSynonymId)
        throw new Error();
      const synonymId = store.synonymGroups
        .$find.groupId.$eq(inputs.groupId).$and.synonymId.$eq(inputs.groupSynonymId)
        .synonymId;
      store.$local.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        tagId: null,
        groupId: null,
        synonymId,
        groupSynonymId: null,
      });
    },
    onClickStartOver: (event: MouseEvent) => {
      event.stopPropagation();
      store.$local.$patch({
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
      store.$local.modal.$set('confirmDeleteGroup');
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
          store.$local.showAutocompleteOptions.$set(false)
        return;
      }
      shared.doCancel(event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (inputs.modal)
        return store.$local.modal.$set(null);
      store.$local.$patch({
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
      store.$local.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction });
      synonymId && store.synonymIds.$filter.$eq(synonymId).$delete();
      await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags, synonymGroups: apiResponse.synonymGroups });
      notify.success('Tag archived');
    },
    onClickConfirmArchiveGroup: async () => {
      const response = await archiveGroup(inputs.groupId!);
      store.$local.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      await writeToStoreAndDb(store, { synonymGroups: response.synonymGroups, groups: response.group });
      notify.success('Group archived');
    },
    onCancelConfirmation: () => {
      store.$local.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (inputs.modal)
        return store.$local.modal.$set(null);
      store.$local.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (inputs.groupId === groupId && inputs.modal)
        return store.$local.modal.$set(null);
      store.$local.$patch({
        modal: 'groupOptions',
        groupId,
        tagId: null,
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      store.$local.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.$local.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      store.$local.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}
