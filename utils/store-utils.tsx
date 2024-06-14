"use client";
import { createStoreHooks } from 'olik-react';
import { configureSortModule } from 'olik/sort';
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';

configureSortModule();



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

export const { useStore, useLocalStore } = createStoreHooks(initialAppState, store => ({
  notesSorted: store.notes.$createSortedList.$withId.id.$sortedBy.dateUpdated.$descending(),
}));

export type AppStore = ReturnType<typeof useStore>['store'];
