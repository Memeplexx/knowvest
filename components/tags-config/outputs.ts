import { useEventHandlerForDocument } from '@/utils/hooks';

import { type ChangeEvent, type MouseEvent } from 'react';
import { GroupId, SynonymId, TagId, TypedKeyboardEvent } from '@/utils/types';
import { Inputs } from './constants';
import { indexeddb } from '@/utils/indexed-db';
import { useSharedFunctions } from './shared';
import { removeTagFromItsCurrentSynonym } from '@/app/actions/synonym';
import { archiveGroup, removeSynonymFromGroup } from '@/app/actions/group';
import { archiveTag } from '@/app/actions/tag';


export const useOutputs = (inputs: Inputs) => {
  const shared = useSharedFunctions(inputs);
  const { store, notify, setState } = inputs;
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => {
      store.tagsConfig.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => {
      const groupName = store.groups.$find.id.$eq(groupId).name;
      store.tagsConfig.focusedGroupNameInputText.$set(groupName);
    },
    onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        await shared.completeEditGroupName();
      } else if (event.key === 'Escape') {
        event.target.blur();
        event.stopPropagation();
        store.tagsConfig.groupId.$set(null);
      }
    },
    onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      store.tagsConfig.focusedGroupNameInputText.$set(event.target.value);
    },
    onClickHideOptionsForSynonyms: () => {
      store.tagsConfig.modal.$set(null);
    },
    onClickHideOptionsForGroup: () => {
      store.tagsConfig.modal.$set(null);
    },
    onClickTagSynonym: (tagId: TagId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.tagId === tagId) {
        return store.tagsConfig.$patch({
          tagId: null,
          autocompleteText: '',
          groupSynonymId: null,
        })
      }
      store.tagsConfig.$patch({
        tagId,
        groupId: null,
        groupSynonymId: null,
        autocompleteText: store.tags.$find.id.$eq(tagId).text,
      });
      shared.focusAutocompleteInput();
    },
    onClickGroupSynonym: (groupId: GroupId, groupSynonymId: SynonymId, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (inputs.groupId === groupId && inputs.groupSynonymId === groupSynonymId) {
        return store.tagsConfig.groupSynonymId.$set(null);
      }
      store.tagsConfig.$patch({
        tagId: null,
        groupId,
        groupSynonymId,
        autocompleteText: '',
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onClickRemoveTagFromSynonyms: async () => {
      if (!inputs.tagId) { return; }
      const apiResponse = await removeTagFromItsCurrentSynonym({ tagId: inputs.tagId });
      await indexeddb.write(store, { synonymGroups: apiResponse.archivedSynonymGroups, tags: apiResponse.tagUpdated });
      store.tagsConfig.$patch({ tagId: null, autocompleteText: '' });
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!inputs.groupSynonymId) { return; }
      const response = await removeSynonymFromGroup({ groupId: inputs.groupId!, synonymId: inputs.groupSynonymId! });
      await indexeddb.write(store, { groups: response.archivedGroup, synonymGroups: response.archivedSynonymGroups });
      store.tagsConfig.$patch({ tagId: null, groupId: null, groupSynonymId: null });
      notify.success('Tag-Synonym removed from group');
    },
    onClickConfirmDeleteTag: (event: MouseEvent) => {
      event.stopPropagation();
      store.tagsConfig.modal.$set('confirmDeleteTag');
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
      store.tagsConfig.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!inputs.tagId && !inputs.showAutocompleteOptions) {
        store.tagsConfig.showAutocompleteOptions.$set(true);
      }
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !inputs.tagId ? '' : store.tags.$find.id.$eq(inputs.tagId).text;
      store.tagsConfig.autocompleteText.$set(autocompleteText);
      shared.blurAutocompleteInput();
    },
    onClickAddNewTagToSynonymGroup: () => {
      store.tagsConfig.$patch({
        autocompleteAction: 'addSynonymsToActiveSynonyms',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddCurrentSynonymsToExistingGroup: () => {
      store.tagsConfig.$patch({
        autocompleteAction: 'addActiveSynonymsToAGroup',
        autocompleteText: '',
        tagId: null,
      });
      shared.focusAutocompleteInput();
    },
    onClickAddSynonymToCustomGroup: () => {
      store.tagsConfig.$patch({
        autocompleteAction: 'addSynonymsToActiveGroup',
        autocompleteText: '',
        showAutocompleteOptions: true,
      });
      shared.focusAutocompleteInput();
    },
    onClickUpdateGroupSynonym: () => {
      if (!inputs.groupId || !inputs.groupSynonymId) { throw new Error(); }
      const synonymId = store.synonymGroups
        .$find.groupId.$eq(inputs.groupId).$and.synonymId.$eq(inputs.groupSynonymId)
        .synonymId;
      store.tagsConfig.$patch({
        tagId: null,
        groupId: null,
        synonymId,
        groupSynonymId: null,
        autocompleteAction: 'addSynonymsToActiveSynonyms',
      });
    },
    onClickStartOver: (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      store.tagsConfig.$patch({
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
      store.tagsConfig.modal.$set('confirmDeleteGroup');
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
          store.tagsConfig.showAutocompleteOptions.$set(false)
        }
        return;
      }
      shared.doCancel(event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (inputs.modal) {
        return store.tagsConfig.modal.$set(null);
      }
      store.tagsConfig.$patch({
        tagId: null,
        groupId: null,
        autocompleteText: '',
        focusedGroupNameInputText: '',
      })
      shared.blurAutocompleteInput();
    },
    onClickConfirmArchiveTag: async () => {
      const apiResponse = await archiveTag({ tagId: inputs.tagId! });
      const synonymId = inputs.tagsInSynonymGroup.length === 1 ? null : inputs.synonymId;
      const lastTag = inputs.tagsInSynonymGroup.length === 1;
      store.tagsConfig.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction: lastTag ? null : inputs.autocompleteAction });
      await indexeddb.write(store, { tags: apiResponse.tagArchived, noteTags: apiResponse.archivedNoteTags, synonymGroups: apiResponse.archivedSynonymGroups });
      notify.success('Tag archived');
    },
    onClickConfirmArchiveGroup: async () => {
      const response = await archiveGroup({ groupId: inputs.groupId! });
      store.tagsConfig.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      await indexeddb.write(store, { synonymGroups: response.synonymGroupsArchived, groups: response.groupArchived });
      notify.success('Group archived');
    },
    onCancelConfirmation: () => {
      store.tagsConfig.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (inputs.modal) {
        return store.tagsConfig.modal.$set(null);
      }
      store.tagsConfig.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (inputs.groupId === groupId && inputs.modal) {
        return store.tagsConfig.modal.$set(null);
      }
      store.tagsConfig.$patch({
        modal: 'groupOptions',
        groupId,
        tagId: null,
        focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name,
      });
    },
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      setState({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      setState({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      store.tagsConfig.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
    onClickCloseButton: () => {
      inputs.props.onHide();
    },
  };
}
