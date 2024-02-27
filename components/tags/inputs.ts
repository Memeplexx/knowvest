import { useStore } from "@/utils/store-utils";
import { useMemo, useState } from "react";
import { initialState, initialTransientState } from "./constants";

export const useInputs = () => {

  const { store, tagsComponent, tags, synonymIds, noteTags, activeNoteId, groups, synonymGroups, stateInitialized } = useStore(initialState);

  const [state, setState] = useState(initialTransientState)

  const tagsForActiveNote = useMemo(() => {
    return noteTags
      .filter(nt => nt.noteId === activeNoteId)
      .map(nt => nt.tagId)
      .map(tagId => tags.find(t => t.id === tagId))
      .map(tag => tag?.synonymId)
      .filterTruthy()
      .distinct()
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(tgs => ({
        synonymId: tgs[0]!.synonymId,
        selected: synonymIds.includes(tgs[0]!.synonymId),
        tags: tgs.map((tag, index, array) => ({
          ...tag,
          first: index === 0,
          last: index === array.length - 1,
        })),
      }))
  }, [tags, synonymIds, noteTags, activeNoteId]);

  const allActiveTagsSelected = useMemo(() => {
    return tagsForActiveNote
      .every(t => t.selected);
  }, [tagsForActiveNote]);

  const groupsWithSynonyms = useMemo(() => {
    return noteTags
      .filter(nt => nt.noteId === activeNoteId)
      .flatMap(nt => tags.filter(t => t.id === nt.tagId))
      .flatMap(tag => synonymGroups.filter(sg => sg.synonymId === tag.synonymId))
      .groupBy(sg => sg.groupId)
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
                first: index === 0,
                last: index === array.length - 1,
              })),
          })),
      }));
  }, [activeNoteId, groups, noteTags, synonymGroups, synonymIds, tags]);

  const allGroupTagsSelected = useMemo(() => {
    return groupsWithSynonyms
      .mapToMap(g => g.groupId, g => g.synonyms.every(s => s.selected));
  }, [groupsWithSynonyms]);

  return {
    store,
    stateInitialized,
    ...tagsComponent,
    groupsWithSynonyms,
    tagsForActiveNote,
    allGroupTagsSelected,
    allActiveTagsSelected,
    ...state,
    setState,
  };
};