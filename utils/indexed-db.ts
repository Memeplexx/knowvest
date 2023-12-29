import { RepsertableObject, Store } from "olik";
import { AppState, indexedDbState } from "./constants";
import { WriteToIndexedDBArgs } from "./types";


const openDatabase = () => indexedDB.open('knowvest', 1);
const keysTyped = <O extends object>(obj: O) => Object.keys(obj) as Array<keyof O>;
const eventTarget = (event: Event) => event.target as IDBOpenDBRequest;

export const indexeddb = {
  write: (store: Store<AppState>, records: WriteToIndexedDBArgs) => {
    return new Promise<void>((resolve, reject) => {
      keysTyped(records)
        .filter(tableName => !!indexedDbState[tableName])
        .forEach((tableName, index, array) => {
          const tableRecord = records[tableName]!;
          const tableRecords = Array.isArray(tableRecord) ? tableRecord : [tableRecord];
          (store[tableName].$mergeMatching.id as RepsertableObject<{ id: number }, { id: number }>).$withMany(tableRecords);
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
  },
  read: () => {
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
            .then(() => resolve(results))
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
  },
  initialize: () => {
    return new Promise<void>(resolve => {
      const request = openDatabase();
      request.onupgradeneeded = (event) => {
        console.log('indexedDB: onupgradeneeded', event);
        const db = eventTarget(event).result;
        keysTyped(indexedDbState)
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
  }

}