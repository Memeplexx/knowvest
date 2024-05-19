"use client";
import { BasicRecord, DeepReadonly, StoreDef, createStore } from 'olik';
import { augmentForReact } from 'olik-react';
import { configureDevtools } from 'olik/devtools';
import { Context, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, NoteTagDTO, SynonymGroupDTO, SynonymId, TagDTO } from '../actions/types';


export type ReactStoreLocal<S, Key extends string, Patch> = Omit<StoreDef<S & { $local: Patch }>, '$state'> & { $state: DeepReadonly<S & { [k in Key]: Patch }> };
export type CreateUseStoreHookLocal<S, Key extends string, Patch> = { store: ReactStoreLocal<S, Key, Patch>, state: DeepReadonly<S & { $local: Patch }> };
export type CreateUseStoreHookGlobal<S> = { store: StoreDef<S>, state: DeepReadonly<S> };

export const createUseStoreHook = <S extends BasicRecord>(context: Context<StoreDef<S> | undefined>) => {

  function useStore(): CreateUseStoreHookGlobal<S>
  function useStore<Key extends string, Patch extends BasicRecord>(key: Key, state: Patch): CreateUseStoreHookLocal<S, Key, Patch>
  function useStore<Key extends string, Patch extends BasicRecord>(key?: Key, state?: Patch): CreateUseStoreHookGlobal<S> | CreateUseStoreHookLocal<S, Key, Patch> {

    // get store context and create refs
    const store = useContext(context)!;
    const refs = useRef({ store, key, state, subStore: undefined as CreateUseStoreHookLocal<S, Key, Patch> | undefined });
    const keys = useMemo(() => new Set<string>(), []);

    // create substore if needed
    if (key && state && !store.$state[key])
      store[key]!.$setNew(refs.current.state as Patch);

    // ensure that store changes result in rerender
    const [, setN] = useState(0);
    useEffect(() => {
      const rootSubStores = [...keys].map(k => store[k]);
      const subStores = key ? [store[key], ...rootSubStores] : rootSubStores;
      const listeners = subStores.map(subStore => subStore!.$onChange(() => setN(nn => nn + 1)));
      return () => listeners.forEach(l => l.unsubscribe());
    }, [key, keys, store]);

    const storeProxy = useMemo(() => new Proxy({}, {
      get(_, p: string) {
        if (p === '$local') {
          if (!refs.current.subStore)
            refs.current.subStore = store[key!] as unknown as CreateUseStoreHookLocal<S, Key, Patch>;
          return refs.current.subStore;
        }
        return store[p];
      }
    }), [store, key]);

    const stateProxy = useMemo(() => new Proxy({}, {
      get(_, p: string) {
        if (p === '$local')
          return refs.current.store.$state[key!] ?? refs.current.state;
        keys.add(p);
        return refs.current.store.$state[p]!;
      }
    }), [keys, key]);

    return useMemo(() => new Proxy({} as CreateUseStoreHookLocal<S, Key, Patch>, {
      get(_, p: string) {
        if (p === 'state')
          return stateProxy;
        if (p === 'store')
          return storeProxy;
        throw new Error(`Property ${p} does not exist on store`);
      },
    }), [stateProxy, storeProxy]);
  }
  return useStore;
}

export type AppState = typeof initialAppState;

export const StoreContext = createContext<StoreDef<AppState> | undefined>(undefined);

export const useStore = createUseStoreHook<AppState>(StoreContext);

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

