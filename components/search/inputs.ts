import { GroupId, SynonymId } from "@/actions/types";
import { AutocompleteHandle } from "@/components/autocomplete/constants";
import { useResizeListener } from "@/utils/dom-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { AutocompleteOptionType, dialogWidth, initialState } from "./constants";

export const useInputs = () => {

  const { store, state: { tags, groups, synonymGroups, notes, noteTags, isMobileWidth } } = useStore();
  const { local, state: { selectedGroupIds, selectedSynonymIds, enabledSynonymIds, autocompleteText, showingPane, showSearchPane } } = useLocalStore('search', initialState);
  const autocompleteRef = useRef<AutocompleteHandle>(null);
  const router = useRouter();

  const autocompleteSynonymOptions = useMemo(() => {
    return tags
      .groupBy(tags => tags.synonymId)
      .map(tags => ({
        value: `${tags[0]!.synonymId}-synonym`,
        type: 'synonym',
        label: `${tags.map(t => t.text).join(', ')}`,
        count: noteTags.filter(nt => tags.some(t => t.synonymId === nt.synonymId)).map(nt => nt.noteId).distinct().length,
        id: tags[0]!.synonymId,
      } as AutocompleteOptionType))
  }, [noteTags, tags]);

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
        count: noteTags.filter(nt => groupSynonymIds.includes(nt.synonymId!)).map(nt => nt.noteId).distinct().length,
      } as AutocompleteOptionType));
  }, [groups, noteTags, synonymGroups]);

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
          })).filter(s => s.tags.length > 0)
      }))
  }, [groups, selectedGroupIds, synonymGroups, tags]);

  const notesByTags = useMemo(() => {
    const tagIds = tags
      .filter(t => selectedSynonymIds.includes(t.synonymId) && enabledSynonymIds.includes(t.synonymId))
      .map(t => t.id);
    return noteTags
      .filter(noteTag => tagIds.includes(noteTag.id))
      .distinct(nt => nt.noteId)
      .map(noteTag => notes.findOrThrow(n => n.id === noteTag.noteId));
  }, [tags, noteTags, selectedSynonymIds, enabledSynonymIds, notes]);

  useResizeListener(useCallback(() => {
    const state = local.$state;
    const screenIsNarrow = window.innerWidth < dialogWidth;
    const payload = {
      showSearchPane: !screenIsNarrow || showingPane === 'search',
      showResultsPane: !screenIsNarrow || showingPane === 'results',
      screenIsNarrow,
    };
    if (payload.showSearchPane !== showSearchPane || payload.showResultsPane !== state.showResultsPane || state.screenIsNarrow !== screenIsNarrow)
      local.$patch(payload);
  }, [local, showSearchPane, showingPane]));

  return {
    store,
    local,
    ...local.$state,
    autocompleteRef,
    autocompleteOptions,
    selectedSynonymTags,
    selectedGroupTags,
    notesByTags,
    notes,
    showSearchPane: showingPane === 'search',
    showResultsPane: !isMobileWidth || showingPane === 'results',
    router,
    isMobileWidth,
  }
}