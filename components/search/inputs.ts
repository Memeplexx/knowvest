import { ForwardedRef, useCallback, useEffect, useMemo, useRef } from "react";
import { AutocompleteOptionType, Props, dialogWidth, initialState, tag } from "./constants";
import { AutocompleteHandle } from "../autocomplete/constants";
import { derive } from "olik/derive";
import { useNestedStore } from "@/utils/hooks";

export const useInputs = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const { store, state } = useNestedStore('search', initialState)!;

  const allAutocompleteOptions = derive(tag).$from(
    store.tags,
    store.groups,
    store.search.selectedSynonymIds,
    store.search.selectedGroupIds,
  ).$with((tags, groups, selectedSynonymIds, selectedGroupIds) => {
    return [
      ...tags
        .groupBy(tags => tags.synonymId)
        .map(tags => ({
          value: `${tags[0].synonymId}-synonym`,
          type: 'synonym',
          label: tags.map(t => t.text).join(', '),
          id: tags[0].synonymId,
          selected: selectedSynonymIds.includes(tags[0].synonymId),
        } as AutocompleteOptionType)),
      ...groups
        .map(g => ({
          value: `${g.id}-group`,
          type: 'group',
          label: g.name,
          id: g.id,
          selected: selectedGroupIds.includes(g.id),
        } as AutocompleteOptionType)),
    ]
  });

  const autocompleteOptions = derive(tag).$from(
    allAutocompleteOptions,
    store.search.autocompleteText,
  ).$with((allAutocompleteOptions, autocompleteText) => {
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteText.toLowerCase()))
  });

  const selectedSynonymTags = derive(tag).$from(
    store.search.selectedSynonymIds,
    store.tags,
  ).$with((selectedSynonymIds, tags) => {
    return selectedSynonymIds
      .map(synonymId => tags
        .filter(t => t.synonymId === synonymId)
        .map((tag, index, array) => ({
          ...tag,
          first: index === 0,
          last: index === array.length - 1,
        })))
  });

  const selectedGroupTags = derive(tag).$from(
    store.search.selectedGroupIds,
    store.groups,
    store.synonymGroups,
    store.tags,
  ).$with((selectedGroupIds, groups, synonymGroups, tags) => {
    return selectedGroupIds
      .map(groupId => ({
        groupId,
        name: groups.findOrThrow(g => g.id === groupId).name,
        synonyms: synonymGroups
          .filter(sg => sg.groupId === groupId)
          .map(sg => ({
            synonymId: sg.synonymId,
            tags: tags
              .filter(t => t.synonymId === sg.synonymId)
              .map((tags, index, array) => ({
                ...tags,
                first: index === 0,
                last: index === array.length - 1,
              })),
          }))
      }))
  });

  const notesByTags = derive(tag).$from(
    store.search.selectedSynonymIds,
    store.noteTags,
    store.notes,
    store.tags,
  ).$with((selectedSynonymIds, noteTags, notes, tags) => {
    const tagIds = tags
      .filter(t => selectedSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return noteTags
      .filter(nt => tagIds.includes(nt.tagId))
      .flatMap(nt => notes.filter(n => n.id === nt.noteId))
      .distinct(n => n.id);
  })

  const tabTitleText = useMemo(() => {
    return state.showingTab === 'search' ? 'Search' : 'Results';
  }, [state.showingTab]);
  const tabButtonText = useMemo(() => {
    return state.showingTab === 'search' ? `Results (${notesByTags.$state.length})` : 'Search';
  }, [state.showingTab, notesByTags]);

  const listener = useCallback(() => {
    const state = store.$state.search;
    const screenIsNarrow = window.innerWidth < dialogWidth;
    const payload = {
      showSearchPane: !screenIsNarrow || state.showingTab === 'search',
      showResultsPane: !screenIsNarrow || state.showingTab === 'results',
      screenIsNarrow,
    };
    if (payload.showSearchPane !== state.showSearchPane || payload.showResultsPane !== state.showResultsPane || state.screenIsNarrow !== screenIsNarrow) {
      store.search.$patch(payload);
    }
  }, [store])
  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener)
  }, [listener])
  useEffect(() => {
    listener();
  }, [listener]);

  return {
    store,
    autocompleteRef: useRef<AutocompleteHandle>(null),
    bodyRef: useRef<HTMLDivElement>(null),
    autocompleteOptions: autocompleteOptions.$useState(),
    selectedSynonymTags: selectedSynonymTags.$useState(),
    selectedGroupTags: selectedGroupTags.$useState(),
    notesByTags: notesByTags.$useState(),
    tabTitleText,
    tabButtonText,
    ...state,
    props,
  }
}