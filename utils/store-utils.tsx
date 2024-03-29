"use client";
import { Store, createStore } from 'olik';
import { connectOlikDevtoolsToStore } from 'olik/devtools';
import { augmentOlikForReact, createUseStoreHook } from 'olik-react';
import { createContext, useMemo } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '../actions/types';

export type AppState = typeof initialAppState;

export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export const useStore = createUseStoreHook(StoreContext);

export const indexedDbState = {
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  noteTags: new Array<NoteTagDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
}

export const initialAppState = {
  ...indexedDbState,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  stateInitialized: false,
  writingNote: false,
  writingNoteTags: false,
};

export default function StoreProvider({ children }: { children: React.ReactNode }) {

  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);

  if (typeof(navigator) !== 'undefined' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    connectOlikDevtoolsToStore();
  }

  return (
    <StoreContext.Provider
      value={store}
      children={children}
    />
  );
}

