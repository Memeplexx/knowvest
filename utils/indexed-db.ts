import { database } from "./constants";
import { WriteToIndexedDBArgs } from "./types";

export const indexeddb = {
  write: (records: WriteToIndexedDBArgs) => {
    return new Promise<void>((resolve, reject) => {
      (Object.keys(records) as Array<keyof WriteToIndexedDBArgs>)
        .filter(tableName => !!database[tableName])
        .forEach((tableName, index, array) => {
          const request = indexedDB.open('knowvest', 1);
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([tableName], 'readwrite');
            const objectStore = transaction.objectStore(tableName);
            const tableRecord = records[tableName]!;
            const tableRecords = Array.isArray(tableRecord) ? tableRecord : [tableRecord];
            tableRecords.forEach(record => {
              if (record === null) { return; }
              const addRequest = objectStore.put(record);
              addRequest.onerror = (error: unknown) => console.error('Error adding data: ', error);
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
    return new Promise<typeof database>(resolveOuter => {
      const request = indexedDB.open('knowvest', 1);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const objectStoreNames = Array.from(db.objectStoreNames) as Array<keyof typeof database>;
        const readDatabasePromise = new Promise<typeof database>((resolve, reject) => {
          const transaction = db.transaction(objectStoreNames, 'readonly');
          const results = { ...database };
          const readObjectStore = (tableName: keyof typeof database) => new Promise<void>((resolveObjectStore, rejectObjectStore) => {
            const objectStore = transaction.objectStore(tableName);
            const getAllRequest = objectStore.getAll();
            getAllRequest.onsuccess = (event) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              results[tableName] = (event.target as IDBOpenDBRequest).result as any;
              resolveObjectStore();
            };
            getAllRequest.onerror = (event) => rejectObjectStore((event.target as IDBOpenDBRequest).error);
          })
          Promise.all(objectStoreNames.map(readObjectStore))
            .then(() => resolve(results))
            .catch((error) => reject(error))
            .finally(() => transaction.oncomplete = () => db.close());
        });
        readDatabasePromise
          .then((results) => resolveOuter(results))
          .catch((error) => console.error('Error reading database:', error));
      };
      request.onerror = (event) => {
        console.error('indexedDB: onerror', event.target);
      }
    })
  },
  initialize: () => {
    return new Promise<void>(resolve => {

      const request = indexedDB.open('knowvest', 1);

      request.onupgradeneeded = (event) => {
        console.log('indexedDB: onupgradeneeded', event);
        const db = (event.target as IDBOpenDBRequest).result;
        (Object.keys(database) as Array<keyof typeof database>)
          .filter(tableName => !db.objectStoreNames.contains(tableName))
          .forEach((tableName) => {
            console.log('Creating table:', tableName);
            db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: false });
          });
      };

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('indexedDB: onerror', event.target);
      }
    })
  }

}