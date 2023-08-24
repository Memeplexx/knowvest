import { GroupId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { State } from './constants';
import { transact } from 'olik';
import { ancestorMatches } from '@/utils/functions';
import { store } from '@/utils/store';


export const completeCreateTagForSynonym = async (hooks: State) => {
  const { state, notify } = hooks;
  const apiResponse = await trpc.synonym.createTag.mutate({
    text: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
  }
  transact(
    () => store.config.tagId.$set(apiResponse.tagCreated.id),
    () => store.tags.$push(apiResponse.tagCreated),
    () => store.noteTags.$push(apiResponse.noteTagsCreated),
  )
  notify.success('Tag created');
  blurAutocompleteInput(hooks);
}

export const completeCreateTag = async (hooks: State) => {
  const { state, notify } = hooks;
  const apiResponse = await trpc.tag.create.mutate({
    text: state.autocompleteText.trim(),
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
  }
  transact(
    () => store.config.$patch({ synonymId: apiResponse.tagCreated.synonymId, tagId: apiResponse.tagCreated.id }),
    () => store.tags.$push(apiResponse.tagCreated),
    () => store.noteTags.$push(apiResponse.noteTagsCreated),
    () => store.synonymIds.$push(apiResponse.tagCreated.synonymId),
  )
  notify.success('Tag created');
  blurAutocompleteInput(hooks);
}
export const completeCreateTagForGroup = async (hooks: State) => {
  const { state, notify } = hooks;
  if (!state.groupId || !state.synonymId) { return }
  const apiResponse = await trpc.group.createTag.mutate({
    text: state.autocompleteText.trim(),
    groupId: state.groupId,
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
  }
  transact(
    () => store.config.autocompleteText.$set(''),
    () => store.tags.$push(apiResponse.tagCreated),
    () => store.noteTags.$push(apiResponse.noteTagsCreated),
    () => store.synonymGroups.$push(apiResponse.synonymGroupsCreated),
  )
  notify.success('Tag created');
  blurAutocompleteInput(hooks);
}
export const completeCreateGroup = async (hooks: State) => {
  const { state, notify } = hooks;
  if (!state.synonymId) { throw new Error() }
  const apiResponse = await trpc.group.create.mutate({
    name: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.name);
  }
  transact(
    () => store.config.autocompleteText.$set(''),
    () => store.groups.$push(apiResponse.created),
    () => apiResponse.createdSynonymGroup && store.synonymGroups.$push(apiResponse.createdSynonymGroup),
  )
  notify.success('Group created');
  blurAutocompleteInput(hooks);
}
export const completeEditGroupName = async (hooks: State) => {
  const { state, notify } = hooks;
  if (!state.groupId) { throw new Error(); }
  const apiResponse = await trpc.group.update.mutate({
    groupId: state.groupId,
    name: state.focusedGroupNameInputText,
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.name)
    case 'CONFLICT': return notify.error(apiResponse.message)
  }
  store.groups.$find.id.$eq(state.groupId!).$set(apiResponse.updated);
  notify.success('Group updated');
  blurAutocompleteInput(hooks);
}
export const completeEditTag = async (hooks: State) => {
  const { state, notify } = hooks;
  if (!state.tagId) { throw new Error() }
  const apiResponse = await trpc.tag.update.mutate({ tagId: state.tagId, text: state.autocompleteText.trim() })
  switch (apiResponse.status) {
    case 'TAG_UNCHANGED': return notify.info('Tag unchanged')
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
  }
  const activeTagIdsToBeDeselected = apiResponse.noteTagsDeleted.filter(nt => nt.noteId === state.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeDeselected = store.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
  const activeTagIdsToBeSelected = apiResponse.noteTagsCreated.filter(nt => nt.noteId === state.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeSelected = store.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
  const noteIds = apiResponse.noteTagsDeleted.map(nt => nt.noteId)
  const tagIds = apiResponse.noteTagsDeleted.map(nt => nt.tagId);
  transact(
    () => store.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated),
    () => store.noteTags.$filter.noteId.$in(noteIds).$and.tagId.$in(tagIds).$delete(),
    () => store.noteTags.$push(apiResponse.noteTagsCreated),
    () => store.synonymIds.$set([...store.synonymIds.$filter.$ni(activeSynonymIdsToBeDeselected).$state, ...activeSynonymIdsToBeSelected]),
  )
  notify.success('Tag updated');
  blurAutocompleteInput(hooks);
}
export const doCancel = (hooks: State, eventTarget: EventTarget | null) => {
  const { state, props, refs } = hooks;
  if (!props.show) {
    return;
  }
  if (ancestorMatches(eventTarget, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
    return;
  }
  if (state.showAutocompleteOptions) {
    return store.config.showAutocompleteOptions.$set(false);
  }
  if (state.tagId) {
    return store.config.$patch({ tagId: null, autocompleteText: '' });
  }
  if (state.groupSynonymId) {
    return store.config.$patch({ groupSynonymId: null, autocompleteText: '' });
  }
  if (state.modal) {
    return store.config.modal.$set(null);
  }
  if (refs.modal.current?.contains(eventTarget as HTMLElement)) {
    return;
  }
  store.config.$patch({
    tagId: null,
    groupId: null,
    synonymId: null,
    groupSynonymId: null,
    autocompleteAction: null,
    modal: null,
    autocompleteText: '',
  })
  props.onHide();
}
export const onAutocompleteSelectedWhileNothingIsSelected = async (hooks: State, tagId: TagId) => {
  const synonymId = store.tags.$find.id.$eq(tagId).synonymId.$state;
  const autocompleteText = store.tags.$find.id.$eq(tagId).text.$state;
  store.config.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveGroup' });
  focusAutocompleteInput(hooks);
}
export const onAutocompleteSelectedWhileSynonymIsSelected = async (hooks: State, tagId: TagId) => {
  const { state, notify } = hooks;
  if (!state.synonymId) { throw new Error(); }
  const selected = store.tags.$find.id.$eq(tagId).$state;
  const apiResponse = await trpc.synonym.addTag.mutate({ tagId, synonymId: state.synonymId });
  const groupIds = apiResponse.deletedSynonymGroups.map(sg => sg.groupId);
  const synonymIds = apiResponse.deletedSynonymGroups.map(sg => sg.synonymId);
  const synonymId = apiResponse.tagsUpdated[0].synonymId;
  const groupHasMoreThanOneTag = store.tags.$state.some(t => t.synonymId === synonymId && t.id !== tagId);
  const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
  transact(
    () => store.tags.$filter.id.$in(apiResponse.tagsUpdated.map(tu => tu.id)).$set(apiResponse.tagsUpdated),
    () => store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete(),
    () => store.config.$patch({ tagId, synonymId, autocompleteText: selected.text }),
    () => groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms'),
  )
};
export const onAutocompleteSelectedWhileGroupIsSelected = async (hooks: State, tagId: TagId) => {
  const { state, notify } = hooks;
  if (!state.groupId) { throw new Error(); }
  const selected = store.tags.$find.id.$eq(tagId).$state;
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId: state.groupId, synonymId: selected.synonymId });
  transact(
    () => store.config.autocompleteText.$set(''),
    () => store.synonymGroups.$push(apiResponse.created),
  )
  notify.success('Added to group');
};

export const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async (hooks: State, groupId: GroupId) => {
  const { state, notify } = hooks;
  if (!state.synonymId) { throw new Error(); }
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId, synonymId: state.synonymId });
  store.synonymGroups.$push(apiResponse.created);
  notify.success('Added to group');
}

export const focusAutocompleteInput = (state: State) => {
  setTimeout(() => {
    state.refs.autocomplete.current?.focusInput();
  });
}

export const blurAutocompleteInput = (state: State) => {
  setTimeout(() => {
    state.refs.autocomplete.current?.blurInput();
  });
}

