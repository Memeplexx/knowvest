import { derive } from "olik/derive";
import { initialState, tags } from "./constants";
import { useNestedStore } from "@/utils/hooks";

export const useInputs = () => {

  const {store, state} = useNestedStore('tagsPanel', initialState)!;

  const tagsForActiveNote = derive(tags).$from(
    store.tags,
    store.synonymIds,
    store.noteTags,
    store.activeNoteId,
  ).$with((tags, synonymIds, noteTags, activeNoteId) => {
    const unArchivedNoteTags = noteTags.filter(nt => !nt.isArchived);
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedNoteTags
      .filter(nt => nt.noteId === activeNoteId)
      .map(nt => nt.tagId)
      .map(tagId => unArchivedTags.find(t => t.id === tagId))
      .map(tag => tag?.synonymId)
      .filterTruthy()
      .distinct()
      .map(synonymId => tags.filter(t => t.synonymId === synonymId))
      .map(tags => ({
        synonymId: tags[0].synonymId,
        selected: synonymIds.includes(tags[0].synonymId),
        tags: tags.map((tag, index, array) => ({
          ...tag,
          first: index === 0,
          last: index === array.length - 1,
        })),
      }))
  });

  const allActiveTagsSelected = derive(tags).$from(
    tagsForActiveNote,
  ).$with((tagsForActiveNote) => {
    return tagsForActiveNote
      .every(t => t.selected);
  })

  const groupsWithSynonyms = derive(tags).$from(
    store.groups,
    store.noteTags,
    store.synonymGroups,
    store.tags,
    store.synonymIds,
    store.activeNoteId,
  ).$with((groups, noteTags, synonymGroups, tags, synonymIds, activeNoteId) => {
    const unArchivedGroups = groups.filter(g => !g.isArchived);
    const unArchivedNoteTags = noteTags.filter(nt => !nt.isArchived);
    const unArchivedSynonymGroups = synonymGroups.filter(sg => !sg.isArchived);
    const unArchivedTags = tags.filter(t => !t.isArchived);
    return unArchivedNoteTags
      .filter(nt => nt.noteId === activeNoteId)
      .flatMap(nt => unArchivedTags.filter(t => t.id === nt.tagId))
      .flatMap(tag => unArchivedSynonymGroups.filter(sg => sg.synonymId === tag.synonymId))
      .groupBy(sg => sg.groupId)
      .filter(group => !group[0].isArchived)
      .map(group => ({
        groupId: group[0].groupId,
        groupName: unArchivedGroups.findOrThrow(g => g.id === group[0].groupId).name,
        synonyms: unArchivedSynonymGroups
          .filter(sg => sg.groupId === group[0].groupId)
          .map(sg => ({
            id: sg.synonymId,
            selected: synonymIds.includes(sg.synonymId),
            tags: unArchivedTags
              .filter(t => t.synonymId === sg.synonymId)
              .map((tag, index, array) => ({
                ...tag,
                first: index === 0,
                last: index === array.length - 1,
              })),
          })),
      }));
  });

  const allGroupTagsSelected = derive(tags).$from(
    groupsWithSynonyms,
  ).$with((groupsWithSynonyms) => {
    return groupsWithSynonyms
      .mapToMap(g => g.groupId, g => g.synonyms.every(s => s.selected));
  });

  return {
    store,
    ...state,
    groupsWithSynonyms: groupsWithSynonyms.$useState(),
    tagsForActiveNote: tagsForActiveNote.$useState(),
    allGroupTagsSelected: allGroupTagsSelected.$useState(),
    allActiveTagsSelected: allActiveTagsSelected.$useState(),
  };
};