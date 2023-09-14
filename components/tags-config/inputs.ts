import { type ForwardedRef, useContext, useRef } from 'react';

import { decide } from '@/utils/functions';
import { useFloating } from '@floating-ui/react';
import { derive } from 'olik';
import { AutocompleteHandle } from '../autocomplete/constants';
import { NotificationContext } from '@/utils/pages/home/constants';
import { store } from '@/utils/store';
import { Props } from './constants';



export const useInputs = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'left-start' });

  const notify = useContext(NotificationContext)!;

  const state = store.config.$useState();

  const selectedTag = useRef<HTMLDivElement>(null)

  const tagsInSynonymGroup = derive(
    store.config.synonymId,
    store.tags,
    store.config.tagId,
    store.config.autocompleteText,
  ).$with((synonymId, tags, tagId, autocompleteText) => {
    return tags
      .filter(t => t.synonymId === synonymId)
      .map((tag, index, array) => ({
        id: tag.id,
        text: tagId === tag.id || (!tagId && tagId === tag.id) ? autocompleteText : tag.text,
        first: index === 0,
        last: index === array.length - 1,
        selected: tag.id === tagId,
        ref: tag.id === state.tagId ? selectedTag : null,
      }));
  });

  const tagsInCustomGroups = derive(
    store.synonymGroups,
    store.groups,
    store.tags,
    tagsInSynonymGroup,
    store.config.groupId,
    store.config.synonymId,
    store.config.groupSynonymId,
    store.config.hoveringGroupId,
    store.config.hoveringSynonymId,
    store.config.modal,
    store.config.focusedGroupNameInputText,
  ).$with((synonymGroups, groups, tags, tagsInSynonymGroup, groupId, synonymId, groupSynonymId, hoveringGroupId, hoveringSynonymId, modal, focusedGroupNameInputText) => {
    return [
      ...synonymGroups
        .filter(synonymGroup => synonymGroup.synonymId === synonymId)
        .map(synonymGroup => {
          const group = groups.findOrThrow(g => g.id === synonymGroup.groupId);
          return {
            group,
            synonyms: [
              !synonymId
                ? null
                : {
                  synonymId,
                  tags: tagsInSynonymGroup,
                },
              ...synonymGroups
                .filter(sg => sg.groupId === synonymGroup.groupId && sg.synonymId !== synonymId)
                .map(sg => ({
                  synonymId: sg.synonymId,
                  tags: tags.filter(t => t.synonymId === sg.synonymId),
                }))
            ]
              .filterTruthy()
              .map((synonymGroup, index, array) => ({
                ...synonymGroup,
                first: index === 0,
                last: index === array.length - 1,
                tags: synonymGroup.tags.map((tag, index, array) => ({
                  id: tag.id,
                  ref: groupId === group.id && groupSynonymId === synonymId ? selectedTag : null,
                  text: tag.text,
                  first: index === 0,
                  last: index === array.length - 1,
                  selected: (hoveringGroupId === group.id && hoveringSynonymId === synonymGroup.synonymId)
                    || (groupId === group.id && groupSynonymId === synonymGroup.synonymId)
                })),
              }))
          };
        }),
      ...groups
        .filter(g => !synonymGroups.some(sg => sg.groupId === g.id))
        .map(group => ({
          group,
          synonyms: [],
        })),
    ].map(group => ({
      ...group,
      group: {
        id: group.group.id,
        active: groupId === group.group.id,
        canRemoveSelection: !!groupSynonymId && group.synonyms.length > 1,
        canUpdateSelection: !!groupSynonymId && groupSynonymId !== synonymId,
        inputText: groupId === group.group.id ? focusedGroupNameInputText : group.group.name,
        settingsRef: groupId === group.group.id && modal === 'groupOptions' ? floating.refs.setReference : null,
        showOptions: groupId === group.group.id && modal === 'groupOptions',
        popupRef: groupId === group.group.id && modal === 'groupOptions' ? floating.refs.setFloating : null,
      }
    }))
  });

  const tagSynonymGroupMap = derive(
    store.tags,
  ).$with((tags) => {
    return tags
      .groupBy(tag => tag.synonymId)
      .mapToObject(t => t[0].synonymId, tags => tags);
  });

  const autocompleteOptionsGroups = derive(
    store.groups,
    store.synonymGroups,
    store.tags,
    tagsInCustomGroups,
  ).$with((groups, synonymGroups, tags, tagsInCustomGroups) => {
    return groups
      .filter(group => !tagsInCustomGroups.some(t => t.group.id === group.id))
      .map(group => ({
        value: group.id,
        label: group.name,
        synonyms: synonymGroups.filter(sg => sg.groupId === group.id).flatMap(sg => tags.filter(t => t.synonymId === sg.synonymId)),
      }));
  });

  const autocompleteOptionsTags = derive(
    store.tags,
    store.synonymGroups,
    store.config.groupId,
    store.config.synonymId,
    tagSynonymGroupMap,
  ).$with((tags, synonymGroups, groupId, synonymId, tagSynonymGroupMap) => {
    return tags
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
    return tagsInCustomGroups.find(t => t.group.id === groupId)!.synonyms.find(s => s.synonymId === groupSynonymId)?.tags || '';
  });

  return {
    state: {
      ...state,
      activeNoteId: store.activeNoteId.$useState(),
      autocompleteOptions: autocompleteOptions.$useState(),
      tagsInCustomGroups: tagsInCustomGroups.$useState(),
      tagsInSynonymGroup: tagsInSynonymGroup.$useState(),
      pageTitle: autocompleteTitle.$useState(),
      selectedGroupSelectedSynonym: selectedGroupSelectedSynonym.$useState(),
      autocompleteDisabled: !!state.groupSynonymId,
      showSynonymOptions: state.modal === 'synonymOptions',
      confirmDeleteTag: state.modal === 'confirmDeleteTag',
      confirmDeleteGroup: state.modal === 'confirmDeleteGroup',
      showGroupOptions: state.modal === 'groupOptions',
      allowRemoveSelectionFromSynonyms: !!state.tagId && tagsInSynonymGroup.$state.length > 1,
    },
    refs: {
      floating,
      modal: useRef<HTMLDivElement>(null),
      autocomplete: useRef<AutocompleteHandle>(null),
      settingsButton: state.modal === 'synonymOptions' ? floating.refs.setReference : null,
      synonymOptions: state.modal === 'synonymOptions' ? floating.refs.setFloating : null,
    },
    notify,
    props,
  };
}
