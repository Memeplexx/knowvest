import { RepsertableObject, Store } from "olik";
import { AppState, indexedDbState } from "./store-utils";


type WriteToIndexedDBArgs = Partial<{ [tableName in keyof typeof indexedDbState]: null | typeof indexedDbState[tableName] | typeof indexedDbState[tableName][0] }>;

const openDatabase = () => indexedDB.open('knowvest', 1);
const eventTarget = <T = IDBOpenDBRequest>(event: Event) => event.target as T;

export const writeToStoreAndDb = <S extends AppState>(
  store: Store<S>,
  records: WriteToIndexedDBArgs
) => new Promise<void>((resolve, reject) => Object.keysTyped(records)
  .filter(tableName => !!indexedDbState[tableName])
  .forEach(function writeToDB(tableName, index, array) {
    const tableRecord = records[tableName]!;
    const tableRecords = Array.isArray(tableRecord) ? tableRecord : tableRecord === null ? [] : [tableRecord];
    if (!tableRecords.length)
      return resolve();

    // update records in store
    const toUpdate = tableRecords.filter(r => !(r as typeof r & { isArchived: boolean }).isArchived);
    !!toUpdate.length && (store[tableName].$mergeMatching.id as RepsertableObject<{ id: number }, { id: number }>).$with(toUpdate as Array<{ id: number }>);

    // delete records from store
    const toDelete = tableRecords.filter(r => (r as typeof r & { isArchived: boolean }).isArchived).map(r => r.id);
    !!toDelete.length && (store[tableName] as unknown as Store<{ id: number }[]>).$filter.id.$in(toDelete).$delete();

    const request = openDatabase();
    request.onsuccess = event => {
      const db = eventTarget(event).result;
      const transaction = db.transaction([tableName], 'readwrite');
      const objectStore = transaction.objectStore(tableName);
      tableRecords
        .filter(record => record !== null)
        .forEach(record => objectStore.put(record).onerror = error => console.error('Error adding data: ', error));
      transaction.oncomplete = () => {
        if (index === array.length - 1)
          resolve();
        db.close();
      }
    };
    request.onerror = (event) => {
      reject(event);
    }
  }));

export const readFromDb = () => new Promise<typeof indexedDbState>(resolveOuter => {
  const request = openDatabase();
  request.onsuccess = (event) => {
    const db = eventTarget(event).result;
    const objectStoreNames = Array.from(db.objectStoreNames) as Array<keyof typeof indexedDbState>;
    const readDatabasePromise = new Promise<typeof indexedDbState>((resolve, reject) => {
      const transaction = db.transaction(objectStoreNames, 'readonly');
      const results = { ...indexedDbState };
      const readObjectStore = <T extends keyof typeof indexedDbState>(tableName: T) => new Promise<void>((resolveObjectStore, rejectObjectStore) => {
        const objectStore = transaction.objectStore(tableName);
        const getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = event => {
          results[tableName] = eventTarget<{ result: (typeof indexedDbState)[T] }>(event).result;
          resolveObjectStore();
        };
        getAllRequest.onerror = event => {
          rejectObjectStore(eventTarget(event).error);
        }
      })
      Promise.all(objectStoreNames.map(readObjectStore))
        .then(() => resolve(Object.keysTyped(results).mapToObject(k => k, k => results[k].filter(r => !(r as typeof r & { isArchived: boolean }).isArchived)) as typeof indexedDbState))
        .catch(error => reject(error))
        .finally(() => transaction.oncomplete = () => db.close());
    });
    readDatabasePromise
      .then(results => resolveOuter(results))
      .catch(error => console.error('Error reading database:', error));
  };
  request.onerror = (event) => {
    console.error('indexedDB: onerror', event.target);
  }
});

export const initializeDb = () => new Promise<void>(resolve => {
  const request = openDatabase();
  request.onupgradeneeded = (event) => {
    console.log('indexedDB: onupgradeneeded', event);
    const db = eventTarget(event).result;
    Object.keysTyped(indexedDbState)
      .filter(tableName => !db.objectStoreNames.contains(tableName))
      .forEach(tableName => {
        console.log('Creating table:', tableName);
        db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: false });
      });
  };
  request.onsuccess = () => {
    resolve();
  };
  request.onerror = event => {
    console.error('indexedDB: onerror', event.target);
  }
});
