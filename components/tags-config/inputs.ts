import { type ForwardedRef, useContext, useRef } from 'react';

import { decide } from '@/utils/functions';
import { useFloating } from '@floating-ui/react';
import { derive } from 'olik/derive';
import { AutocompleteHandle } from '../autocomplete/constants';
import { NotificationContext } from '@/utils/pages/home/constants';
import { Props, initialState } from './constants';
import { useNestedStore } from '@/utils/hooks';



export const useInputs = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const store = useNestedStore(initialState)!;

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'left-start' });

  const notify = useContext(NotificationContext)!;

  const state = store.config.$useState();

  const tagsInSynonymGroup = derive(
    store.tags,
    store.config.synonymId,
    store.config.tagId,
    store.config.autocompleteText,
  ).$with((tags, synonymId, tagId, autocompleteText) => {
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedTags
      .filter(tag => tag.synonymId === synonymId)
      .map((tag, index, array) => ({
        id: tag.id,
        text: tagId === tag.id || (!tagId && tagId === tag.id) ? autocompleteText : tag.text,
        first: index === 0,
        last: index === array.length - 1,
        selected: tag.id === tagId,
      }));
  });

  const tagsInCustomGroups = derive(
    store.synonymGroups,
    store.groups,
    store.tags,
    store.config.synonymId,
    tagsInSynonymGroup,
  ).$with((synonymGroups, groups, tags, synonymId, tagsInSynonymGroup) => {
    const unArchivedSynonymGroups = synonymGroups.filter(sg => !sg.isArchived);
    const unArchivedGroups = groups.filter(g => !g.isArchived);
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return [
      ...unArchivedSynonymGroups
        .filter(synonymGroup => synonymGroup.synonymId === synonymId)
        .map(synonymGroup => ({
          group: unArchivedGroups.findOrThrow(g => g.id === synonymGroup.groupId),
          synonyms: [
            !synonymId
              ? null
              : {
                synonymId,
                tags: tagsInSynonymGroup,
              },
            ...unArchivedSynonymGroups
              .filter(sg => sg.groupId === synonymGroup.groupId && sg.synonymId !== synonymId)
              .map(sg => ({
                synonymId: sg.synonymId,
                tags: unArchivedTags
                  .filter(t => t.synonymId === sg.synonymId)
                  .map((tag, index, array) => ({
                    ...tag,
                    first: index === 0,
                    last: index === array.length - 1,
                  })),
              }))
          ].filterTruthy()
        })),
      ...unArchivedGroups
        .filter(group => !unArchivedSynonymGroups.some(sg => sg.groupId === group.id))
        .map(group => ({
          group,
          synonyms: [],
        })),
    ]
  });

  const tagSynonymGroupMap = derive(
    store.tags,
  ).$with((tags) => {
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedTags
      .groupBy(tag => tag.synonymId)
      .mapToObject(t => t[0].synonymId, tags => tags);
  });

  const autocompleteOptionsGroups = derive(
    store.groups,
    store.synonymGroups,
    store.tags,
    tagsInCustomGroups,
  ).$with((groups, synonymGroups, tags, tagsInCustomGroups) => {
    const unArchivedGroups = groups.filter(g => !g.isArchived);
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedGroups
      .filter(group => !tagsInCustomGroups.some(t => t.group.id === group.id))
      .map(group => ({
        value: group.id,
        label: group.name,
        synonyms: synonymGroups
          .filter(sg => sg.groupId === group.id)
          .flatMap(sg => unArchivedTags.filter(t => t.synonymId === sg.synonymId)),
      }));
  });

  const autocompleteOptionsTags = derive(
    store.tags,
    store.synonymGroups,
    store.config.groupId,
    store.config.synonymId,
    tagSynonymGroupMap,
  ).$with((tags, synonymGroups, groupId, synonymId, tagSynonymGroupMap) => {
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedTags
      .filter(t => {
        if (groupId) {
          return t.synonymId !== synonymId && !synonymGroups
            .filter(sg => sg.groupId === groupId)
            .some(sg => sg.synonymId === t.synonymId);
        } else {
          return !synonymId || t.synonymId !== synonymId;
        }
      })
      .map(t => ({
        value: t.id,
        label: t.text,
        synonyms: tagSynonymGroupMap[t.synonymId]
      }));
  });

  const autocompleteOptions = derive(
    store.config.autocompleteAction,
    autocompleteOptionsGroups,
    autocompleteOptionsTags,
  ).$with((autocompleteAction, autocompleteOptionsGroups, autocompleteOptionsTags) => {
    return (autocompleteAction === 'addActiveSynonymsToAGroup'
      ? autocompleteOptionsGroups
      : autocompleteOptionsTags).map(option => ({
        ...option,
        synonyms: option.synonyms.map(synonym => synonym.text).join(', '),
      }));
  });

  const autocompleteTitle = derive(
    store.config.groupSynonymId,
    store.config.tagId,
    store.config.groupId,
  ).$with((groupSynonymId, tagId, groupId) => {
    return decide([
      {
        when: () => !!tagId,
        then: () => 'Update selected Tag',
      },
      {
        when: () => !!groupSynonymId,
        then: () => 'Search for Tag to add to active Group',
      },
      {
        when: () => !!groupId,
        then: () => 'Search for Tag to add to selected Group',
      },
      {
        when: () => true,
        then: () => 'Search for Tag or create a new Tag',
      },
    ])
  });

  const selectedGroupSelectedSynonym = derive(
    store.config.groupId,
    store.config.groupSynonymId,
    tagsInCustomGroups,
  ).$with((groupId, groupSynonymId, tagsInCustomGroups) => {
    if (!groupId || !groupSynonymId) { return ''; }
    return tagsInCustomGroups.findOrThrow(t => t.group.id === groupId).synonyms.find(s => s.synonymId === groupSynonymId)?.tags || '';
  });

  return {
    ...state,
    pageTitle: autocompleteTitle.$useState(),
    activeNoteId: store.activeNoteId.$useState(),
    autocompleteOptions: autocompleteOptions.$useState(),
    tagsInCustomGroups: tagsInCustomGroups.$useState(),
    tagsInSynonymGroup: tagsInSynonymGroup.$useState(),
    selectedGroupSelectedSynonym: selectedGroupSelectedSynonym.$useState(),
    floatingRef,
    modalRef: useRef<HTMLDivElement>(null),
    autocompleteRef: useRef<AutocompleteHandle>(null),
    selectedTagRef: useRef<HTMLDivElement>(null),
    settingsButtonRef: state.modal === 'synonymOptions' ? floatingRef.refs.setReference : null,
    synonymOptionsRef: state.modal === 'synonymOptions' ? floatingRef.refs.setFloating : null,
    notify,
    props,
    store,
  };
}
