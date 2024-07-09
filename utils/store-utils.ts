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
  store.searchResults.$onArray.$inserted,
  store.searchResults.$onArray.$deleted,
).$withAccumulator(new Map<NoteId, SearchResult[]>(), (accumulator, inserted, deleted) => {
  inserted.forEach(i => {
    const current = accumulator.get(i.noteId) ?? accumulator.set(i.noteId, []).get(i.noteId);
    current!.push(i);
  });
  deleted.forEach(d => {
    const current = accumulator.get(d.noteId);
    current?.splice(current.findIndex(i => i.synonymId === d.synonymId), 1);
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
