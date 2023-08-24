import { ForwardedRef, useCallback, useEffect, useMemo, useRef } from "react";
import { AutocompleteOptionType, Props, dialogWidth } from "./constants";
import { AutocompleteHandle } from "../autocomplete/constants";
import { derive } from "olik";
import { store } from "@/utils/store";

export const useInputs = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const state = store.search.$useState();

  const allAutocompleteOptions = derive(
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

  const autocompleteOptions = derive(
    allAutocompleteOptions,
    store.search.autocompleteText,
  ).$with((allAutocompleteOptions, autocompleteText) => {
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteText.toLowerCase()))
  });

  const selectedSynonymTags = derive(
    store.search.selectedSynonymIds,
    store.tags,
  ).$with((selectedSynonymIds, tags) => {
    return selectedSynonymIds
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
  });

  const selectedGroupTags = derive(
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
            tags: tags.filter(t => t.synonymId === sg.synonymId),
          }))
      }))
  });

  const notesByTags = derive(
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
    return state.showingTab === 'search' ? 'Showing Search Pane' : 'Showing Results Pane';
  }, [state.showingTab]);
  const tabButtonText = useMemo(() => {
    return state.showingTab === 'search' ? `View Results (${notesByTags.$state.length})` : 'View Search Pane';
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
  }, [])
  useEffect(() => {
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener)
  }, [listener])
  useEffect(() => {
    listener();
  }, [listener]);

  return {
    refs: {
      autocomplete: useRef<AutocompleteHandle>(null),
      body: useRef<HTMLDivElement>(null),
    },
    state: {
      autocompleteOptions: autocompleteOptions.$useState(),
      selectedSynonymTags: selectedSynonymTags.$useState(),
      selectedGroupTags: selectedGroupTags.$useState(),
      notesByTags: notesByTags.$useState(),
      tabTitleText,
      tabButtonText,
      ...state,
    },
    props,
  }
}