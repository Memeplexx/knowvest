"use client";
import { BasicRecord, DeepReadonly, Derivation, SetNewNode, SortMemo, SortableProperty, Store, createStore } from 'olik';
import { configureSortModule } from 'olik/sort';
import { useEffect, useMemo, useRef, useState } from "react";
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { MediaQueries } from './dom-utils';
import { TagResult } from './tags-worker';

configureSortModule();

export type AppState = typeof initialAppState;

// export const StoreContext = createContext<Store<AppState> | undefined>(undefined);

export type CreateUseStoreHookLocal<S> = { local: Store<S>, state: DeepReadonly<S> };

export type CreateUseStoreHookGlobal<S> = { store: Store<S>, state: DeepReadonly<S> };

export const createUseStoreHook = <S extends BasicRecord>(store: Store<S>) => {

  return {
    useStore: () => {
      // get store context and create refs
      const refs = useRef({ store });
      const keys = useMemo(() => new Set<string>(), []);

      // ensure that store changes result in rerender
      const [, setN] = useState(0);
      useEffect(() => {
        const rootSubStores = [...keys].map(k => store[k]);
        const subStores = rootSubStores;
        const listeners = subStores.map(subStore => subStore!.$onChange(() => setN(nn => nn + 1)));
        return () => listeners.forEach(unsubscribe => unsubscribe());
      }, [keys]);

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
      }), [stateProxy]);
    },
    useLocalStore: <Key extends string, Patch extends BasicRecord>(key: Key, state: Patch) => {
      // get store context and create refs
      const refs = useRef({ store, key, state, subStore: undefined as CreateUseStoreHookLocal<Patch> | undefined });

      // ensure that store changes result in rerender
      const [, setN] = useState(0);
      useEffect(() => {
        return store[key]?.$onChange(() => setN(nn => nn + 1));
      }, [key]);

      // create a memo of the store, and set the new state if it doesn't exist
      const storeMemo = useMemo(() => {
        if (!store.$state[key])
          (store[key]! as SetNewNode).$setNew(refs.current.state);
        return store[key!]!;
      }, [key]);

      // destroy store as required. Note that care needed to be taken to avoid double-add-remove behavior in React strict mode
      const effectRun = useRef(false);
      useEffect(() => {
        effectRun.current = true;
        if (!store.$state[key])
          (store[key]! as SetNewNode).$setNew(refs.current.state);
        return () => {
          effectRun.current = false;
          Promise.resolve().then(() => {
            if (!effectRun.current)
              store[key].$delete();
          }).catch(console.error);
        }
      }, [key]);

      return useMemo(() => new Proxy({} as CreateUseStoreHookLocal<Patch>, {
        get(_, p: string) {
          if (p === 'state')
            return storeMemo.$state;
          if (p === 'local')
            return storeMemo;
          throw new Error(`Property ${p} does not exist on store`);
        },
      }), [storeMemo]);
    },
    useDerivation: function <T extends object | SortableProperty>(derivable: SortMemo<T> | Derivation<T[]>) {
      const [result, setResult] = useState(derivable.$state);
      useEffect(() => derivable.$onChange(items => setResult(items)), [derivable]);
      return result;
    },
  };
}

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

export const notesSorted = store.notes.$createSortedList.$withId.id.$sortedBy.dateUpdated.$descending();

export const { useStore, useLocalStore, useDerivation } = createUseStoreHook(store);
