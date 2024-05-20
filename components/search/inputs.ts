import { useResizeListener } from "@/utils/dom-utils";
import { useForwardedRef } from "@/utils/react-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { ForwardedRef, useCallback, useMemo, useRef } from "react";
import { AutocompleteHandle } from "../autocomplete/constants";
import { AutocompleteOptionType, dialogWidth, initialState } from "./constants";

export const useInputs = (ref: ForwardedRef<HTMLDivElement>) => {

  const { store, state: { tags, groups, synonymGroups, noteTags, notes } } = useStore();
  const { local, state: { selectedGroupIds, selectedSynonymIds, autocompleteText, showingTab, showSearchPane } } = useLocalStore('search', initialState);
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const bodyRef = useForwardedRef(ref);

  const allAutocompleteOptions = useMemo(() => {
    return [
      ...tags
        .groupBy(tags => tags.synonymId)
        .map(tags => ({
          value: `${tags[0]!.synonymId}-synonym`,
          type: 'synonym',
          label: tags.map(t => t.text).join(', '),
          id: tags[0]!.synonymId,
          selected: selectedSynonymIds.includes(tags[0]!.synonymId),
        } as AutocompleteOptionType)),
      ...groups
        .map(group => ({
          value: `${group.id}-group`,
          type: 'group',
          label: group.name,
          id: group.id,
          selected: selectedGroupIds.includes(group.id),
        } as AutocompleteOptionType)),
    ]
  }, [groups, selectedGroupIds, selectedSynonymIds, tags]);

  const autocompleteOptions = useMemo(() => {
    const autocompleteTextToLowerCase = autocompleteText.toLowerCase();
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteTextToLowerCase))
  }, [allAutocompleteOptions, autocompleteText]);

  const selectedSynonymTags = useMemo(() => {
    return selectedSynonymIds
      .map(synonymId => tags
        .filter(tag => tag.synonymId === synonymId)
        .map((tag, index, array) => ({
          ...tag,
          first: index === 0,
          last: index === array.length - 1,
        })))
  }, [selectedSynonymIds, tags]);

  const selectedGroupTags = useMemo(() => {
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
  }, [groups, selectedGroupIds, synonymGroups, tags]);

  const notesByTags = useMemo(() => {
    const tagIds = tags
      .filter(t => selectedSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return noteTags
      .filter(nt => tagIds.includes(nt.tagId))
      .flatMap(nt => notes.filter(n => n.id === nt.noteId))
      .distinct(n => n.id);
  }, [noteTags, notes, selectedSynonymIds, tags]);

  useResizeListener(useCallback(() => {
    const state = local.$state;
    const screenIsNarrow = window.innerWidth < dialogWidth;
    const payload = {
      showSearchPane: !screenIsNarrow || showingTab === 'search',
      showResultsPane: !screenIsNarrow || showingTab === 'results',
      screenIsNarrow,
    };
    if (payload.showSearchPane !== showSearchPane || payload.showResultsPane !== state.showResultsPane || state.screenIsNarrow !== screenIsNarrow)
      local.$patch(payload);
  }, [local, showSearchPane, showingTab]));

  return {
    store,
    local,
    ...local.$state,
    autocompleteRef,
    bodyRef,
    autocompleteOptions,
    selectedSynonymTags,
    selectedGroupTags,
    notesByTags,
    tabTitleText: showingTab === 'search' ? 'Search' : 'Results',
    tabButtonText: showingTab === 'search' ? `Results (${notesByTags.length})` : 'Search',
  }
}