import { GroupId, TagId } from '@/server/dtos';
import { trpc } from '@/utils/trpc';
import { Inputs } from './constants';
import { ancestorMatches } from '@/utils/functions';
import { indexeddb } from '@/utils/indexed-db';


export const useSharedFunctions = ({ notify, store, ...inputs }: Inputs) => {
  const completeCreateTagForSynonym = async () => {
    const apiResponse = await trpc.synonym.createTag.mutate({
      text: inputs.autocompleteText.trim(),
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
    }
    store.tagsConfig.tagId.$set(apiResponse.tag.id);
    await indexeddb.write(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTag = async () => {
    const apiResponse = await trpc.tag.create.mutate({
      text: inputs.autocompleteText.trim(),
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
    }
    store.tagsConfig.$patch({ synonymId: apiResponse.tag.synonymId, tagId: apiResponse.tag.id });
    store.synonymIds.$push(apiResponse.tag.synonymId);
    await indexeddb.write(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTagForGroup = async () => {
    if (!inputs.groupId || !inputs.synonymId) { return }
    const apiResponse = await trpc.group.createTag.mutate({
      text: inputs.autocompleteText.trim(),
      groupId: inputs.groupId,
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
    }
    store.tagsConfig.autocompleteText.$set('');
    await indexeddb.write(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags, synonymGroups: apiResponse.synonymGroup });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateGroup = async () => {
    if (!inputs.synonymId) { throw new Error() }
    const apiResponse = await trpc.group.create.mutate({
      name: inputs.autocompleteText.trim(),
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.name);
    }
    store.tagsConfig.autocompleteText.$set('');
    await indexeddb.write(store, { groups: apiResponse.createdGroup, synonymGroups: apiResponse.createdSynonymGroup });
    notify.success('Group created');
    blurAutocompleteInput();
  }
  const completeEditGroupName = async () => {
    if (!inputs.groupId) { throw new Error(); }
    const apiResponse = await trpc.group.update.mutate({
      groupId: inputs.groupId,
      name: inputs.focusedGroupNameInputText,
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.name)
      case 'CONFLICT': return notify.error(apiResponse.message)
    }
    await indexeddb.write(store, { groups: apiResponse.updatedGroup });
    notify.success('Group updated');
    blurAutocompleteInput();
  }
  const completeEditTag = async () => {
    if (!inputs.tagId) { throw new Error() }
    const apiResponse = await trpc.tag.update.mutate({ tagId: inputs.tagId, text: inputs.autocompleteText.trim() })
    switch (apiResponse.status) {
      case 'TAG_UNCHANGED': return notify.info('Tag unchanged')
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
    }
    const activeTagIdsToBeDeselected = apiResponse.archivedNoteTags.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
    const activeSynonymIdsToBeDeselected = store.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
    const activeTagIdsToBeSelected = apiResponse.noteTagsCreated.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
    const activeSynonymIdsToBeSelected = store.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
    await indexeddb.write(store, { tags: apiResponse.tagUpdated, noteTags: [...apiResponse.archivedNoteTags, ...apiResponse.noteTagsCreated] });
    store.synonymIds.$set([...store.$state.synonymIds.filter(id => !activeSynonymIdsToBeDeselected.includes(id)), ...activeSynonymIdsToBeSelected]);
    notify.success('Tag updated');
    blurAutocompleteInput();
  }
  const doCancel = (eventTarget: EventTarget | null) => {
    if (ancestorMatches(eventTarget, e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
      return;
    }
    if (inputs.showAutocompleteOptions) {
      return store.tagsConfig.showAutocompleteOptions.$set(false);
    }
    if (inputs.tagId) {
      return store.tagsConfig.$patch({ tagId: null, autocompleteText: '' });
    }
    if (inputs.groupSynonymId) {
      return store.tagsConfig.$patch({ groupSynonymId: null, autocompleteText: '' });
    }
    if (inputs.modal) {
      return store.tagsConfig.modal.$set(null);
    }
    if (inputs.modalRef.current?.contains(eventTarget as HTMLElement)) {
      return;
    }
    store.tagsConfig.$patch({
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
  const onAutocompleteSelectedWhileNothingIsSelected = async ({ tagId }: { tagId: TagId }) => {
    const synonymId = store.$state.tags.findOrThrow(t => t.id === tagId).synonymId;
    const autocompleteText = store.$state.tags.findOrThrow(t => t.id === tagId).text;
    store.tagsConfig.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveGroup' });
    focusAutocompleteInput();
  }
  const onAutocompleteSelectedWhileSynonymIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.synonymId) { throw new Error(); }
    const selected = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await trpc.synonym.addTag.mutate({ tagId, synonymId: inputs.synonymId });
    const synonymId = apiResponse.tagsUpdated[0].synonymId;
    const groupHasMoreThanOneTag = store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
    const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
    await indexeddb.write(store, { tags: apiResponse.tagsUpdated, synonymGroups: apiResponse.archivedSynonymGroups });
    store.tagsConfig.$patch({ tagId, synonymId, autocompleteText: selected.text });
    groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms');
  };
  const onAutocompleteSelectedWhileGroupIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.groupId) { throw new Error(); }
    const { synonymId } = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await trpc.group.addSynonym.mutate({ groupId: inputs.groupId, synonymId });
    store.tagsConfig.autocompleteText.$set('');
    await indexeddb.write(store, { synonymGroups: apiResponse.synonymGroup });
    notify.success('Added to group');
  };
  
  const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async ({ groupId }: { groupId: GroupId }) => {
    if (!inputs.synonymId) { throw new Error(); }
    const apiResponse = await trpc.group.addSynonym.mutate({ groupId, synonymId: inputs.synonymId });
    await indexeddb.write(store, { synonymGroups: apiResponse.synonymGroup });
    notify.success('Added to group');
  }
  
  const focusAutocompleteInput = () => {
    setTimeout(() => {
      inputs.autocompleteRef.current?.focusInput();
    });
  }
  
  const blurAutocompleteInput = () => {
    setTimeout(() => {
      inputs.autocompleteRef.current?.blurInput();
    });
  }
  
  return {
    completeCreateTagForSynonym,
    completeCreateTag,
    completeCreateTagForGroup,
    completeCreateGroup,
    completeEditGroupName,
    completeEditTag,
    doCancel,
    onAutocompleteSelectedWhileNothingIsSelected,
    onAutocompleteSelectedWhileSynonymIsSelected,
    onAutocompleteSelectedWhileGroupIsSelected,
    onAutocompleteSelectedWhileAddActiveSynonymsToGroup,
    focusAutocompleteInput,
    blurAutocompleteInput,
  }
}

