import { GroupId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { Inputs } from './constants';
import { ancestorMatches } from '@/utils/functions';
import { indexeddb } from '@/utils/indexed-db';


export const completeCreateTagForSynonym = async (inputs: Inputs) => {
  const apiResponse = await trpc.synonym.createTag.mutate({
    text: inputs.autocompleteText.trim(),
    synonymId: inputs.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.text);
  }
  inputs.store.config.tagId.$set(apiResponse.tag.id);
  inputs.store.tags.$mergeMatching.id.$withOne(apiResponse.tag);
  inputs.store.noteTags.$mergeMatching.id.$withMany(apiResponse.noteTags);
  await indexeddb.write({ tags: apiResponse.tag, noteTags: apiResponse.noteTags });
  inputs.notify.success('Tag created');
  blurAutocompleteInput(inputs);
}

export const completeCreateTag = async (inputs: Inputs) => {
  const apiResponse = await trpc.tag.create.mutate({
    text: inputs.autocompleteText.trim(),
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.text);
  }
  inputs.store.config.$patch({ synonymId: apiResponse.tag.synonymId, tagId: apiResponse.tag.id });
  inputs.store.tags.$push(apiResponse.tag);
  inputs.store.noteTags.$push(apiResponse.noteTags);
  inputs.store.synonymIds.$push(apiResponse.tag.synonymId);
  await indexeddb.write({ tags: apiResponse.tag, noteTags: apiResponse.noteTags });
  inputs.notify.success('Tag created');
  blurAutocompleteInput(inputs);
}
export const completeCreateTagForGroup = async (inputs: Inputs) => {
  if (!inputs.groupId || !inputs.synonymId) { return }
  const apiResponse = await trpc.group.createTag.mutate({
    text: inputs.autocompleteText.trim(),
    groupId: inputs.groupId,
    synonymId: inputs.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.text)
  }
  inputs.store.config.autocompleteText.$set('');
  inputs.store.tags.$mergeMatching.id.$withOne(apiResponse.tag);
  inputs.store.noteTags.$mergeMatching.id.$withMany(apiResponse.noteTags);
  inputs.store.synonymGroups.$mergeMatching.id.$withOne(apiResponse.synonymGroup);
  await indexeddb.write({ tags: apiResponse.tag, noteTags: apiResponse.noteTags, synonymGroups: apiResponse.synonymGroup });
  inputs.notify.success('Tag created');
  blurAutocompleteInput(inputs);
}
export const completeCreateGroup = async (inputs: Inputs) => {
  if (!inputs.synonymId) { throw new Error() }
  const apiResponse = await trpc.group.create.mutate({
    name: inputs.autocompleteText.trim(),
    synonymId: inputs.synonymId
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.name);
  }
  inputs.store.config.autocompleteText.$set('');
  inputs.store.groups.$push(apiResponse.createdGroup);
  apiResponse.createdSynonymGroup && inputs.store.synonymGroups.$push(apiResponse.createdSynonymGroup);
  await indexeddb.write({ groups: apiResponse.createdGroup, synonymGroups: apiResponse.createdSynonymGroup });
  inputs.notify.success('Group created');
  blurAutocompleteInput(inputs);
}
export const completeEditGroupName = async (inputs: Inputs) => {
  if (!inputs.groupId) { throw new Error(); }
  const apiResponse = await trpc.group.update.mutate({
    groupId: inputs.groupId,
    name: inputs.focusedGroupNameInputText,
  });
  switch (apiResponse.status) {
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.name)
    case 'CONFLICT': return inputs.notify.error(apiResponse.message)
  }
  inputs.store.groups.$mergeMatching.id.$withOne(apiResponse.updatedGroup);
  await indexeddb.write({ groups: apiResponse.updatedGroup });
  inputs.notify.success('Group updated');
  blurAutocompleteInput(inputs);
}
export const completeEditTag = async (inputs: Inputs) => {
  if (!inputs.tagId) { throw new Error() }
  const apiResponse = await trpc.tag.update.mutate({ tagId: inputs.tagId, text: inputs.autocompleteText.trim() })
  switch (apiResponse.status) {
    case 'TAG_UNCHANGED': return inputs.notify.info('Tag unchanged')
    case 'BAD_REQUEST': return inputs.notify.error(apiResponse.fields.text)
  }
  const activeTagIdsToBeDeselected = apiResponse.archivedNoteTags.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeDeselected = inputs.store.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
  const activeTagIdsToBeSelected = apiResponse.noteTagsCreated.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
  const activeSynonymIdsToBeSelected = inputs.store.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
  inputs.store.tags.$mergeMatching.id.$withOne(apiResponse.tagUpdated);
  inputs.store.noteTags.$mergeMatching.id.$withMany(apiResponse.archivedNoteTags);
  inputs.store.noteTags.$push(apiResponse.noteTagsCreated);
  inputs.store.synonymIds.$set([...inputs.store.$state.synonymIds.filter(id => !activeSynonymIdsToBeDeselected.includes(id)), ...activeSynonymIdsToBeSelected]);
  inputs.notify.success('Tag updated');
  blurAutocompleteInput(inputs);
}
export const doCancel = (inputs: Inputs, eventTarget: EventTarget | null) => {
  if (ancestorMatches(eventTarget, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
    return;
  }
  if (inputs.showAutocompleteOptions) {
    return inputs.store.config.showAutocompleteOptions.$set(false);
  }
  if (inputs.tagId) {
    return inputs.store.config.$patch({ tagId: null, autocompleteText: '' });
  }
  if (inputs.groupSynonymId) {
    return inputs.store.config.$patch({ groupSynonymId: null, autocompleteText: '' });
  }
  if (inputs.modal) {
    return inputs.store.config.modal.$set(null);
  }
  if (inputs.modalRef.current?.contains(eventTarget as HTMLElement)) {
    return;
  }
  inputs.store.config.$patch({
    tagId: null,
    groupId: null,
    synonymId: null,
    groupSynonymId: null,
    autocompleteAction: null,
    modal: null,
    autocompleteText: '',
  })
  inputs.props.onHide();
}
export const onAutocompleteSelectedWhileNothingIsSelected = async ({ inputs, tagId }: { inputs: Inputs, tagId: TagId }) => {
  const synonymId = inputs.store.$state.tags.findOrThrow(t => t.id === tagId).synonymId;
  const autocompleteText = inputs.store.$state.tags.findOrThrow(t => t.id === tagId).text;
  inputs.store.config.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveGroup' });
  focusAutocompleteInput(inputs);
}
export const onAutocompleteSelectedWhileSynonymIsSelected = async ({ inputs, tagId }: { inputs: Inputs, tagId: TagId }) => {
  if (!inputs.synonymId) { throw new Error(); }
  const selected = inputs.store.$state.tags.findOrThrow(t => t.id === tagId);
  const apiResponse = await trpc.synonym.addTag.mutate({ tagId, synonymId: inputs.synonymId });
  const synonymId = apiResponse.tagsUpdated[0].synonymId;
  const groupHasMoreThanOneTag = inputs.store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
  const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
  inputs.store.tags.$mergeMatching.id.$withMany(apiResponse.tagsUpdated);
  inputs.store.synonymGroups.$mergeMatching.id.$withMany(apiResponse.archivedSynonymGroups);
  await indexeddb.write({ tags: apiResponse.tagsUpdated, synonymGroups: apiResponse.archivedSynonymGroups });
  inputs.store.config.$patch({ tagId, synonymId, autocompleteText: selected.text });
  groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && inputs.notify.success('Tag(s) added to synonyms');
};
export const onAutocompleteSelectedWhileGroupIsSelected = async ({ inputs, tagId }: { inputs: Inputs, tagId: TagId }) => {
  if (!inputs.groupId) { throw new Error(); }
  const { synonymId } = inputs.store.$state.tags.findOrThrow(t => t.id === tagId);
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId: inputs.groupId, synonymId });
  inputs.store.config.autocompleteText.$set('');
  inputs.store.synonymGroups.$mergeMatching.id.$withOne(apiResponse.synonymGroup);
  await indexeddb.write({ synonymGroups: apiResponse.synonymGroup });
  inputs.notify.success('Added to group');
};

export const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async ({ inputs, groupId }: { inputs: Inputs, groupId: GroupId }) => {
  if (!inputs.synonymId) { throw new Error(); }
  const apiResponse = await trpc.group.addSynonym.mutate({ groupId, synonymId: inputs.synonymId });
  inputs.store.synonymGroups.$mergeMatching.id.$withOne(apiResponse.synonymGroup);
  await indexeddb.write({ synonymGroups: apiResponse.synonymGroup });
  inputs.notify.success('Added to group');
}

export const focusAutocompleteInput = (inputs: Inputs) => {
  setTimeout(() => {
    inputs.autocompleteRef.current?.focusInput();
  });
}

export const blurAutocompleteInput = (inputs: Inputs) => {
  setTimeout(() => {
    inputs.autocompleteRef.current?.blurInput();
  });
}

