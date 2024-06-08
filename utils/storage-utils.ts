import { indexedDbState } from "./store-utils";


const openDatabase = () => indexedDB.open('knowvest', 1);
const eventTarget = <T = IDBOpenDBRequest>(event: Event) => event.target as T;

export const writeToDb = <
  TableName extends keyof typeof indexedDbState,
  Records extends typeof indexedDbState[TableName]
>(
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

export const deleteFromDb = <
  TableName extends keyof typeof indexedDbState
>(
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

export const readFromDb = <
  TableName extends keyof typeof indexedDbState,
  Records extends typeof indexedDbState[TableName]
>(
  tableName: TableName
) => new Promise<Records>(resolve => {
  const request = openDatabase();
  request.onsuccess = (event) => {
    const db = eventTarget(event).result;
    const trans = db.transaction([tableName], 'readonly');
    const store = trans.objectStore(tableName);
    const index = store.index('dateUpdated');
    const cursorRequest = index.openCursor(null, 'prev');
    const res = new Array<unknown>();
    cursorRequest.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        res.push(cursor.value);
        cursor.continue();
      } else {
        resolve(res as Records);
      }
    };
  };
  request.onerror = (event) => {
    console.error('indexedDB: onerror', event.target);
  }
  request.onerror = event => {
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
    Object.keysTyped(indexedDbState)
      .map(tableName => request.transaction!.objectStore(tableName))
      .filter(objectStore => !objectStore.indexNames.contains('dateUpdated'))
      .forEach(objectStore => {
        console.log('Adding index');
        objectStore.createIndex('dateUpdated', 'dateUpdated', { unique: false });
      });
  };
  request.onsuccess = () => {
    resolve();
  };
  request.onerror = event => {
    console.error('indexedDB: onerror', event.target);
  }
});
