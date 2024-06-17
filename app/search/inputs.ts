import { GroupId, NoteDTO, NoteId, SynonymId } from "@/actions/types";
import { AutocompleteHandle } from "@/components/autocomplete/constants";
import { useHeaderResizer } from "@/utils/app-utils";
import { useResizeListener } from "@/utils/dom-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { AutocompleteOptionType, dialogWidth, initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { headerExpanded, tags, groups, synonymGroups, notes, noteTags } } = useStore();
  const { local, state: { selectedGroupIds, selectedSynonymIds, enabledSynonymIds, autocompleteText, showingTab, showSearchPane } } = useLocalStore('search', initialState);
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const router = useRouter();

  if (!notes.length)
    redirect('/home');

  // Update header visibility as required
  useHeaderResizer(store);

  const autocompleteSynonymOptions = useMemo(() => {
    return tags
      .groupBy(tags => tags.synonymId)
      .map(tags => ({
        value: `${tags[0]!.synonymId}-synonym`,
        type: 'synonym',
        label: tags.map(t => t.text).join(', '),
        id: tags[0]!.synonymId,
      } as AutocompleteOptionType))
  }, [tags]);

  const autocompleteSynonymOptionsFilteredBySelection = useMemo(() => {
    return autocompleteSynonymOptions
      .filter(option => !selectedSynonymIds.includes(option.id as SynonymId))
  }, [autocompleteSynonymOptions, selectedSynonymIds]);

  const autocompleteGroupOptions = useMemo(() => {
    return groups
      .map(group => ({
        value: `${group.id}-group`,
        type: 'group',
        label: group.name,
        id: group.id,
      } as AutocompleteOptionType))
  }, [groups]);

  const autocompleteGroupOptionsFilteredBySelection = useMemo(() => {
    return autocompleteGroupOptions
      .filter(option => !selectedGroupIds.includes(option.id as GroupId))
  }, [autocompleteGroupOptions, selectedGroupIds]);

  const allAutocompleteOptions = useMemo(() => {
    return [
      ...autocompleteSynonymOptionsFilteredBySelection,
      ...autocompleteGroupOptionsFilteredBySelection,
    ]
  }, [autocompleteGroupOptionsFilteredBySelection, autocompleteSynonymOptionsFilteredBySelection]);

  const autocompleteOptionsFilteredBySearchString = useMemo(() => {
    const autocompleteTextToLowerCase = autocompleteText.toLowerCase();
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteTextToLowerCase))
  }, [allAutocompleteOptions, autocompleteText]);

  const selectedSynonymTags = useMemo(() => {
    return selectedSynonymIds
      .map(synonymId => tags
        .filter(tag => tag.synonymId === synonymId))
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
              .filter(t => t.synonymId === sg.synonymId),
          })).filter(s => s.tags.length > 0)
      }))
  }, [groups, selectedGroupIds, synonymGroups, tags]);

  const notesByTags = useMemo(() => {
    const tagIds = tags
      .filter(t => selectedSynonymIds.includes(t.synonymId) && enabledSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return Object.entries(noteTags).flatMap(([noteId, tagSummaries]) => {
      if (tagSummaries.some(tagSummary => tagIds.includes(tagSummary.id)))
        return notes.findOrThrow(n => n.id === +noteId as NoteId);
      return new Array<NoteDTO>();
    });
  }, [tags, noteTags, selectedSynonymIds, enabledSynonymIds, notes]);

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
    headerExpanded,
    ...local.$state,
    autocompleteRef,
    autocompleteOptions: autocompleteOptionsFilteredBySearchString,
    selectedSynonymTags,
    selectedGroupTags,
    notesByTags,
    notes,
    tabTitleText: showingTab === 'search' ? 'Search' : 'Results',
    tabButtonText: showingTab === 'search' ? `Results (${notesByTags.length})` : 'Search',
    router,
  }
}