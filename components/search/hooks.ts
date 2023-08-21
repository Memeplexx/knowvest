import { ForwardedRef, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { AutocompleteOptionType, Props, dialogWidth, initialState } from "./constants";
import { AutocompleteHandle } from "../autocomplete/constants";
import { useNestedStore } from "olik-react";
import { derive } from "olik";
import { OlikContext } from "@/utils/pages/home/constants";

export const useHooks = (ref: ForwardedRef<HTMLDivElement>, props: Props) => {

  const appStore = useContext(OlikContext)!;

  const { store, state } = useNestedStore(initialState).usingAccessor(s => s.search);

  const allAutocompleteOptions = derive(
    appStore.tags,
    appStore.groups,
    store.selectedSynonymIds,
    store.selectedGroupIds,
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
    store.autocompleteText,
  ).$with((allAutocompleteOptions, autocompleteText) => {
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteText.toLowerCase()))
  });

  const selectedSynonymTags = derive(
    store.selectedSynonymIds,
    appStore.tags,
  ).$with((selectedSynonymIds, tags) => {
    return selectedSynonymIds
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
  });

  const selectedGroupTags = derive(
    store.selectedGroupIds,
    appStore.groups,
    appStore.synonymGroups,
    appStore.tags,
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
    store.selectedSynonymIds,
    appStore.noteTags,
    appStore.notes,
    appStore.tags,
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
    const state = store.$state;
    const screenIsNarrow = window.innerWidth < dialogWidth;
    const payload = {
      showSearchPane: !screenIsNarrow || state.showingTab === 'search',
      showResultsPane: !screenIsNarrow || state.showingTab === 'results',
      screenIsNarrow,
    };
    if (payload.showSearchPane !== state.showSearchPane || payload.showResultsPane !== state.showResultsPane || state.screenIsNarrow !== screenIsNarrow) {
      store.$patch(payload);
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
    autocompleteRef: useRef<AutocompleteHandle>(null),
    bodyRef: useRef<HTMLDivElement>(null),
    autocompleteOptions: autocompleteOptions.$useState(),
    selectedSynonymTags: selectedSynonymTags.$useState(),
    selectedGroupTags: selectedGroupTags.$useState(),
    notesByTags: notesByTags.$useState(),
    tabTitleText,
    tabButtonText,
    props,
    ...state,
    store,
    appStore,
  }
}