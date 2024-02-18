import { useMemo, useRef, type ForwardedRef, useState } from 'react';

import { decide } from '@/utils/functions';
import { useFloating } from '@floating-ui/react';
import { AutocompleteHandle } from '../autocomplete/constants';
import { Props, initialState, initialTransientState } from './constants';
import { useNotifier } from '../notifier';
import { useStore } from '@/utils/hooks';


export const useInputs = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const { store, tagsConfig, tags, groups, synonymGroups, activeNoteId } = useStore(initialState);
  const { tagId, synonymId, groupId, autocompleteText, autocompleteAction } = tagsConfig;

  const [state, setState] = useState(initialTransientState)

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'left-start' });
  const settingsButtonRef = tagsConfig.modal === 'synonymOptions' ? floatingRef.refs.setReference : null;
  const synonymOptionsRef = tagsConfig.modal === 'synonymOptions' ? floatingRef.refs.setFloating : null;
  const modalRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const selectedTagRef = useRef<HTMLDivElement>(null);

  const notify = useNotifier();

  const tagsInSynonymGroup = useMemo(() => {
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
  }, [autocompleteText, synonymId, tagId, tags]);

  const tagsInCustomGroups = useMemo(() => {
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
  }, [groups, synonymGroups, synonymId, tags, tagsInSynonymGroup]);

  const tagSynonymGroupMap = useMemo(() => {
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedTags
      .groupBy(tag => tag.synonymId)
      .mapToObject(t => t[0].synonymId, tags => tags);
  }, [tags]);

  const autocompleteOptionsGroups = useMemo(() => {
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
  }, [groups, synonymGroups, tags, tagsInCustomGroups]);

  const autocompleteOptionsTags = useMemo(() => {
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
  }, [groupId, synonymGroups, synonymId, tagSynonymGroupMap, tags]);

  const autocompleteOptions = useMemo(() => {
    return (autocompleteAction === 'addActiveSynonymsToAGroup'
      ? autocompleteOptionsGroups
      : autocompleteOptionsTags).map(option => ({
        ...option,
        synonyms: option.synonyms.map(synonym => synonym.text).join(', '),
      }));
  }, [autocompleteOptionsGroups, autocompleteOptionsTags, autocompleteAction]);

  const pageTitle = useMemo(() => {
    return decide([
      {
        when: () => !!tagId,
        then: () => 'Update selected Tag',
      },
      {
        when: () => !!synonymId,
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
  }, [groupId, synonymId, tagId]);

  const selectedGroupSelectedSynonym = useMemo(() => {
    if (!groupId || !synonymId) { return ''; }
    return tagsInCustomGroups.findOrThrow(t => t.group.id === groupId).synonyms.find(s => s.synonymId === synonymId)?.tags || '';
  }, [groupId, synonymId, tagsInCustomGroups]);

  return {
    ...tagsConfig,
    pageTitle,
    activeNoteId,
    autocompleteOptions,
    tagsInCustomGroups,
    tagsInSynonymGroup,
    selectedGroupSelectedSynonym,
    floatingRef,
    modalRef,
    autocompleteRef,
    selectedTagRef,
    settingsButtonRef,
    synonymOptionsRef,
    notify,
    props,
    store,
    ...state,
    setState,
  };
}
