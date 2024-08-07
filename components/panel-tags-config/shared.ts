import { addSynonymToGroup, createGroup, createTagForGroup, updateGroup } from '@/actions/group';
import { addTagToSynonym, createTagForSynonym } from '@/actions/synonym';
import { createTag, updateTag } from '@/actions/tag';
import { GroupId, TagId } from '@/actions/types';
import { TypedKeyboardEvent } from '@/utils/dom-utils';
import { store } from '@/utils/store-utils';
import { Inputs } from './constants';


export const useSharedFunctions = (inputs: Inputs) => {
  const { local, notify } = inputs;
  const completeCreateTagForSynonym = async () => {
    const apiResponse = await createTagForSynonym(local.$state.autocompleteText, local.$state.synonymId === null ? undefined : local.$state.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    local.tagId.$set(apiResponse.tag.id);
    store.tags.$mergeMatching.id.$with(apiResponse.tag);
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTag = async () => {
    const apiResponse = await createTag(local.$state.autocompleteText);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    local.$patch({ synonymId: apiResponse.tag.synonymId, tagId: apiResponse.tag.id });
    store.synonymIds.$push(apiResponse.tag.synonymId);
    store.tags.$mergeMatching.id.$with(apiResponse.tag);
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateTagForGroup = async () => {
    if (!local.$state.groupId || !local.$state.synonymId)
      return;
    const apiResponse = await createTagForGroup(local.$state.autocompleteText, local.$state.groupId, local.$state.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.fields.text);
    local.autocompleteText.$set('');
    store.tags.$mergeMatching.id.$with(apiResponse.tag);
    store.synonymGroups.$mergeMatching.id.$with(apiResponse.synonymGroup);
    notify.success('Tag created');
    blurAutocompleteInput();
  }
  const completeCreateGroup = async () => {
    if (!local.$state.synonymId)
      throw new Error();
    const apiResponse = await createGroup(local.$state.autocompleteText, local.$state.synonymId);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.name);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.message);
    local.autocompleteText.$set('');
    store.groups.$mergeMatching.id.$with(apiResponse.group);
    store.synonymGroups.$mergeMatching.id.$with(apiResponse.synonymGroup);
    notify.success('Group created');
    blurAutocompleteInput();
  }
  const completeEditGroupName = async (event: TypedKeyboardEvent<HTMLInputElement>) => {
    if (!local.$state.groupId)
      throw new Error();
    const apiResponse = await updateGroup(local.$state.groupId, local.$state.focusedGroupNameInputText);
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.name);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.message);
    store.groups.$mergeMatching.id.$with(apiResponse.group);
    notify.success('Group updated');
    blurAutocompleteInput();
    event.target.blur();
  }
  const completeEditTag = async () => {
    if (!local.$state.tagId)
      throw new Error();
    const apiResponse = await updateTag(local.$state.tagId, local.$state.autocompleteText)
    if (apiResponse.status === 'TAG_UNCHANGED')
      return notify.info('Tag unchanged');
    if (apiResponse.status === 'BAD_REQUEST')
      return notify.error(apiResponse.fields.text);
    if (apiResponse.status === 'CONFLICT')
      return notify.error(apiResponse.fields.text);
    store.tags.$mergeMatching.id.$with(apiResponse.tag);
    notify.success('Tag updated');
    blurAutocompleteInput();
  }
  const doCancel = (eventTarget: EventTarget) => {
    if (eventTarget?.hasAncestorWithTagNames('BUTTON', 'INPUT'))
      return;
    if (local.$state.showAutocompleteOptions)
      return local.showAutocompleteOptions.$set(false);
    if (local.$state.tagId)
      return local.$patch({ tagId: null, autocompleteText: '' });
    if (local.$state.groupSynonymId)
      return local.$patch({ groupSynonymId: null, autocompleteText: '' });
    if (local.$state.modal)
      return local.modal.$nullify();
  }
  const onAutocompleteSelectedWhileNothingIsSelected = async ({ tagId }: { tagId: TagId }) => {
    const tag = store.$state.tags.findOrThrow(t => t.id === tagId);
    local.$patch({ tagId, synonymId: tag.synonymId, autocompleteText: tag.text, autocompleteAction: 'addSynonymsToActiveSynonyms' });
  }
  const onAutocompleteSelectedWhileSynonymIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!local.$state.synonymId)
      throw new Error();
    const selected = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addTagToSynonym(local.$state.synonymId, tagId);
    const synonymId = apiResponse.tags[0]!.synonymId;
    const groupHasMoreThanOneTag = store.$state.tags.some(t => t.synonymId === synonymId && t.id !== tagId);
    const tagWasPartOfAnotherGroup = selected.synonymId !== synonymId;
    store.tags.$mergeMatching.id.$with(apiResponse.tags);
    store.synonymGroups.$mergeMatching.id.$with(apiResponse.synonymGroups);
    local.$patch({ tagId, synonymId, autocompleteText: selected.text });
    groupHasMoreThanOneTag && tagWasPartOfAnotherGroup && notify.success('Tag(s) added to synonyms');
  };
  const onAutocompleteSelectedWhileGroupIsSelected = async ({ tagId }: { tagId: TagId }) => {
    if (!local.$state.groupId)
      throw new Error();
    const { synonymId } = store.$state.tags.findOrThrow(t => t.id === tagId);
    const apiResponse = await addSynonymToGroup(local.$state.groupId, synonymId);
    local.autocompleteText.$set('');
    store.synonymGroups.$mergeMatching.id.$with(apiResponse.synonymGroup);
    notify.success('Added to group');
  };
  const onAutocompleteSelectedWhileAddActiveSynonymsToGroup = async ({ groupId }: { groupId: GroupId }) => {
    if (!local.$state.synonymId)
      throw new Error();
    const apiResponse = await addSynonymToGroup(groupId, local.$state.synonymId);
    store.synonymGroups.$mergeMatching.id.$with(apiResponse.synonymGroup);
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

