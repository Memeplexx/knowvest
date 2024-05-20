"use client";
import { BasicRecord, DeepReadonly, StoreDef, createStore } from 'olik';
import { augmentForReact } from 'olik-react';
import { configureDevtools } from 'olik/devtools';
import { Context, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '../actions/types';


export type ReactStoreLocal<S, Key extends string, Patch> = Omit<StoreDef<S & { $local: Patch }>, '$state'> & { $state: DeepReadonly<S & { [k in Key]: Patch }> };
export type CreateUseStoreHookLocal<S> = { local: StoreDef<S>, state: DeepReadonly<S> };
export type CreateUseStoreHookGlobal<S> = { store: StoreDef<S>, state: DeepReadonly<S> };

export const createUseStoreHook = <S extends BasicRecord>(context: Context<StoreDef<S> | undefined>) => {

  return {
    useStore: () => {
      // get store context and create refs
      const store = useContext(context)!;
      const refs = useRef({ store });
      const keys = useMemo(() => new Set<string>(), []);

      // ensure that store changes result in rerender
      const [, setN] = useState(0);
      useEffect(() => {
        const rootSubStores = [...keys].map(k => store[k]);
        const subStores = rootSubStores;
        const listeners = subStores.map(subStore => subStore!.$onChange(() => setN(nn => nn + 1)));
        return () => listeners.forEach(l => l.unsubscribe());
      }, [keys, store]);

      const stateProxy = useMemo(() => new Proxy({}, {
        get(_, p: string) {
          keys.add(p);
          return refs.current.store.$state[p]!;
        }
      }), [keys]);

      return useMemo(() => new Proxy({} as CreateUseStoreHookGlobal<S>, {
        get(_, p: string) {
          if (p === 'state')
            return stateProxy;
          if (p === 'store')
            return store;
          throw new Error(`Property ${p} does not exist on store`);
        },
      }), [stateProxy, store]);
    },
    useLocalStore: <Key extends string, Patch extends BasicRecord>(key: Key, state: Patch) => {
      // get store context and create refs
      const store = useContext(context)!;
      const refs = useRef({ store, key, state, subStore: undefined as CreateUseStoreHookLocal<Patch> | undefined });
      const keys = useMemo(() => new Set<string>(), []);

      // create substore if needed
      if (!store.$state[key])
        store[key]!.$setNew(refs.current.state);

      // ensure that store changes result in rerender
      const [, setN] = useState(0);
      useEffect(() => {
        const listener = store[key]?.$onChange(() => setN(nn => nn + 1));
        return () => listener?.unsubscribe();
      }, [key, keys, store]);

      const storeMemo = useMemo(() => {
        return store[key!]!;
      }, [key, store]);

      return useMemo(() => new Proxy({} as CreateUseStoreHookLocal<Patch>, {
        get(_, p: string) {
          if (p === 'state')
            return storeMemo.$state;
          if (p === 'local')
            return storeMemo;
          throw new Error(`Property ${p} does not exist on store`);
        },
      }), [storeMemo]);
    }
  };
}



export type AppState = typeof initialAppState;

export const StoreContext = createContext<StoreDef<AppState> | undefined>(undefined);

export const { useStore, useLocalStore } = createUseStoreHook<AppState>(StoreContext);

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

  augmentForReact() // invoke before initializing store
  const store = useMemo(() => createStore(initialAppState), []);

  if (typeof (navigator) !== 'undefined' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    configureDevtools();
  }

  return (
    <StoreContext.Provider
      value={store}
      children={children}
    />
  );
}

