import { GroupId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { State } from './constants';
import { transact } from 'olik';
import { ancestorMatches } from '@/utils/functions';


export const completeCreateTagForSynonym = async (state: State) => {
  const apiResponse = await trpc.synonym.createTag.mutate({
    text: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.text);
  }
  const tagIds = apiResponse.noteTagsCreated.filter(nt => nt.noteId === state.activeNoteId).map(nt => nt.tagId).distinct();
  const synonymIds = state.appStore.$state.tags.filter(t => tagIds.includes(t.id)).map(t => t.synonymId);
  transact(
    () => state.store.$patch({ synonymId: apiResponse.tagCreated.synonymId, tagId: apiResponse.tagCreated.id }),
    () => state.appStore.tags.$push(apiResponse.tagCreated),
    () => state.appStore.noteTags.$push(apiResponse.noteTagsCreated),
    () => state.appStore.synonymIds.$push(synonymIds),
  )
  state.notifySuccess('Tag created');
  blurAutocompleteInput(state);
}
export const completeCreateTagForGroup = async (state: State) => {
  if (!state.groupId || !state.synonymId) { return }
  const apiResponse = await trpc.group.createTag.mutate({
    text: state.autocompleteText.trim(),
    groupId: state.groupId,
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.text)
  }
  transact(
    () => state.store.autocompleteText.$set(''),
    () => state.appStore.tags.$push(apiResponse.tagCreated),
    () => state.appStore.noteTags.$push(apiResponse.noteTagsCreated),
    () => state.appStore.synonymGroups.$push(apiResponse.synonymGroupsCreated),
  )
  state.notifySuccess('Tag created');
  blurAutocompleteInput(state);
}
export const completeCreateGroup = async (state: State) => {
  if (!state.synonymId) { throw new Error() }
  const apiResponse = await trpc.group.create.mutate({
    name: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.name);
  }
  transact(
    () => state.store.autocompleteText.$set(''),
    () => state.appStore.groups.$push(apiResponse.created),
    () => apiResponse.createdSynonymGroup && state.appStore.synonymGroups.$push(apiResponse.createdSynonymGroup),
  )
  state.notifySuccess('Group created');
  blurAutocompleteInput(state);
}
export const completeEditGroupName = async (state: State) => {
  if (!state.groupId) { throw new Error(); }
  const apiResponse = await trpc.group.update.mutate({
    groupId: state.groupId,
    name: state.focusedGroupNameInputText,
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.name)
    case 'CONFLICT': return state.notifyError(apiResponse.message)
  }
  state.appStore.groups.$find.id.$eq(state.groupId!).$set(apiResponse.updated);
  state.notifySuccess('Group updated');
  blurAutocompleteInput(state);
}
export const completeEditTag = async (state: State) => {
  if (!state.tagId) { throw new Error() }
  const apiResponse = await trpc.tag.update.mutate({ tagId: state.tagId, text: state.autocompleteText.trim() })
  switch (apiResponse.status) {
    case 'TAG_UNCHANGED': return state.notifyInfo('Tag unchanged')
    case 'BAD_REQUEST': return state.notifyError(apiResponse.fields.text)
  }
  const activeTagIdsToBeDeselected = apiResponse.noteTagsDeleted.filter(nt => nt.noteId === state.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeDeselected = state.appStore.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
  const activeTagIdsToBeSelected = apiResponse.noteTagsCreated.filter(nt => nt.noteId === state.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeSelected = state.appStore.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
  const noteIds = apiResponse.noteTagsDeleted.map(nt => nt.noteId)
  const tagIds = apiResponse.noteTagsDeleted.map(nt => nt.tagId);
  transact(
    () => state.appStore.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated),
    () => state.appStore.noteTags.$filter.noteId.$in(noteIds).$and.tagId.$in(tagIds).$delete(),
    () => state.appStore.noteTags.$push(apiResponse.noteTagsCreated),
    () => state.appStore.synonymIds.$set([...state.appStore.synonymIds.$filter.$ni(activeSynonymIdsToBeDeselected).$state, ...activeSynonymIdsToBeSelected]),
  )
  state.notifySuccess('Tag updated');
  blurAutocompleteInput(state);
}
export const doCancel = (state: State, eventTarget: EventTarget | null) => {
  if (!state.props.show) {
    return;
  }
  if (ancestorMatches(eventTarget, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
    return;
  }
  if (state.showAutocompleteOptions) {
    return state.store.showAutocompleteOptions.$set(false);
  }
  if (state.tagId) {
    return state.store.$patch({ tagId: null, autocompleteText: '' });
  }
  if (state.groupSynonymId) {
    return state.store.$patch({ groupSynonymId: null, autocompleteText: '' });
  }
  if (state.modal) {
    return state.store.modal.$set(null);
  }
  if (state.modalRef.current?.contains(eventTarget as HTMLElement)) {
    return;
  }
  state.store.$patch({
    tagId: null,
    groupId: null,
    synonymId: null,
    groupSynonymId: null,
    autocompleteAction: null,
    modal: null,
    autocompleteText: '',
  })
  state.props.onHide();
}
export const onAutocompleteSelectedWhileNothingIsSelected = async (state: State, tagId: TagId) => {
  const synonymId = state.appStore.tags.$find.id.$eq(tagId).synonymId.$state;
  const autocompleteText = state.appStore.tags.$find.id.$eq(tagId).text.$state;
  state.store.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveGroup' });
  focusAutocompleteInput(state);
}
export const onAutocompleteSelectedWhileSynonymIsSelected = async (state: State, tagId: TagId) => {
  if (!state.synonymId) { throw new Error(); }
  const selected = state.appStore.tags.$find.id.$eq(tagId).$state;
  const apiResponse = await trpc.synonym.addTag.mutate({ tagId, synonymId: state.synonymId });
  const groupIds = apiResponse.deletedSynonymGroups.map(sg => sg.groupId);
  const synonymIds = apiResponse.deletedSynonymGroups.map(sg => sg.synonymId);
  const synonymId = apiResponse.tagsUpdated[0].synonymId;
  const groupHasMoreThanOneTag = state.appStore.tags.$state.some(t => t.synonymId === synonymId && t.id !== tagId);
  const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
  transact(
    () => state.appStore.tags.$filter.id.$in(apiResponse.tagsUpdated.map(tu => tu.id)).$set(apiResponse.tagsUpdated),
    () => state.appStore.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
    () => state.store.$patch({ tagId, synonymId, autocompleteText: selected.text }),
    () => groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && state.notifySuccess('Tag(s) added to synonyms'),
  )
};
export const onAutocompleteSelectedWhileGroupIsSelected = async (state: State, tagId: TagId) => {
  if (!state.groupId) { throw new Error(); }
  const selected = state.appStore.tags.$find.id.$eq(tagId).$state;
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId: state.groupId, synonymId: selected.synonymId });
  transact(
    () => state.store.autocompleteText.$set(''),
    () => state.appStore.synonymGroups.$push(apiResponse.created),
  )
  state.notifySuccess('Added to group');
};

export const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async (state: State, groupId: GroupId) => {
  if (!state.synonymId) { throw new Error(); }
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId, synonymId: state.synonymId });
  state.appStore.synonymGroups.$push(apiResponse.created);
  state.notifySuccess('Added to group');
}

export const focusAutocompleteInput = (state: State) => {
  setTimeout(() => {
    state.autocompleteRef.current?.focusInput();
  });
}

export const blurAutocompleteInput = (state: State) => {
  setTimeout(() => {
    state.autocompleteRef.current?.blurInput();
  });
}

