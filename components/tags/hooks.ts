import { useForwardedRef } from "@/utils/hooks";
import { store } from "@/utils/store";
import { derive } from "olik";
import { ForwardedRef } from "react";

export const useHooks = (ref: ForwardedRef<HTMLElement>) => {

  const state = store.tagsPanel.$useState();

  const tagIdsForActiveNote = derive(
    store.activeNoteId,
    store.noteTags,
  ).$with((activeNoteId, noteTags) => {
    return noteTags
      .filter(nt => nt.noteId === activeNoteId)
      .map(tn => tn.tagId);
  });

  const tagsForActiveNote = derive(
    store.tags,
    store.synonymIds,
    tagIdsForActiveNote,
  ).$with((tags, synonymIds, tagIdsForActiveNote) => {
    return tagIdsForActiveNote
      .map(tagId => tags.findOrThrow(t => t.id === tagId).synonymId)
      .distinct()
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(tags => ({
        synonymId: tags[0].synonymId,
        selected: synonymIds.includes(tags[0].synonymId),
        tags: tags.map(tag => ({
          ...tag,
          active: tagIdsForActiveNote.includes(tag.id),
        })),
      }))
  });

  const allActiveTagsSelected = derive(
    tagsForActiveNote,
  ).$with((tagsForActiveNote) => {
    return tagsForActiveNote
      .every(t => t.selected);
  })

  const groupsWithSynonyms = derive(
    store.groups,
    store.noteTags,
    store.synonymGroups,
    store.tags,
    store.synonymIds,
    tagIdsForActiveNote,
  ).$with((groups, noteTags, synonymGroups, tags, synonymIds, tagIdsForActiveNote) => {
    return noteTags
      .filter(nt => tagIdsForActiveNote.includes(nt.tagId))
      .flatMap(nt => tags.filter(t => t.id === nt.tagId))
      .flatMap(tag => synonymGroups.filter(sg => sg.synonymId === tag.synonymId))
      .groupBy(sg => sg.groupId)
      .map(group => ({
        groupId: group[0].groupId,
        groupName: groups.findOrThrow(g => g.id === group[0].groupId).name,
        synonyms: synonymGroups
          .filter(sg => sg.groupId === group[0].groupId)
          .map(sg => ({
            id: sg.synonymId,
            selected: synonymIds.includes(sg.synonymId),
            tags: tags
              .filter(t => t.synonymId === sg.synonymId)
              .map(tag => ({
                ...tag,
                active: tagIdsForActiveNote.includes(tag.id),
              })),
          })),
      }));
  });

  const allGroupTagsSelected = derive(
    groupsWithSynonyms,
  ).$with((groupsWithSynonyms) => {
    return groupsWithSynonyms
      .mapToMap(g => g.groupId, g => g.synonyms.every(s => s.selected));
  });

  return {
    state: {
      ...state,
      groupsWithSynonyms: groupsWithSynonyms.$useState(),
      tagsForActiveNote: tagsForActiveNote.$useState(),
      allGroupTagsSelected: allGroupTagsSelected.$useState(),
      allActiveTagsSelected: allActiveTagsSelected.$useState(),
      tagIdsForActiveNote: tagIdsForActiveNote.$useState(),
    },
    refs: {
      container: useForwardedRef(ref),
    }
  };
};