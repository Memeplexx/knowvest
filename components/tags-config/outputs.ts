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
  const { state, notify, refs, props, store } = inputs;
  return {
    onCustomGroupNameFocus: (groupId: GroupId) => {
      store.config.$patch({
        groupId,
        groupSynonymId: null,
        focusedGroupNameInputText: store.$state.groups.findOrThrow(g => g.id === groupId).name,
      });
    },
    onCustomGroupNameBlur: (groupId: GroupId) => {
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
    onClickTagSynonym: (event: MouseEvent<HTMLElement>, tagId: TagId) => {
      event.stopPropagation();
      if (state.tagId === tagId) {
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
    onClickGroupSynonym: (event: MouseEvent<HTMLElement>, groupId: GroupId, groupSynonymId: SynonymId) => {
      event.stopPropagation();
      if (state.groupId === groupId && state.groupSynonymId === groupSynonymId) {
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
      if (!state.tagId) { return; }
      const apiResponse = await trpc.synonym.removeTagFromItsCurrentSynonym.mutate({ tagId: state.tagId });
      const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
      const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
      store.config.$patch({ tagId: null, autocompleteText: '' });
      store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete();
      store.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated);
      notify.success('Tag removed from synonyms');
    },
    onClickRemoveSynonymFromCustomGroup: async () => {
      if (!state.groupSynonymId) { return; }
      const response = await trpc.group.removeSynonym.mutate({ groupId: state.groupId!, synonymId: state.groupSynonymId });
      response.deletedGroup && store.groups
        .$find.id.$eq(response.deletedGroup.id)
        .$delete();
      store.synonymGroups
        .$filter.groupId.$eq(response.deletedSynonymGroup.groupId).$and.synonymId.$eq(response.deletedSynonymGroup.synonymId)
        .$delete();
      store.config
        .$patch({ tagId: null, groupId: null, groupSynonymId: null });
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
      if (!state.synonymId) {
        await completeCreateTag(inputs)
      } else if (state.tagId) {
        await completeEditTag(inputs)
      } else if (state.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await completeCreateTagForSynonym(inputs)
      } else if (state.autocompleteAction === 'addSynonymsToActiveGroup') {
        await completeCreateTagForGroup(inputs)
      } else if (state.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await completeCreateGroup(inputs)
      }
    },
    onAutocompleteInputChange: (value: string) => {
      store.config.autocompleteText.$set(value);
    },
    onAutocompleteInputFocused: () => {
      if (!state.tagId && !state.showAutocompleteOptions) {
        store.config.showAutocompleteOptions.$set(true);
      }
    },
    onAutocompleteInputCancel: () => {
      const autocompleteText = !state.tagId ? '' : store.$state.tags.findOrThrow(t => t.id === state.tagId).text;
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
      const { groupId, groupSynonymId } = state;
      if (!groupId || !groupSynonymId) { throw new Error(); }
      const synonymId = store.$state.synonymGroups
        .findOrThrow(sg => sg.groupId === groupId && sg.synonymId === groupSynonymId)
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
      if (state.autocompleteAction === 'addActiveSynonymsToAGroup') {
        await onAutocompleteSelectedWhileAddActiveSynonymsToGroup({ inputs, groupId: id as GroupId });
      } else if (state.autocompleteAction === 'addSynonymsToActiveSynonyms') {
        await onAutocompleteSelectedWhileSynonymIsSelected({ inputs, tagId: id as TagId });
      } else if (state.autocompleteAction === 'addSynonymsToActiveGroup') {
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
        refs.autocomplete.current?.blurInput();
        if (state.showAutocompleteOptions) {
          store.config.showAutocompleteOptions.$set(false)
        }
        return;
      }
      doCancel(inputs, event.target);
    }),
    onClickDialogBody: (event: MouseEvent) => {
      event.stopPropagation();
      if (state.modal) {
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
    onClickConfirmDeleteTag: async () => {
      const apiResponse = await trpc.tag.delete.mutate({ tagId: state.tagId! });
      const tagIds = apiResponse.noteTagsDeleted.map(nt => nt.tagId);
      const noteIds = apiResponse.noteTagsDeleted.map(nt => nt.noteId);
      const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
      const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
      const synonymId = state.tagsInSynonymGroup.length === 1 ? null : state.synonymId;
      const lastTag = state.tagsInSynonymGroup.length === 1;
      store.config.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null, autocompleteAction: lastTag ? null : store.$state.config.autocompleteAction });
      store.tags.$find.id.$eq(apiResponse.tagDeleted.id).$delete();
      store.noteTags.$filter.tagId.$in(tagIds).$and.noteId.$in(noteIds).$delete();
      store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete();
      notify.success('Tag deleted');
    },
    onClickConfirmDeleteGroup: async () => {
      const response = await trpc.group.delete.mutate({ groupId: state.groupId! });
      store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null });
      store.synonymGroups.$filter.groupId.$eq(response.groupDeleted.id).$delete();
      store.groups.$filter.id.$eq(response.groupDeleted.id).$delete();
      notify.success('Group deleted');
    },
    onCancelConfirmation: () => {
      store.config.modal.$set(null);
    },
    onClickShowOptionsForSynonyms: () => {
      if (state.modal) {
        return store.config.modal.$set(null);
      }
      store.config.$patch({
        modal: 'synonymOptions',
        groupId: null,
        groupSynonymId: null,
      })
    },
    onClickShowOptionsForGroup: (groupId: GroupId) => {
      if (state.groupId === groupId && state.modal) {
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
    onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
      store.config.$patch({ hoveringGroupId, hoveringSynonymId });
    },
    onMouseOutGroupTag: () => {
      store.config.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
    },
    onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
      store.config.showAutocompleteOptions.$set(showAutocompleteOptions)
    },
    onClickCloseButton: () => {
      props.onHide();
    },
  };
}
