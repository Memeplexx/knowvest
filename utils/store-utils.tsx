"use client";
import { Store, createStore } from 'olik';
import { augmentForReact, createUseStoreHook } from 'olik-react';
import { configureDevtools } from 'olik/devtools';
import { configureSortModule } from 'olik/sort';
import { createContext } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';

configureSortModule();

export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export const { useStore, useLocalStore } = createUseStoreHook(StoreContext);


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

augmentForReact() // invoke before initializing store
const store = createStore(initialAppState);

export const notesSorted = store.notes.$memoizeSortBy.dateUpdated.$descending();

export default function StoreProvider({ children }: { children: React.ReactNode }) {

  // augmentForReact() // invoke before initializing store
  // const store = useMemo(() => createStore(initialAppState), []);

  if (typeof (navigator) !== 'undefined' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    configureDevtools();

  return (
    <StoreContext.Provider
      value={store}
      children={children}
    />
  );
}

