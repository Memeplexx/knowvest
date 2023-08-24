import { useForwardedRef } from '@/utils/hooks';
import { ForwardedRef, useContext, useRef } from 'react';

import { decide } from '@/utils/functions';
import { useFloating } from '@floating-ui/react';
import { derive } from 'olik';
import { AutocompleteHandle } from '../autocomplete/constants';
import { Props } from './constants';
import { NotificationContext } from '@/utils/pages/home/constants';
import { store } from '@/utils/store';



export const useHooks = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const floating = useFloating<HTMLButtonElement>({ placement: 'left-start' });

  const notify = useContext(NotificationContext)!;

  const state = store.config.$useState();

  const tagsInSynonymGroup = derive(
    store.config.synonymId,
    store.tags,
  ).$with((synonymId, tags) => {
    return tags.filter(t => t.synonymId === synonymId);
  });

  const tagsInCustomGroups = derive(
    store.synonymGroups,
    store.groups,
    store.tags,
    store.config.synonymId,
    tagsInSynonymGroup,
  ).$with((synonymGroups, groups, tags, synonymId, tagsInSynonymGroup) => {
    return [
      ...synonymGroups
        .filter(synonymGroup => synonymGroup.synonymId === synonymId)
        .map(synonymGroup => ({
          group: groups.findOrThrow(g => g.id === synonymGroup.groupId),
          synonyms: [
            !synonymId ? null : {
              synonymId,
              tags: tagsInSynonymGroup.map(t => t.text),
            },
            ...synonymGroups
              .filter(sg => sg.groupId === synonymGroup.groupId && sg.synonymId !== synonymId)
              .map(sg => ({
                synonymId: sg.synonymId,
                tags: tags.filter(t => t.synonymId === sg.synonymId).map(t => t.text),
              }))
          ].filterTruthy()
        })),
      ...groups
        .filter(g => !synonymGroups.some(sg => sg.groupId === g.id))
        .map(group => ({
          group,
          synonyms: [],
        })),
    ]
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
      .map(group => {
        return {
          value: group.id,
          label: group.name,
          synonyms: synonymGroups.filter(sg => sg.groupId === group.id).flatMap(sg => tags.filter(t => t.synonymId === sg.synonymId)),
        };
      });
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
    return autocompleteAction === 'addActiveSynonymsToAGroup'
      ? autocompleteOptionsGroups
      : autocompleteOptionsTags;
  });

  const autocompleteTitle = derive(
    store.config.groupSynonymId,
    store.config.tagId,
    store.config.groupId,
  ).$with((groupSynonymId, tagId, groupId) => {
    return decide([
      {
        when: () => !!tagId,
        then: () => 'Type to update the selected Tag',
      },
      {
        when: () => !!groupSynonymId,
        then: () => 'Type to search for a Tag to add to the active Group',
      },
      {
        when: () => !!groupId,
        then: () => 'Type to search for a Tag to add to the selected Group',
      },
      {
        when: () => true,
        then: () => 'Type to search for a Tag to update, or create a new Tag',
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
    props,
    floating,
    containerRef: useForwardedRef(ref),
    modalRef: useRef<HTMLDivElement>(null),
    autocompleteRef: useRef<AutocompleteHandle>(null),
    selectedTagRef: useRef<HTMLDivElement>(null),
    activeNoteId: store.activeNoteId.$useState(),
    autocompleteOptions: autocompleteOptions.$useState(),
    tagsInCustomGroups: tagsInCustomGroups.$useState(),
    tagsInSynonymGroup: tagsInSynonymGroup.$useState(),
    autocompleteTitle: autocompleteTitle.$useState(),
    selectedGroupSelectedSynonym: selectedGroupSelectedSynonym.$useState(),
    autocompleteDisabled: !!state.groupSynonymId,
    notify,
    ...state,
  };
}
