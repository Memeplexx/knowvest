import { addSynonymToGroup, createGroup, createTagForGroup, updateGroup } from '@/actions/group';
import { addTagToSynonym, createTagToSynonym } from '@/actions/synonym';
import { createTag, updateTag } from '@/actions/tag';
import { GroupId, TagId } from '@/actions/types';
import { Inputs } from './constants';
import { writeToStoreAndDb } from '@/utils/storage-utils';


export const useSharedFunctions = ({ notify, store, ...inputs }: Inputs) => {
  const completeCreateTagForSynonym = async () => {
    const apiResponse = await createTagToSynonym({
      text: inputs.autocompleteText.trim(),
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
    }
    store.tagsConfig.tagId.$set(apiResponse.tag.id);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTag = async () => {
    const apiResponse = await createTag({
      text: inputs.autocompleteText.trim(),
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text);
    }
    store.tagsConfig.$patch({ synonymId: apiResponse.tag.synonymId, tagId: apiResponse.tag.id });
    store.synonymIds.$push(apiResponse.tag.synonymId);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTagForGroup = async () => {
    if (!inputs.groupId || !inputs.synonymId) { return }
    const apiResponse = await createTagForGroup({
      text: inputs.autocompleteText.trim(),
      groupId: inputs.groupId,
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
    }
    store.tagsConfig.autocompleteText.$set('');
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags, synonymGroups: apiResponse.synonymGroup });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateGroup = async () => {
    if (!inputs.synonymId) { throw new Error() }
    const apiResponse = await createGroup({
      name: inputs.autocompleteText.trim(),
      synonymId: inputs.synonymId
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.name);
    }
    store.tagsConfig.autocompleteText.$set('');
    await writeToStoreAndDb(store, { groups: apiResponse.createdGroup, synonymGroups: apiResponse.createdSynonymGroup });
    notify.success('Group created');
    blurAutocompleteInput();
  }
  const completeEditGroupName = async () => {
    if (!inputs.groupId) { throw new Error(); }
    const apiResponse = await updateGroup({
      groupId: inputs.groupId,
      name: inputs.focusedGroupNameInputText,
    });
    switch (apiResponse.status) {
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.name)
      case 'CONFLICT': return notify.error(apiResponse.message)
    }
    await writeToStoreAndDb(store, { groups: apiResponse.updatedGroup });
    notify.success('Group updated');
    blurAutocompleteInput();
  }
  const completeEditTag = async () => {
    if (!inputs.tagId) { throw new Error() }
    const apiResponse = await updateTag({ tagId: inputs.tagId, text: inputs.autocompleteText.trim() })
    switch (apiResponse.status) {
      case 'TAG_UNCHANGED': return notify.info('Tag unchanged')
      case 'BAD_REQUEST': return notify.error(apiResponse.fields.text)
    }
    const activeTagIdsToBeDeselected = apiResponse.noteTags.filter(nt => nt.isArchived).map(nt => nt.tagId);
    const activeSynonymIdsToBeDeselected = store.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
    const activeTagIdsToBeSelected = apiResponse.noteTags.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
    const activeSynonymIdsToBeSelected = store.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    store.synonymIds.$setUnique([...store.$state.synonymIds.filter(id => !activeSynonymIdsToBeDeselected.includes(id)), ...activeSynonymIdsToBeSelected]);
    notify.success('Tag updated');
    blurAutocompleteInput();
  }
  const doCancel = (eventTarget: EventTarget | null) => {
    if (eventTarget?.hasAncestor(e => ['BUTTON', 'INPUT'].includes(e.tagName))) {
      return;
    }
    if (store.tagsConfig.$state.showAutocompleteOptions) {
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
    const synonymId = store.tags.$find.id.$eq(tagId).synonymId;
    const autocompleteText = store.tags.$find.id.$eq(tagId).text;
    store.tagsConfig.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: /*'addSynonymsToActiveGroup'*/'addSynonymsToActiveSynonyms' });
  }
  const onAutocompleteSelectedWhileSynonymIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.synonymId) { throw new Error(); }
    const selected = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addTagToSynonym({ tagId, synonymId: inputs.synonymId });
    const synonymId = apiResponse.tags[0].synonymId;
    const groupHasMoreThanOneTag = store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
    const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
    await writeToStoreAndDb(store, { tags: apiResponse.tags, synonymGroups: apiResponse.synonymGroups, noteTags: apiResponse.noteTags });
    store.tagsConfig.$patch({ tagId, synonymId, autocompleteText: selected.text });
    groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms');
  };
  const onAutocompleteSelectedWhileGroupIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.groupId) { throw new Error(); }
    const { synonymId } = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addSynonymToGroup({ groupId: inputs.groupId, synonymId });
    store.tagsConfig.autocompleteText.$set('');
    await writeToStoreAndDb(store, { synonymGroups: apiResponse.synonymGroup });
    notify.success('Added to group');
  };
  const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async ({ groupId }: { groupId: GroupId }) => {
    if (!inputs.synonymId) { throw new Error(); }
    const apiResponse = await addSynonymToGroup({ groupId, synonymId: inputs.synonymId });
    await writeToStoreAndDb(store, { synonymGroups: apiResponse.synonymGroup });
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

