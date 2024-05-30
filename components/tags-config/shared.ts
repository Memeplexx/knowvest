import { addSynonymToGroup, createGroup, createTagForGroup, updateGroup } from '@/actions/group';
import { addTagToSynonym, createTagForSynonym } from '@/actions/synonym';
import { createTag, updateTag } from '@/actions/tag';
import { GroupId, TagId } from '@/actions/types';
import { writeToStoreAndDb } from '@/utils/storage-utils';
import { Inputs, Props } from './constants';


export const useSharedFunctions = (props: Props, inputs: Inputs) => {
  const { store, local, notify } = inputs;
  const completeCreateTagForSynonym = async () => {
    const apiResponse = await createTagForSynonym(inputs.autocompleteText.trim(), inputs.synonymId === null ? undefined : inputs.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    local.tagId.$set(apiResponse.tag.id);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTag = async () => {
    const apiResponse = await createTag(inputs.autocompleteText.trim());
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    local.$patch({ synonymId: apiResponse.tag.synonymId, tagId: apiResponse.tag.id });
    store.synonymIds.$push(apiResponse.tag.synonymId);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTagForGroup = async () => {
    if (!inputs.groupId || !inputs.synonymId)
      return;
    const apiResponse = await createTagForGroup(inputs.autocompleteText.trim(), inputs.groupId, inputs.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    local.autocompleteText.$set('');
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags, synonymGroups: apiResponse.synonymGroup });
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateGroup = async () => {
    if (!inputs.synonymId)
      throw new Error();
    const apiResponse = await createGroup(inputs.autocompleteText.trim(), inputs.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.name);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.message);
    local.autocompleteText.$set('');
    await writeToStoreAndDb(store, { groups: apiResponse.group, synonymGroups: apiResponse.synonymGroup });
    notify.success('Group created');
    blurAutocompleteInput();
  }
  const completeEditGroupName = async () => {
    if (!inputs.groupId)
      throw new Error();
    const apiResponse = await updateGroup(inputs.groupId, inputs.focusedGroupNameInputText);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.name);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.message);
    await writeToStoreAndDb(store, { groups: apiResponse.group });
    notify.success('Group updated');
    blurAutocompleteInput();
  }
  const completeEditTag = async () => {
    if (!inputs.tagId)
      throw new Error();
    const apiResponse = await updateTag(inputs.tagId, inputs.autocompleteText.trim())
    if (apiResponse.status === 'TAG_UNCHANGED')
      return notify.info('Tag unchanged');
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    const activeTagIdsToBeDeselected = apiResponse.noteTags.map(nt => nt.tagId);
    const activeSynonymIdsToBeDeselected = store.$state.tags.filter(t => activeTagIdsToBeDeselected.includes(t.id)).map(t => t.synonymId);
    const activeTagIdsToBeSelected = apiResponse.noteTags.filter(nt => nt.noteId === inputs.activeNoteId).map(nt => nt.tagId);
    const activeSynonymIdsToBeSelected = store.$state.tags.filter(t => activeTagIdsToBeSelected.includes(t.id)).map(t => t.synonymId);
    await writeToStoreAndDb(store, { tags: apiResponse.tag, noteTags: apiResponse.noteTags });
    store.synonymIds.$setUnique([...store.$state.synonymIds.filter(id => !activeSynonymIdsToBeDeselected.includes(id)), ...activeSynonymIdsToBeSelected]);
    notify.success('Tag updated');
    blurAutocompleteInput();
  }
  const doCancel = (eventTarget: EventTarget) => {
    if (eventTarget?.hasAncestorWithTagNames('BUTTON', 'INPUT'))
      return;
    if (inputs.showAutocompleteOptions)
      return local.showAutocompleteOptions.$set(false);
    if (inputs.tagId)
      return local.$patch({ tagId: null, autocompleteText: '' });
    if (inputs.groupSynonymId)
      return local.$patch({ groupSynonymId: null, autocompleteText: '' });
    if (inputs.modal)
      return local.modal.$set(null);
    if (inputs.modalRef.current?.contains(eventTarget as HTMLElement))
      return;
    local.$patch({
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
  const onAutocompleteSelectedWhileNothingIsSelected = async ({ tagId }: { tagId: TagId }) => {
    const synonymId = store.$state.tags.findOrThrow(t => t.id === tagId).synonymId;
    const autocompleteText = store.$state.tags.findOrThrow(t => t.id === tagId).text;
    local.$patch({ tagId, synonymId, autocompleteText, autocompleteAction: 'addSynonymsToActiveSynonyms' });
  }
  const onAutocompleteSelectedWhileSynonymIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.synonymId)
      throw new Error();
    const selected = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addTagToSynonym(inputs.synonymId, tagId);
    const synonymId = apiResponse.tags[0]!.synonymId;
    const groupHasMoreThanOneTag = store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
    const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
    await writeToStoreAndDb(store, { tags: apiResponse.tags, synonymGroups: apiResponse.synonymGroups });
    local.$patch({ tagId, synonymId, autocompleteText: selected.text });
    groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms');
  };
  const onAutocompleteSelectedWhileGroupIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!inputs.groupId)
      throw new Error();
    const { synonymId } = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addSynonymToGroup(inputs.groupId, synonymId);
    local.autocompleteText.$set('');
    await writeToStoreAndDb(store, { synonymGroups: apiResponse.synonymGroup });
    notify.success('Added to group');
  };
  const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async ({ groupId }: { groupId: GroupId }) => {
    if (!inputs.synonymId)
      throw new Error();
    const apiResponse = await addSynonymToGroup(groupId, inputs.synonymId);
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

