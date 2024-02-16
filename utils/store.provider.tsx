"use client";
import { StoreContext, initialAppState } from '@/utils/constants'
import { createStore } from 'olik';
import { augmentOlikForReact } from 'olik-react';
import { useMemo } from "react";
import { getNotesSorted } from './functions';


export default function StoreProvider({ children }: { children: React.ReactNode }) {

  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);
  const notes = store.notes.$useState();
  const notesSorted = useMemo(() => getNotesSorted(notes), [notes]);

  return (
    <StoreContext.Provider
      value={{ store: store, notesSorted }}
      children={children}
    />
  );
}