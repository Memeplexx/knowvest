import { FlashCardDTO, GroupDTO, NoteDTO, SynonymGroupDTO, TagDTO } from "@/actions/types";
import { DeepReadonly } from "olik";


let userEmailValue: string;
const openDatabase = () => indexedDB.open(`knowvest-${userEmailValue}`, 1);
const eventTarget = <T = IDBOpenDBRequest>(event: Event) => event.target as T;

const dbInitialState = {
  notes: new Array<NoteDTO>(),
  tags: new Array<TagDTO>(),
  groups: new Array<GroupDTO>(),
  synonymGroups: new Array<SynonymGroupDTO>(),
  flashCards: new Array<FlashCardDTO>(),
} as const;
type DbState = typeof dbInitialState;

export const writeToDb = <
  TableName extends keyof DbState,
  Records extends DeepReadonly<DbState[TableName]>
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
  TableName extends keyof DbState,
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
  TableName extends keyof DbState,
  Records extends DeepReadonly<DbState[TableName]>
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
        resolve(res as unknown as Records);
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

export const initializeDb = (
  userEmail: string,
) => new Promise<void>(resolve => {
  userEmailValue = userEmail;
  const request = openDatabase();
  request.onupgradeneeded = (event) => {
    console.log('indexedDB: onupgradeneeded', event);
    const db = eventTarget(event).result;
    Object.keysTyped(dbInitialState)
      .filter(tableName => !db.objectStoreNames.contains(tableName))
      .forEach(tableName => {
        console.log('Creating table:', tableName);
        db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: false });
      });
    Object.keysTyped(dbInitialState)
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
