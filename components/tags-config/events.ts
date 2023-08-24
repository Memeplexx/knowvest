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
} from './functions';
import { useHooks } from './hooks';
import { GroupId, SynonymId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { transact } from 'olik';
import { ChangeEvent, MouseEvent } from 'react';
import { TypedKeyboardEvent } from '@/utils/types';
import { store } from '@/utils/store';


export const useEvents = (state: ReturnType<typeof useHooks>) => ({
  onCustomGroupNameFocus: (groupId: GroupId) => {
    store.config.$patch({
      groupId,
      groupSynonymId: null,
      focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name.$state,
    });
  },
  onCustomGroupNameKeyUp: async (event: TypedKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await completeEditGroupName(state);
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
      autocompleteText: store.tags.$find.id.$eq(tagId).text.$state,
      groupSynonymId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickGroupSynonym: (event: MouseEvent<HTMLElement>, groupId: GroupId, groupSynonymId: SynonymId) => {
    event.stopPropagation();
    if (state.groupId === groupId && state.groupSynonymId === groupSynonymId) {
      return store.config.groupSynonymId.$set(null);
    }
    store.config.$patch({
      tagId: null,
      groupId,
      groupSynonymId,
      autocompleteText: '',
      focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name.$state,
    });
  },
  onClickRemoveTagFromSynonyms: async () => {
    if (!state.tagId) { return; }
    const apiResponse = await trpc.synonym.removeTagFromItsCurrentSynonym.mutate({ tagId: state.tagId });
    const groupIds = apiResponse.deletedSynonymGroups.map(nt => nt.groupId);
    const synonymIds = apiResponse.deletedSynonymGroups.map(nt => nt.synonymId);
    transact(
      () => store.config.$patch({ tagId: null, autocompleteText: '' }),
      () => store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
      () => store.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated),
    )
    state.notify.success('Tag removed from synonyms');
  },
  onClickRemoveSynonymFromCustomGroup: async () => {
    if (!state.groupSynonymId) { return; }
    const response = await trpc.group.removeSynonym.mutate({ groupId: state.groupId!, synonymId: state.groupSynonymId });
    transact(
      () => response.deletedGroup && store.groups.$find.id.$eq(response.deletedGroup.id).$delete(),
      () => store.synonymGroups.$filter.groupId.$eq(response.deletedSynonymGroup.groupId).$and.synonymId.$eq(response.deletedSynonymGroup.synonymId).$delete(),
      () => store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null }),
    )
    state.notify.success('Tag-Synonym removed from group');
  },
  onClickDeleteTag: (event: MouseEvent) => {
    event.stopPropagation();
    store.config.modal.$set('confirmDeleteTag');
  },
  onClickEnterEditTextMode: () => {
    focusAutocompleteInput(state);
  },
  onAutocompleteInputEnter: async () => {
    if (!state.synonymId) {
      await completeCreateTag(state)
    } else if (state.tagId) {
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
    store.config.autocompleteText.$set(value);
  },
  onAutocompleteInputFocused: () => {
    if (!state.tagId && !state.groupSynonymId && !state.showAutocompleteOptions) {
      store.config.showAutocompleteOptions.$set(true);
    }
  },
  onAutocompleteInputCancel: () => {
    const autocompleteText = !state.tagId ? '' : store.tags.$find.id.$eq(state.tagId).text.$state
    store.config.autocompleteText.$set(autocompleteText);
    blurAutocompleteInput(state);
  },
  onClickAddNewTagToSynonymGroup: () => {
    store.config.$patch({
      autocompleteAction: 'addSynonymsToActiveSynonyms',
      autocompleteText: '',
      tagId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickAddCurrentSynonymsToExistingGroup: () => {
    store.config.$patch({
      autocompleteAction: 'addActiveSynonymsToAGroup',
      autocompleteText: '',
      tagId: null,
    });
    focusAutocompleteInput(state);
  },
  onClickAddSynonymToCustomGroup: () => {
    store.config.$patch({
      autocompleteAction: 'addSynonymsToActiveGroup',
      autocompleteText: '',
    });
    focusAutocompleteInput(state);
  },
  onClickUpdateGroupSynonym: () => {
    if (!state.groupId || !state.groupSynonymId) { throw new Error(); }
    const selectedSynonymId = store.synonymGroups.$find.groupId.$eq(state.groupId).$and.synonymId.$eq(state.groupSynonymId).synonymId.$state;
    store.config.$patch({
      tagId: null,
      groupId: null,
      synonymId: selectedSynonymId,
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
    focusAutocompleteInput(state);
  },
  onClickDeleteGroup: (event: MouseEvent) => {
    event.stopPropagation();
    store.config.modal.$set('confirmDeleteGroup');
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
        store.config.showAutocompleteOptions.$set(false)
      }
      return;
    }
    doCancel(state, event.target);
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
      () => store.config.$patch({ tagId: null, synonymId, autocompleteText: '', modal: null }),
      () => store.tags.$find.id.$eq(apiResponse.tagDeleted.id).$delete(),
      () => store.noteTags.$filter.tagId.$in(tagIds).$and.noteId.$in(noteIds).$delete(),
      () => store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
    )
    state.notify.success('Tag deleted');
  },
  onClickConfirmDeleteGroup: async () => {
    const response = await trpc.group.delete.mutate({ groupId: state.groupId! });
    transact(
      () => store.config.$patch({ tagId: null, groupId: null, groupSynonymId: null, autocompleteText: '', modal: null }),
      () => store.synonymGroups.$filter.groupId.$eq(response.groupDeleted.id).$delete(),
      () => store.groups.$filter.id.$eq(response.groupDeleted.id).$delete(),
    )
    state.notify.success('Group deleted');
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
    store.config.$patch({
      modal: 'groupOptions',
      groupId,
      tagId: null,
      focusedGroupNameInputText: store.groups.$find.id.$eq(groupId).name.$state,
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
})
