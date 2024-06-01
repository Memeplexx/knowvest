import { WriteToIndexedDBArgs } from "./storage-provider";
import { indexedDbState } from "./store-utils";

const openDatabase = () => indexedDB.open('knowvest', 1);
const eventTarget = <T = IDBOpenDBRequest>(event: Event) => event.target as T;

onmessage = (event: MessageEvent<Incoming>) => {
  const { type, data } = event.data;
  switch (type) {
    case 'initializeDb': {
      const request = openDatabase();
      request.onupgradeneeded = (event) => {
        console.log('indexedDB: onupgradeneeded', event);
        const db = eventTarget(event).result;
        (Object.keys(indexedDbState) as Array<keyof typeof indexedDbState>)
          .filter(tableName => !db.objectStoreNames.contains(tableName))
          .forEach(tableName => {
            console.log('Creating table:', tableName);
            db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: false });
          });
      };
      request.onsuccess = () => {
        postMessage({ type: 'initializeDbResolve' });
      };
      request.onerror = event => {
        postMessage({ type: 'initializeDbReject', data: event });
      }
      break;
    }
    case 'readFromDb': {
      const request = openDatabase();
      request.onsuccess = (event) => {
        const db = eventTarget(event).result;
        const objectStoreNames = Array.from(db.objectStoreNames) as Array<keyof typeof indexedDbState>;
        const readDatabasePromise = new Promise<typeof indexedDbState>((resolve, reject) => {
          const transaction = db.transaction(objectStoreNames, 'readonly');
          const results = { ...indexedDbState };
          const readObjectStore = <T extends keyof typeof indexedDbState>(tableName: T) => new Promise<void>((resolve, reject) => {
            const objectStore = transaction.objectStore(tableName);
            const getAllRequest = objectStore.getAll();
            getAllRequest.onsuccess = event => {
              results[tableName] = eventTarget<{ result: (typeof indexedDbState)[T] }>(event).result;
              resolve();
            };
            getAllRequest.onerror = event => {
              reject(eventTarget(event).error);
            }
          })
          Promise.all(objectStoreNames.map(readObjectStore))
            .then(() => resolve((Object.keys(results) as Array<keyof typeof results>)
              .reduce((acc, curr) => {
                return Object.assign(acc, { [curr]: results[curr].filter(r => !(r as typeof r & { isArchived: boolean }).isArchived) });
              }, {} as typeof indexedDbState)))
            .catch(error => reject(error))
            .finally(() => transaction.oncomplete = () => db.close());
        });
        readDatabasePromise
          .then(results => postMessage({ type: 'readFromDbResolve', data: results }))
          .catch(error => console.error('Error reading database:', error));
      };
      request.onerror = (event) => {
        postMessage({ type: 'readFromDbReject', data: event });
      }
      break;
    }
    case 'writeToDb': {
      (Object.keys(data) as Array<keyof typeof data>)
        .filter(tableName => !!indexedDbState[tableName])
        .forEach(function writeToDB(tableName, index, array) {
          const tableRecord = data[tableName]!;
          const tableRecords = Array.isArray(tableRecord) ? tableRecord : tableRecord === null ? [] : [tableRecord];
          if (!tableRecords.length)
            return postMessage({ type: 'writeToDbResolve' });
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
                postMessage({ type: 'writeToDbResolve' });
              db.close();
            }
          };
          request.onerror = (event) => {
            postMessage({ type: 'writeToDbReject', data: event });
          }
        });
      break;
    }
  }
};

export type Incoming
  = {
    type: 'initializeDb',
    data: null,
  }
  | {
    type: 'readFromDb',
    data: null,
  }
  | {
    type: 'writeToDb',
    data: WriteToIndexedDBArgs
  };

export type Outgoing
  = {
    type: 'initializeDbResolve',
    data: void,
  }
  | {
    type: 'initializeDbReject',
    data: Event,
  }
  | {
    type: 'readFromDbResolve',
    data: typeof indexedDbState
  }
  | {
    type: 'readFromDbReject',
    data: Event
  }
  | {
    type: 'writeToDbResolve',
    data: void,
  }
  | {
    type: 'writeToDbReject',
    data: Event,
  };

export type StorageWorker = Omit<Worker, 'postMessage' | 'onmessage'> & {
  postMessage: (message: Incoming) => void,
  onmessage: (event: MessageEvent<Outgoing>) => void
};