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
  noteTags: new Array<SearchResult & { noteId: NoteId }>(),
  showLoader: false,
  showMenu: false,
});

export const notesSorted = store.notes
  .$deriveSortedList
  .$withId.id
  .$sortedBy.dateUpdated
  .$descending();

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
