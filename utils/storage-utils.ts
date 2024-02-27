import { RepsertableObject, Store } from "olik";
import { AppState, indexedDbState } from "./store-utils";


type WriteToIndexedDBArgs = Partial<{ [tableName in keyof typeof indexedDbState]: null | typeof indexedDbState[tableName] | typeof indexedDbState[tableName][0] }>;

const openDatabase = () => indexedDB.open('knowvest', 1);
const eventTarget = (event: Event) => event.target as IDBOpenDBRequest;

export const writeToStoreAndDb = (store: Store<AppState>, records: WriteToIndexedDBArgs) => {
  return new Promise<void>((resolve, reject) => {
    Object.keysTyped(records)
      .filter(tableName => !!indexedDbState[tableName])
      .forEach(function writeToDB(tableName, index, array) {
        const tableRecord = records[tableName]!;
        const tableRecords = Array.isArray(tableRecord) ? tableRecord : tableRecord === null ? [] : [tableRecord];
        if (!tableRecords.length) {
          return resolve();
        }

        // update records in store
        const toUpdate = tableRecords.filter(r => !(r as typeof r & { isArchived: boolean }).isArchived);
        !!toUpdate.length && (store[tableName].$mergeMatching.id as RepsertableObject<{ id: number }, { id: number }>).$with(toUpdate);

        // delete records from store
        const toDelete = tableRecords.filter(r => (r as typeof r & { isArchived: boolean }).isArchived).map(r => r.id);
        !!toDelete.length && (store[tableName] as unknown as Store<{ id: number }[]>).$filter.id.$in(toDelete).$delete();

        const request = openDatabase();
        request.onsuccess = event => {
          const db = eventTarget(event).result;
          const transaction = db.transaction([tableName], 'readwrite');
          const objectStore = transaction.objectStore(tableName);
          tableRecords.forEach(record => {
            if (record === null) { return; }
            const addRequest = objectStore.put(record);
            addRequest.onerror = error => {
              console.error('Error adding data: ', error);
            }
          });
          transaction.oncomplete = () => {
            const last = index === array.length - 1;
            if (last) {
              resolve();
            }
            db.close();
          }
        };
        request.onerror = (event) => {
          reject(event);
        }
      });
  });
};

export const readFromDb = () => {
  return new Promise<typeof indexedDbState>(resolveOuter => {
    const request = openDatabase();
    request.onsuccess = (event) => {
      const db = eventTarget(event).result;
      const objectStoreNames = Array.from(db.objectStoreNames) as Array<keyof typeof indexedDbState>;
      const readDatabasePromise = new Promise<typeof indexedDbState>((resolve, reject) => {
        const transaction = db.transaction(objectStoreNames, 'readonly');
        const results = { ...indexedDbState };
        const readObjectStore = (tableName: keyof typeof indexedDbState) => new Promise<void>((resolveObjectStore, rejectObjectStore) => {
          const objectStore = transaction.objectStore(tableName);
          const getAllRequest = objectStore.getAll();
          getAllRequest.onsuccess = event => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            results[tableName] = eventTarget(event).result as any;
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
  })
};

export const initializeDb = () => {
  return new Promise<void>(resolve => {
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
  })
};
