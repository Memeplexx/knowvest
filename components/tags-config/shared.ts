import { GroupId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { Inputs } from './constants';
import { transact } from 'olik';
import { ancestorMatches } from '@/utils/functions';
import { store } from '@/utils/store';


export const completeCreateTagForSynonym = async (inputs: Inputs) => {
  const { state, notify } = inputs;
  const apiResponse = await trpc.synonym.createTag.mutate({
    text: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
  }
  transact(() => {
    store.config.tagId.$set(apiResponse.tagCreated.id);
    store.tags.$push(apiResponse.tagCreated);
    store.noteTags.$push(apiResponse.noteTagsCreated);
  })
  notify.success('Tag created');
  blurAutocompleteInput(inputs);
}

export const completeCreateTag = async (inputs: Inputs) => {
  const { state, notify } = inputs;
  const apiResponse = await trpc.tag.create.mutate({
    text: state.autocompleteText.trim(),
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
  }
  transact(() => {
    store.config.$patch({ synonymId: apiResponse.tagCreated.synonymId, tagId: apiResponse.tagCreated.id });
    store.tags.$push(apiResponse.tagCreated);
    store.noteTags.$push(apiResponse.noteTagsCreated);
    store.synonymIds.$push(apiResponse.tagCreated.synonymId);
  })
  notify.success('Tag created');
  blurAutocompleteInput(inputs);
}
export const completeCreateTagForGroup = async (inputs: Inputs) => {
  const { state, notify } = inputs;
  if (!state.groupId || !state.synonymId) { return }
  const apiResponse = await trpc.group.createTag.mutate({
    text: state.autocompleteText.trim(),
    groupId: state.groupId,
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
  }
  transact(() => {
    store.config.autocompleteText.$set('');
    store.tags.$push(apiResponse.tagCreated);
    store.noteTags.$push(apiResponse.noteTagsCreated);
    store.synonymGroups.$push(apiResponse.synonymGroupsCreated);
  })
  notify.success('Tag created');
  blurAutocompleteInput(inputs);
}
export const completeCreateGroup = async (inputs: Inputs) => {
  const { state, notify } = inputs;
  if (!state.synonymId) { throw new Error() }
  const apiResponse = await trpc.group.create.mutate({
    name: state.autocompleteText.trim(),
    synonymId: state.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return notify.error(apiResponse.fields.name);
  }
  transact(() => {
    store.config.autocompleteText.$set('');
    store.groups.$push(apiResponse.created);
    apiResponse.createdSynonymGroup && store.synonymGroups.$push(apiResponse.createdSynonymGroup);
  })
  notify.success('Group created');
  blurAutocompleteInput(inputs);
}
export const completeEditGroupName = async (inputs: Inputs) => {
  const { state, notify } = inputs;
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
  blurAutocompleteInput(inputs);
}
export const completeEditTag = async (inputs: Inputs) => {
  const { state, notify } = inputs;
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
  transact(() => {
    store.tags.$find.id.$eq(apiResponse.tagUpdated.id).$set(apiResponse.tagUpdated);
    store.noteTags.$filter.noteId.$in(noteIds).$and.tagId.$in(tagIds).$delete();
    store.noteTags.$push(apiResponse.noteTagsCreated);
    store.synonymIds.$set([...store.$state.synonymIds.filter(id => !activeSynonymIdsToBeDeselected.includes(id)), ...activeSynonymIdsToBeSelected]);
  })
  notify.success('Tag updated');
  blurAutocompleteInput(inputs);
}
export const doCancel = (inputs: Inputs, eventTarget: EventTarget | null) => {
  const { state, props, refs } = inputs;
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
export const onAutocompleteSelectedWhileNothingIsSelected = async (inputs: Inputs, tagId: TagId) => {
  const synonymId = store.$state.tags.findOrThrow(t => t.id === tagId).synonymId;
  const autocompleteText = store.$state.tags.findOrThrow(t => t.id === tagId).text;
  store.config.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveGroup' });
  focusAutocompleteInput(inputs);
}
export const onAutocompleteSelectedWhileSynonymIsSelected = async (inputs: Inputs, tagId: TagId) => {
  const { state, notify } = inputs;
  if (!state.synonymId) { throw new Error(); }
  const selected = store.$state.tags.findOrThrow(t => t.id === tagId);
  const apiResponse = await trpc.synonym.addTag.mutate({ tagId, synonymId: state.synonymId });
  const groupIds = apiResponse.deletedSynonymGroups.map(sg => sg.groupId);
  const synonymIds = apiResponse.deletedSynonymGroups.map(sg => sg.synonymId);
  const synonymId = apiResponse.tagsUpdated[0].synonymId;
  const groupHasMoreThanOneTag = store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
  const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
  transact(() => {
    store.tags.$filter.id.$in(apiResponse.tagsUpdated.map(tu => tu.id)).$set(apiResponse.tagsUpdated);
    store.synonymGroups.$filter.groupId.$in(groupIds).$and.synonymId.$in(synonymIds).$delete();
    store.config.$patch({ tagId, synonymId, autocompleteText: selected.text });
    groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms');
  })
};
export const onAutocompleteSelectedWhileGroupIsSelected = async (inputs: Inputs, tagId: TagId) => {
  const { state, notify } = inputs;
  if (!state.groupId) { throw new Error(); }
  const { synonymId } = store.$state.tags.findOrThrow(t => t.id === tagId);
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId: state.groupId, synonymId });
  transact(() => {
    store.config.autocompleteText.$set('');
    store.synonymGroups.$push(apiResponse.created);
  })
  notify.success('Added to group');
};

export const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async (inputs: Inputs, groupId: GroupId) => {
  const { state, notify } = inputs;
  if (!state.synonymId) { throw new Error(); }
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId, synonymId: state.synonymId });
  store.synonymGroups.$push(apiResponse.created);
  notify.success('Added to group');
}

export const focusAutocompleteInput = (inputs: Inputs) => {
  setTimeout(() => {
    inputs.refs.autocomplete.current?.focusInput();
  });
}

export const blurAutocompleteInput = (inputs: Inputs) => {
  setTimeout(() => {
    inputs.refs.autocomplete.current?.blurInput();
  });
}

