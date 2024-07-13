"use client";
import { createStore } from 'olik';
import { createDerivationHooks, createStoreHooks } from 'olik-react';
import { derive } from 'olik/derive';
import { configureSortModule } from 'olik/sort';
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { SearchResult } from './text-search-utils';

configureSortModule();

export const store = createStore({
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
  configureTags: false as boolean | TagId,
  isMobileWidth: false,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  searchResults: new Array<SearchResult & { noteId: NoteId }>(),
  showLoader: false,
  showMenu: false,
  previousNotesScrollIndex: 0,
  relatedNotesScrollIndex: 0,
});

export const notesSorted = store.notes
  .$deriveSortedList
  .$withId.id
  .$sortedBy.dateUpdated
  .$descending();

export const searchResultsByNoteId = derive(
  store.searchResults.$onArray.$elementsInserted,
  store.searchResults.$onArray.$elementsDeleted,
).$withAccumulator(new Map<NoteId, SearchResult[]>(), (accumulator, inserted, deleted) => {
  inserted.forEach(searchResult => {
    const current = accumulator.get(searchResult.noteId) ?? accumulator.set(searchResult.noteId, []).get(searchResult.noteId);
    current!.push(searchResult);
  });
  deleted.forEach(searchResult => {
    const current = accumulator.get(searchResult.noteId);
    current?.splice(current.findIndex(i => i.synonymId === searchResult.synonymId), 1);
  });
});

export const groupSynonymIds = derive(
  store.synonymGroups,
  store.synonymIds
).$with((synonymGroups, synonymIds) => synonymGroups
  .filter(synonymGroup => synonymIds.includes(synonymGroup.synonymId))
  .flatMap(synonymGroup => synonymGroups.filter(sg => sg.groupId === synonymGroup.groupId))
  .map(synonymGroup => synonymGroup.synonymId)
  .filter(synonymId => !synonymIds.includes(synonymId)));

export const { useStore, useLocalStore } = createStoreHooks(store);

export const { useDerivations } = createDerivationHooks({ notesSorted });
