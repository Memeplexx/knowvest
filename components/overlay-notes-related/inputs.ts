import { useLocalStore, useStore } from "@/utils/store-utils";
import { addToWhitelist } from "olik/devtools";
import { useMemo } from "react";
import { initialState } from "./constants";

export const useInputs = () => {

  const { activeNoteId, tags, synonymIds, synonymGroups, groups, searchResults, configureTags } = useStore();
  const { local, state } = useLocalStore('tagsComponent', initialState);
  useMemo(() => addToWhitelist([local.hoveringGroupId, local.hoveringSynonymId]), [local]);

  const tagsForActiveNote = useMemo(() => {
    return searchResults
      .filter(r => r.noteId === activeNoteId)
      .map(tn => tn.synonymId)
      .distinct()
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
      .filter(tags => !!tags.length)
      .map(tags => ({
        synonymId: tags[0]!.synonymId,
        selected: synonymIds.includes(tags[0]!.synonymId),
        tags: tags.map((tag, index, array) => ({
          ...tag,
          text: tag.text.replace(/\s/g, '_'),
          first: index === 0,
          last: index === array.length - 1,
        })),
      }));
  }, [searchResults, activeNoteId, tags, synonymIds]);

  const groupsWithSynonyms = useMemo(() => {
    return searchResults
      .filter(r => r.noteId === activeNoteId)
      .map(tn => tn.synonymId)
      .distinct()
      .flatMap(synonymId => synonymGroups.filter(sg => sg.synonymId === synonymId))
      .groupBy(sg => sg.groupId)
      .filter(sg => !!sg.length)
      .map(group => ({
        groupId: group[0]!.groupId,
        groupName: groups.findOrThrow(g => g.id === group[0]!.groupId).name,
        synonyms: synonymGroups
          .filter(sg => sg.groupId === group[0]!.groupId)
          .map(sg => ({
            id: sg.synonymId,
            selected: synonymIds.includes(sg.synonymId),
            tags: tags
              .filter(t => t.synonymId === sg.synonymId)
              .map((tag, index, array) => ({
                ...tag,
                text: tag.text.replace(/\s/g, '_'),
                first: index === 0,
                last: index === array.length - 1,
              })),
          })),
      }));
  }, [activeNoteId, groups, synonymGroups, synonymIds, searchResults, tags]);

  const allActiveTagsSelected = useMemo(() => {
    return tagsForActiveNote
      .every(t => t.selected);
  }, [tagsForActiveNote]);

  const allGroupTagsSelected = useMemo(() => {
    return groupsWithSynonyms
      .mapToMap(g => g.groupId, g => g.synonyms.every(s => s.selected));
  }, [groupsWithSynonyms]);

  return {
    local,
    ...state,
    groupsWithSynonyms,
    tagsForActiveNote,
    allGroupTagsSelected,
    allActiveTagsSelected,
    configureTags,
  };
};