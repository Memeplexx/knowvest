"use client";
import { createStore } from 'olik';
import { createUseStoreHook } from 'olik-react';
import { configureSortModule } from 'olik/sort';
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';

configureSortModule();

export type AppState = typeof initialAppState;

export const indexedDbState = {
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
}

export const initialAppState = {
  ...indexedDbState,
  configureTags: false as boolean | TagId,
  mediaQuery: null as keyof typeof MediaQueries | null,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  noteTags: {} as { [noteId: NoteId]: Array<TagResult> },
};

const store = createStore(initialAppState);

export const { useStore, useLocalStore } = createUseStoreHook(store, {
  notesSorted: store.notes.$createSortedList.$withId.id.$sortedBy.dateUpdated.$descending(),
});
