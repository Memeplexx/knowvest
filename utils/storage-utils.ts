import { indexedDbState } from "./store-utils";


const openDatabase = () => indexedDB.open('knowvest', 1);
const eventTarget = <T = IDBOpenDBRequest>(event: Event) => event.target as T;

export const writeToDb = <TableName extends keyof typeof indexedDbState, Records extends typeof indexedDbState[TableName]>(
  tableName: TableName,
  tableRecords: Records
) => new Promise<void>((resolve, reject) => {
  if (!tableRecords.length)
    return resolve();
  const request = openDatabase();
  request.onsuccess = event => {
    const db = eventTarget(event).result;
    const transaction = db.transaction([tableName], 'readwrite');
    const objectStore = transaction.objectStore(tableName);
    tableRecords
      .filter(record => record !== null)
      .forEach(record => objectStore.put(record).onerror = error => console.error('Error adding data: ', error));
    transaction.oncomplete = () => {
      resolve();
      db.close();
    }
  };
  request.onerror = (event) => {
    reject(event);
  }
});

export const deleteFromDb = <TableName extends keyof typeof indexedDbState>(
  tableName: TableName,
  ids: number[]
) => new Promise<void>((resolve, reject) => {
  if (!ids.length)
    return resolve();
  const request = openDatabase();
  request.onsuccess = event => {
    const db = eventTarget(event).result;
    const transaction = db.transaction([tableName], 'readwrite');
    const objectStore = transaction.objectStore(tableName);
    ids
      .filter(id => id !== null)
      .forEach(id => objectStore.delete(id).onerror = error => console.error('Error adding data: ', error));
    transaction.oncomplete = () => {
      resolve();
      db.close();
    }
  };
  request.onerror = (event) => {
    reject(event);
  }
});

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