"use client";
import { StoreContext, initialAppState } from '@/utils/constants'
import { createStore } from 'olik';
import { augmentOlikForReact } from 'olik-react';
import { useMemo } from "react";



export default function StoreProvider({ children }: { children: React.ReactNode }) {

  augmentOlikForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);

  return (
    <StoreContext.Provider
      value={store}
      children={children}
    />
  );
}