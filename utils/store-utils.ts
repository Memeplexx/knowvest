"use client";
import { createStore } from 'olik';
import { createUseDerivationHooks, createUseStoreHooks } from 'olik-react';
import { configureSortModule } from 'olik/sort';
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';

configureSortModule();

const initialState = {
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
  configureTags: false as boolean | TagId,
  mediaQuery: null as keyof typeof MediaQueries | null,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  noteTags: new Array<TagResult & { noteId: NoteId }>(),
  headerExpanded: true,
  showLoader: false,
}

const store = createStore(initialState);

export type AppStore = typeof store;

export const { useStore, useLocalStore } = createUseStoreHooks(store);

export const notesSorted = store.notes.$createSortedList.$withId.id.$sortedBy.dateUpdated.$descending();

export const { useDerivations } = createUseDerivationHooks({ notesSorted });


