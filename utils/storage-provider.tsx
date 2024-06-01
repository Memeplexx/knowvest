"use client";
import { Filter, MergeMatching } from 'olik';
import { createContext, useContext, useEffect, useState } from "react";
import { StorageWorker } from './storage-worker';
import { indexedDbState, useStore } from './store-utils';


export type WriteToIndexedDBArgs = Partial<{ [tableName in keyof typeof indexedDbState]: null | typeof indexedDbState[tableName] | typeof indexedDbState[tableName][0] }>

export type StorageProvider = {
  /**
   * Initializes the IndexedDB
   */
  init: () => Promise<void>,
  /**
   * Reads data from the IndexedDB
   */
  read: () => Promise<typeof indexedDbState>,
  /**
   * Writes data to both the IndexedDB and the store
   */
  write: (records: WriteToIndexedDBArgs) => Promise<void>,
};

export const StorageContext = createContext<StorageProvider | null>(null);

export const useStorageContext = () => useContext(StorageContext)!

export default function StorageProvider({ children }: { children: React.ReactNode }) {

  const { store } = useStore();
  const [state, setState] = useState<StorageProvider | null>(null);

  useEffect(() => {

    // Configure object which will be passed to the consumer
    const worker = new Worker(new URL('./storage-worker.ts', import.meta.url)) as StorageWorker;
    let initializeDbPromiseResolve: () => void;
    let readFromDbPromiseResolve: (data: typeof indexedDbState) => void;
    let writeToDbPromiseResolve: () => void;
    let dataToWrite: WriteToIndexedDBArgs;
    const state: StorageProvider = {
      init: () => {
        worker.postMessage({ type: 'initializeDb', data: null });
        return new Promise<void>(resolve => initializeDbPromiseResolve = resolve);
      },
      read: () => {
        worker.postMessage({ type: 'readFromDb', data: null });
        return new Promise<typeof indexedDbState>(resolve => readFromDbPromiseResolve = resolve);
      },
      write: (records: WriteToIndexedDBArgs) => {
        dataToWrite = records;
        worker.postMessage({ type: 'writeToDb', data: records });
        return new Promise<void>(resolve => writeToDbPromiseResolve = resolve);
      },
    };

    // Handle incoming messages from worker
    worker.onmessage = event => {
      const { type, data } = event.data;
      switch (type) {
        case 'initializeDbResolve':
          initializeDbPromiseResolve();
          break;
        case 'readFromDbResolve':
          readFromDbPromiseResolve(data);
          break;
        case 'writeToDbResolve': {
          (Object.keys(dataToWrite) as Array<keyof typeof dataToWrite>)
            .filter(tableName => !!indexedDbState[tableName])
            .forEach(tableName => {
              const tableRecord = dataToWrite[tableName]!;
              const tableRecords = Array.isArray(tableRecord) ? tableRecord : tableRecord === null ? [] : [tableRecord];
              if (!tableRecords.length)
                return;
              const toUpdate = tableRecords.filter(r => !('isArchived' in r) || !r.isArchived);
              if (toUpdate.length)
                (store[tableName] as MergeMatching<{ id: number }>).$mergeMatching.id.$with(toUpdate);
              const toDelete = tableRecords.filter(r => 'isArchived' in r && r.isArchived).map(r => r.id);
              if (toDelete.length)
                (store[tableName] as unknown as Filter<{ id: number }[], 3>).$filter.id.$in(toDelete).$delete();
            });
          writeToDbPromiseResolve();
          break;
        }
      }
    };
    setState(state);

    // Cleanup
    return () => {
      worker.terminate();
    }
  }, [store]);

  return (
    <StorageContext.Provider
      value={state}
      children={children}
    />
  );
}

