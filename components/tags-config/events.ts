import { useEventHandlerForDocument } from '@/utils/hooks';

import {
  blurAutocompleteInput,
  completeCreateGroup,
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
} from './functions';
import { useHooks } from './hooks';
import { GroupId, SynonymId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { transact } from 'olik';
import { ChangeEvent, MouseEvent } from 'react';
import { TypedKeyboardEvent } from '@/utils/types';


export const useEvents = (state: ReturnType<typeof useHooks>) => ({
  onCustomGroupNameFocus: (groupId: GroupId) => {
    state.store.$patch({
      groupId,
      groupSynonymId: null,
      focusedGroupNameInputText: state.appStore.groups.$find.id.$eq(groupId).name.$state,
    });
  },
  onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await completeEditGroupName(state);
    } else if (event.key === 'Escape') {
      event.target.blur();
      event.stopPropagation();
      state.store.groupId.$set(null);
    }
  },
  onCustomGroupNameChange: (event: ChangeEvent<HTMLInputElement>) => {
    state.store.focusedGroupNameInputText.$set(event.target.value);
  },
  onClickHideOptionsForSynonyms: () => {
    state.store.modal.$set(null);
  },
  onClickHideOptionsForGroup: () => {
    state.store.modal.$set(null);
  },
  onClickTagSynonym: (event: MouseEvent<HTMLElement>, tagId: TagId) => {
    event.stopPropagation();
    if (state.tagId === tagId) {
      return state.store.$patch({
        tagId: null,
        autocompleteText: '',
        groupSynonymId: null,
      })
    }
    state.store.$patch({
      tagId,
      groupId: null,
      autocompleteText: state.appStore.tags.$find.id.$eq(tagId).text.$state,
      groupSynonymId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickGroupSynonym: (event: MouseEvent<HTMLElement>, groupId: GroupId, groupSynonymId: SynonymId) => {
    event.stopPropagation();
    if (state.groupId === groupId && state.groupSynonymId === groupSynonymId) {
      return state.store.groupSynonymId.$set(null);
    }
    state.store.$patch({
      tagId: null,
      groupId,
      groupSynonymId,
      autocompleteText: '',
      focusedGroupNameInputText: state.appStore.groups.$find.id.$eq(groupId).name.$state,
    });
  },
  onClickRemoveTagFromSynonyms: async () => {
    if (!state.tagId) { return; }
    const apiResponse = await trpc.synonym.removeTagFromItsCurrentSynonym.mutate({ tagId: state.tagId });
    const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
    const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
    transact(
      () => state.store.$patch({ tagId: null, autocompleteText: '' }),
      () => state.appStore.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
      () => state.appStore.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated),
    )
    state.notifySuccess('Tag removed from synonyms');
  },
  onClickRemoveSynonymFromCustomGroup: async () => {
    if (!state.groupSynonymId) { return; }
    const response = await trpc.group.removeSynonym.mutate({ groupId: state.groupId!, synonymId: state.groupSynonymId });
    transact(
      () => response.deletedGroup && state.appStore.groups.$find.id.$eq(response.deletedGroup.id).$delete(),
      () => state.appStore.synonymGroups.$filter.groupId.$eq(response.deletedSynonymGroup.groupId).$and.synonymId.$eq(response.deletedSynonymGroup.synonymId).$delete(),
      () => state.store.$patch({ tagId: null, groupId: null, groupSynonymId: null }),
    )
    state.notifySuccess('Tag-Synonym removed from group');
  },
  onClickDeleteTag: (event: MouseEvent) => {
    event.stopPropagation();
    state.store.modal.$set('confirmDeleteTag');
  },
  onClickEnterEditTextMode: () => {
    focusAutocompleteInput(state);
  },
  onAutocompleteInputEnter: async () => {
    if (state.tagId) {
      await completeEditTag(state)
    } else if (state.autocompleteAction === 'addSynonymsToActiveSynonyms') {
      await completeCreateTagForSynonym(state)
    } else if (state.autocompleteAction === 'addSynonymsToActiveGroup') {
      await completeCreateTagForGroup(state)
    } else if (state.autocompleteAction === 'addActiveSynonymsToAGroup') {
      await completeCreateGroup(state)
    }
  },
  onAutocompleteInputChange: (value: string) => {
    state.store.autocompleteText.$set(value);
  },
  onAutocompleteInputFocused: () => {
    if (!state.tagId && !state.groupSynonymId && !state.showAutocompleteOptions) {
      state.store.showAutocompleteOptions.$set(true);
    }
  },
  onAutocompleteInputCancel: () => {
    const autocompleteText = !state.tagId ? '' : state.appStore.tags.$find.id.$eq(state.tagId).text.$state
    state.store.autocompleteText.$set(autocompleteText);
    blurAutocompleteInput(state);
  },
  onClickAddNewTagToSynonymGroup: () => {
    state.store.$patch({
      autocompleteAction: 'addSynonymsToActiveSynonyms',
      autocompleteText: '',
      tagId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickAddCurrentSynonymsToExistingGroup: () => {
    state.store.$patch({
      autocompleteAction: 'addActiveSynonymsToAGroup',
      autocompleteText: '',
      tagId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickAddSynonymToCustomGroup: () => {
    state.store.$patch({
      autocompleteAction: 'addSynonymsToActiveGroup',
      autocompleteText: '',
    });
    focusAutocompleteInput(state);
  },
  onClickUpdateGroupSynonym: () => {
    if (!state.groupId || !state.groupSynonymId) { throw new Error(); }
    const selectedSynonymId = state.appStore.synonymGroups.$find.groupId.$eq(state.groupId).$and.synonymId.$eq(state.groupSynonymId).synonymId.$state;
    state.store.$patch({
      tagId: null,
      groupId: null,
      synonymId: selectedSynonymId,
      groupSynonymId: null,
      autocompleteAction: 'addSynonymsToActiveSynonyms',
    });
  },
  onClickStartOver: (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    state.store.$patch({
      tagId: null,
      groupId: null,
      synonymId: null,
      modal: null,
      autocompleteText: '',
      groupSynonymId: null,
      autocompleteAction: null,
      focusedGroupNameInputText: '',
    });
    focusAutocompleteInput(state);
  },
  onClickDeleteGroup: (event: MouseEvent) => {
    event.stopPropagation();
    state.store.modal.$set('confirmDeleteGroup');
  },
  onAutocompleteSelected: async (id: TagId | GroupId | null) => {
    if (state.autocompleteAction === 'addActiveSynonymsToAGroup') {
      await onAutocompleteSelectedWhileAddActiveSynonymsToGroup(state, id as GroupId);
    } else if (state.autocompleteAction === 'addSynonymsToActiveSynonyms') {
      await onAutocompleteSelectedWhileSynonymIsSelected(state, id as TagId);
    } else if (state.autocompleteAction === 'addSynonymsToActiveGroup') {
      await onAutocompleteSelectedWhileGroupIsSelected(state, id as TagId);
    } else {
      await onAutocompleteSelectedWhileNothingIsSelected(state, id as TagId);
    }
  },
  onClickRenameTag: () => {
    focusAutocompleteInput(state);
  },
  onClickDocument: useEventHandlerForDocument('click', event => {
    doCancel(state, event.target);
  }),
  onDocumentKeyup: useEventHandlerForDocument('keyup', event => {
    if (event.key !== 'Escape') {
      return;
    }
    if ((event.target as HTMLElement).tagName === 'INPUT') {
      state.autocompleteRef.current?.blurInput();
      if (state.showAutocompleteOptions) {
        state.store.showAutocompleteOptions.$set(false)
      }
      return;
    }
    doCancel(state, event.target);
  }),
  onClickDialogBody: (event: MouseEvent) => {
    event.stopPropagation();
    if (state.modal) {
      return state.store.modal.$set(null);
    }
    state.store.$patch({
      tagId: null,
      groupId: null,
      autocompleteText: '',
      focusedGroupNameInputText: '',
    })
    blurAutocompleteInput(state);
  },
  onClickConfirmDeleteTag: async () => {
    const apiResponse = await trpc.tag.delete.mutate({ tagId: state.tagId! });
    const tagIds = apiResponse.noteTagsDeleted.map(nt => nt.tagId);
    const noteIds = apiResponse.noteTagsDeleted.map(nt => nt.noteId);
    const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
    const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
    const synonymId = state.tagsInSynonymGroup.length === 1 ? null : state.synonymId;
    transact(
      () => state.store.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null }),
      () => state.appStore.tags.$find.id.$eq(apiResponse.tagDeleted.id).$delete(),
      () => state.appStore.noteTags.$filter.tagId.$in(tagIds).$and.noteId.$in(noteIds).$delete(),
      () => state.appStore.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
    )
    state.notifySuccess('Tag deleted');
  },
  onClickConfirmDeleteGroup: async () => {
    const response = await trpc.group.delete.mutate({ groupId: state.groupId! });
    transact(
      () => state.store.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null }),
      () => state.appStore.synonymGroups.$filter.groupId.$eq(response.groupDeleted.id).$delete(),
      () => state.appStore.groups.$filter.id.$eq(response.groupDeleted.id).$delete(),
    )
    state.notifySuccess('Group deleted');
  },
  onCancelConfirmation: () => {
    state.store.modal.$set(null);
  },
  onClickShowOptionsForSynonyms: () => {
    if (state.modal) {
      return state.store.modal.$set(null);
    }
    state.store.$patch({
      modal: 'synonymOptions',
      groupId: null,
      groupSynonymId: null,
    })
  },
  onClickShowOptionsForGroup: (groupId: GroupId) => {
    if (state.groupId === groupId && state.modal) {
      return state.store.modal.$set(null);
    }
    state.store.$patch({
      modal: 'groupOptions',
      groupId,
      tagId: null,
      focusedGroupNameInputText: state.appStore.groups.$find.id.$eq(groupId).name.$state,
    });
  },
  onMouseOverGroupTag: (hoveringGroupId: GroupId, hoveringSynonymId: SynonymId) => {
    state.store.$patch({ hoveringGroupId, hoveringSynonymId });
  },
  onMouseOutGroupTag: () => {
    state.store.$patch({ hoveringGroupId: null, hoveringSynonymId: null });
  },
  onShowAutocompleteOptionsChange: (showAutocompleteOptions: boolean) => {
    state.store.showAutocompleteOptions.$set(showAutocompleteOptions)
  },
})
