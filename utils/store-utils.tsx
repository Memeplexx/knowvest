"use client";
import { DeepReadonlyArray, Store, createStore } from 'olik';
import { augmentForReact, createUseStoreHook } from 'olik-react';
import { configureDevtools } from 'olik/devtools';
import { createContext, useMemo } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';



export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export const { useStore, useLocalStore } = createUseStoreHook(StoreContext);

const newArray = function <T>() {
  return new Array<T>() as DeepReadonlyArray<T>;
}

export const indexedDbState = {
  tags: newArray<TagDTO>(),
  notes: newArray<NoteDTO>(),
  groups: newArray<GroupDTO>(),
  synonymGroups: newArray<SynonymGroupDTO>(),
  flashCards: newArray<FlashCardDTO>(),
}

export const initialAppState = {
  ...indexedDbState,
  configureTags: false as boolean | TagId,
  mediaQuery: null as keyof typeof MediaQueries | null,
  activeNoteId: 0 as NoteId,
  synonymIds: newArray<SynonymId>(),
  noteTags: {} as { [noteId: NoteId]: DeepReadonlyArray<TagResult> },
};

export default function StoreProvider({ children }: { children: React.ReactNode }) {

  augmentForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);

  if (typeof (navigator) !== 'undefined' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    configureDevtools();

  return (
    <StoreContext.Provider
      value={store}
      children={children}
    />
  );
}

