import { GroupId, SynonymId } from "@/actions/types";
import { AutocompleteHandle } from "@/components/control-autocomplete/constants";
import { useComponent } from "@/utils/react-utils";
import { store, useLocalStore, useStore } from "@/utils/store-utils";
import { useTextSearcher } from "@/utils/text-search-context";
import { useRouter } from "next/navigation";
import { derive } from "olik/derive";
import { addToWhitelist } from "olik/devtools";
import { useMemo, useRef } from "react";
import { AutocompleteOptionType, initialState } from "./constants";

export const useInputs = () => {

  const { tags, groups, synonymGroups, notes, searchResults, isMobileWidth } = useStore();
  const { local, state } = useLocalStore('search', initialState);
  useMemo(() => addToWhitelist([local.hoveredSynonymId, local.hoveredGroupId, local.hoveredSearchTerm]), [local]);
  const { selectedGroupIds, enabledGroupIds, selectedSynonymIds, enabledSynonymIds, autocompleteText, showingPane, enabledSearchTerms } = state;
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const router = useRouter();
  const textSearcher = useTextSearcher();
  const component = useComponent();

  const autocompleteSynonymOptions = useMemo(() => {
    return tags
      .groupBy(tags => tags.synonymId)
      .map(tags => ({
        value: `${tags[0]!.synonymId}-synonym`,
        type: 'synonym',
        label: `${tags.map(t => t.text).join(', ')}`,
        count: searchResults.filter(r => tags.some(t => t.synonymId === r.synonymId)).map(r => r.noteId).distinct().length,
        id: tags[0]!.synonymId,
      } as AutocompleteOptionType))
  }, [searchResults, tags]);

  const autocompleteSynonymOptionsFilteredBySelection = useMemo(() => {
    return autocompleteSynonymOptions
      .filter(option => !selectedSynonymIds.includes(option.id as SynonymId))
  }, [autocompleteSynonymOptions, selectedSynonymIds]);

  const autocompleteGroupOptions = useMemo(() => {
    return groups
      .map(group => ({ group, groupSynonymIds: synonymGroups.filter(sg => sg.groupId === group.id).map(sg => sg.synonymId) }))
      .map(({ group, groupSynonymIds }) => ({
        value: `${group.id}-group`,
        type: 'group',
        label: group.name,
        id: group.id,
        count: searchResults.filter(nt => groupSynonymIds.includes(nt.synonymId!)).map(nt => nt.noteId).distinct().length,
      } as AutocompleteOptionType));
  }, [groups, searchResults, synonymGroups]);

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

  const autocompleteOptions = useMemo(() => {
    const autocompleteTextToLowerCase = autocompleteText.toLowerCase();
    return allAutocompleteOptions
      .filter(o => o.label.toLowerCase().includes(autocompleteTextToLowerCase))
  }, [allAutocompleteOptions, autocompleteText]);

  const selectedSynonymTags = useMemo(() => {
    return selectedSynonymIds
      .map(synonymId => tags
        .filter(tag => tag.synonymId === synonymId))
      .filter(tags => tags.length > 0)
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
          }))
          .filter(s => s.tags.length > 0)
      }))
  }, [groups, selectedGroupIds, synonymGroups, tags]);

  const notesBySynonymIds = useMemo(() => {
    const tagIds = tags
      .filter(t => enabledSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return searchResults
      .filter(noteTag => tagIds.includes(noteTag.tagId))
  }, [tags, searchResults, enabledSynonymIds]);

  const notesByGroupSynonymIds = useMemo(() => {
    const enabledGroupSynonymIds = synonymGroups.filter(sg => enabledGroupIds.includes(sg.groupId)).flatMap(sg => sg.synonymId).distinct();
    const tagIds = tags
      .filter(t => enabledGroupSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return searchResults
      .filter(noteTag => tagIds.includes(noteTag.tagId))
  }, [synonymGroups, tags, searchResults, enabledGroupIds]);

  const notesBySearchTerms = useMemo(() => {
    return state.searchResults
      .filter(searchResult => searchResult.matches.some(t => enabledSearchTerms.includes(t.text)))
  }, [enabledSearchTerms, state.searchResults]);

  const notesFound = useMemo(() => {
    return [...notesBySynonymIds, ...notesByGroupSynonymIds, ...notesBySearchTerms]
      .groupBy(n => n.noteId)
      .sort((a, b) => b.length - a.length)
      .map(noteTags => ({
        note: notes.findOrThrow(n => n.id === noteTags[0]!.noteId),
        count: noteTags.length,
        matches: `${noteTags.length} match${noteTags.length === 1 ? '' : 'es'}`
      }));
  }, [notes, notesByGroupSynonymIds, notesBySearchTerms, notesBySynonymIds]);

  const enabledGroupSynonymIds = useMemo(() => {
    return derive(
      local.enabledGroupIds,
      store.synonymGroups
    ).$with((groupSynonymIds, synonymGroups) => synonymGroups
      .filter(synonymGroup => groupSynonymIds.includes(synonymGroup.groupId))
      .flatMap(synonymGroup => synonymGroup.synonymId)
      .distinct());
  }, [local]);

  const result = {
    local,
    ...state,
    autocompleteRef,
    autocompleteOptions,
    selectedSynonymTags,
    selectedGroupTags,
    notesFound,
    showSearchPane: !isMobileWidth || showingPane === 'search',
    showResultsPane: !isMobileWidth || showingPane === 'results',
    router,
    isMobileWidth,
    enabledGroupSynonymIds,
  };

  if (!component.isMounted)
    return result;
  if (component.hasStartedAsyncProcess)
    return result;

  component.startAsyncProcess();
  component.listen = local.enabledSearchTerms.$onChange(searchTerms => textSearcher.setSearchTerms(searchTerms));
  component.listen = textSearcher.onNotesSearched(searchResults => local.searchResults.$set(searchResults));
  component.completeAsyncProcess();

  return result;
}