import { useMemo, useRef } from 'react';

import { AutocompleteHandle } from '@/components/autocomplete/constants';
import { useNotifier } from '@/components/notifier';
import { useLocalStore, useStore } from '@/utils/store-utils';
import { useFloating } from '@floating-ui/react';
import { addToWhitelist } from 'olik/devtools';
import { initialState } from './constants';


export const useInputs = () => {

  const { store, state: { notes, tags, groups, synonymGroups, activeNoteId } } = useStore();
  const firstSelectedTag = useMemo(() => store.$state.tags.find(t => t.id === store.$state.configureTags), [store]);
  const { local, state: { synonymId, tagId, autocompleteText, groupId, autocompleteAction, modal } } = useLocalStore('tagsConfig', {
    ...initialState,
    tagId: firstSelectedTag?.id ?? null,
    synonymId: firstSelectedTag?.synonymId ?? null,
    autocompleteText: firstSelectedTag?.text ?? '',
    autocompleteAction: firstSelectedTag ? 'addSynonymsToActiveSynonyms' : null
  });
  useMemo(() => addToWhitelist([local.hoveringGroupId, local.hoveringSynonymId]), [local]);

  const floatingRef = useFloating<HTMLButtonElement>({ placement: 'left-start' });
  const settingsButtonRef = modal === 'synonymOptions' ? floatingRef.refs.setReference : null;
  const synonymOptionsRef = modal === 'synonymOptions' ? floatingRef.refs.setFloating : null;
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const selectedTagRef = useRef<HTMLDivElement>(null);
  const notify = useNotifier();

  const tagsInSynonymGroup = useMemo(() => {
    return tags
      .filter(tag => tag.synonymId === synonymId)
      .map((tag, index, array) => ({
        id: tag.id,
        text: (tagId === tag.id || (!tagId && tagId === tag.id) ? autocompleteText : tag.text).replace(/\s/g, '_'),
        first: index === 0,
        last: index === array.length - 1,
        selected: tag.id === tagId,
      }));
  }, [autocompleteText, synonymId, tagId, tags]);

  const tagsInCustomGroups = useMemo(() => {
    return [
      ...synonymGroups
        .filter(synonymGroup => synonymGroup.synonymId === synonymId)
        .map(synonymGroup => ({
          group: groups.findOrThrow(g => g.id === synonymGroup.groupId),
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
                tags: tags
                  .filter(t => t.synonymId === sg.synonymId)
                  .map((tag, index, array) => ({
                    ...tag,
                    text: tag.text.replace(/\s/g, '_'),
                    first: index === 0,
                    last: index === array.length - 1,
                  })),
              }))
          ].filterTruthy()
        })),
      ...groups
        .filter(group => !synonymGroups.some(sg => sg.groupId === group.id))
        .map(group => ({
          group,
          synonyms: [],
        })),
    ]
  }, [groups, synonymGroups, synonymId, tags, tagsInSynonymGroup]);

  const tagSynonymGroupMap = useMemo(() => {
    return tags
      .groupBy(tag => tag.synonymId)
      .mapToObject(t => t[0]!.synonymId, tags => tags);
  }, [tags]);

  const autocompleteOptionsGroups = useMemo(() => {
    return groups
      .filter(group => !tagsInCustomGroups.some(t => t.group.id === group.id))
      .map(group => ({
        value: group.id,
        label: group.name,
        synonyms: synonymGroups
          .filter(sg => sg.groupId === group.id)
          .flatMap(sg => tags.filter(t => t.synonymId === sg.synonymId)),
      }));
  }, [groups, synonymGroups, tags, tagsInCustomGroups]);

  const autocompleteOptionsTags = useMemo(() => {
    return tags
      .filter(t => {
        if (groupId)
          return t.synonymId !== synonymId && !synonymGroups
            .filter(sg => sg.groupId === groupId)
            .some(sg => sg.synonymId === t.synonymId)
        else
          return !synonymId || t.synonymId !== synonymId
      })
      .map(t => ({
        value: t.id,
        label: t.text,
        synonyms: tagSynonymGroupMap[t.synonymId]
      }));
  }, [groupId, synonymGroups, synonymId, tagSynonymGroupMap, tags]);

  const options = autocompleteAction === 'addActiveSynonymsToAGroup' ? autocompleteOptionsGroups : autocompleteOptionsTags;
  const autocompleteOptions = useMemo(() => {
    return options.map(option => ({
      ...option,
      synonyms: option.synonyms!.map(synonym => synonym.text).join(', '),
    }));
  }, [options]);

  const instruction = useMemo(() => {
    if (tagId)
      return 'Update selected Tag';
    if (synonymId)
      return 'Search for a Tag to add to active Group';
    if (groupId)
      return 'Search for a Tag to add to selected Group';
    return 'Search for a Tag or create a new Tag';
  }, [groupId, synonymId, tagId]);

  return {
    store,
    local,
    ...local.$state,
    instruction,
    activeNoteId,
    autocompleteOptions,
    tagsInCustomGroups,
    tagsInSynonymGroup,
    floatingRef,
    autocompleteRef,
    selectedTagRef,
    settingsButtonRef,
    synonymOptionsRef,
    notify,
    notes,
  };
}

