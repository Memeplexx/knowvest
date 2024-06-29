"use client";
import { BasicRecord, DeepReadonly, SetNewNode, Store, createStore } from 'olik';
import { createUseDerivationHooks } from 'olik-react';
import { configureSortModule } from 'olik/sort';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashCardDTO, GroupDTO, NoteDTO, NoteId, SynonymGroupDTO, SynonymId, TagDTO, TagId } from '../actions/types';
import { TagResult } from './tags-worker';

configureSortModule();

const initialState = {
  tags: new Array<TagDTO>(),
  notes: new Array<NoteDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
  configureTags: false as boolean | TagId,
  isMobileWidth: false,
  activeNoteId: 0 as NoteId,
  synonymIds: new Array<SynonymId>(),
  noteTags: new Array<TagResult & { noteId: NoteId }>(),
  showLoader: false,
  showMenu: false,
}

export const store = createStore(initialState);

export type AppStore = typeof store;






export function createUseStoreHooks<
  S extends BasicRecord
>(
  store: Store<S>,
) {
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

      return useMemo(() => new Proxy({} as DeepReadonly<S>, {
        get(_, p: string) {
          keys.add(p);
          return refs.current.store.$state[p]!;
        }
      }), [keys]);
    },

    useLocalStore: <Key extends string, Patch extends BasicRecord>(key: Key, state: Patch) => {
      // get store context and create refs
      const refs = useRef({ store, key, state, subStore: undefined as unknown });

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

      return useMemo(() => new Proxy({} as { local: Store<Patch>, state: DeepReadonly<Patch> }, {
        get(_, p: string) {
          if (p === 'state')
            return storeMemo.$state;
          if (p === 'local')
            return storeMemo;
          throw new Error(`Property ${p} does not exist on store`);
        },
      }), [storeMemo]);
    },
  }
}







export const { useStore, useLocalStore } = createUseStoreHooks(store);

export const notesSorted = store.notes.$createSortedList.$withId.id.$sortedBy.dateUpdated.$descending();

export const { useDerivations } = createUseDerivationHooks({ notesSorted });


