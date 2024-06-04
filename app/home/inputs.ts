import { initialize } from "@/actions/session";
import { UserDTO } from "@/actions/types";
import { MediaQueries, useMediaQueryListener, useResizeListener } from "@/utils/dom-utils";
import { useComponent } from "@/utils/react-utils";
import { initializeDb, readFromDb, writeToDb } from "@/utils/storage-utils";
import { useLocalStore, useStore } from "@/utils/store-utils";
import { TagsWorker } from "@/utils/tags-worker";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { initialState } from "./constants";


export const useInputs = () => {

  const { store } = useStore();
  const { local, state } = useLocalStore('home', initialState);
  const component = useComponent();
  const result = { store, local, ...state, isDone: component.isDone };
  useMediaQueryListener(store.mediaQuery.$set);

  // Update header visibility as required
  useResizeListener(() => {
    if (window.innerWidth >= MediaQueries.md && !local.$state.headerExpanded)
      local.headerExpanded.$set(true);
    else if (window.innerWidth < MediaQueries.md && local.$state.headerExpanded)
      local.headerExpanded.$set(false);
  });

  // Log user out if session expired
  const session = useSession();
  if (session.status === 'unauthenticated')
    redirect('/?session-expired=true');

  // Do not continue under certain conditions
  if (!component.isMounted)
    return result;
  if (!session.data)
    return result;
  if (!component.isPristine)
    return result;

  component.start();
  void async function initializeData() {
    console.log('Initializing data');
    await initializeDb();
    const databaseData = await readFromDb();
    const notesFromDbSorted = databaseData.notes.sort((a, b) => b.dateUpdated!.getTime() - a.dateUpdated!.getTime());
    const apiResponse = await initialize({ ...session.data.user as UserDTO, after: notesFromDbSorted[0]?.dateUpdated ?? null });
    if (apiResponse.status === 'USER_CREATED') {
      store.$patch({
        ...databaseData,
        notes: [apiResponse.firstNote],
        activeNoteId: apiResponse.firstNote.id
      });
      console.log('User NOT found and data initialized');
      return;
    }
    await Promise.all([
      writeToDb('notes', apiResponse.notes),
      writeToDb('tags', apiResponse.tags),
      writeToDb('groups', apiResponse.groups),
      writeToDb('synonymGroups', apiResponse.synonymGroups),
      writeToDb('flashCards', apiResponse.flashCards)
    ]);
    store.$patch({ // NOTE: Database might be empty. If so, use the first note from the API response
      activeNoteId: notesFromDbSorted[0]?.id ?? apiResponse.notes.reduce((prev, curr) => prev!.dateViewed! > curr.dateViewed! ? prev : curr, apiResponse.notes[0])!.id,
      notes: [...databaseData.notes, ...apiResponse.notes].filter(n => 'isArchived' in n ? !n.isArchived : true),
      tags: [...databaseData.tags, ...apiResponse.tags].filter(t => 'isArchived' in t ? !t.isArchived : true),
      groups: [...databaseData.groups, ...apiResponse.groups].filter(g => 'isArchived' in g ? !g.isArchived : true),
      synonymGroups: [...databaseData.synonymGroups, ...apiResponse.synonymGroups].filter(sg => 'isArchived' in sg ? !sg.isArchived : true),
      flashCards: [...databaseData.flashCards, ...apiResponse.flashCards].filter(fc => 'isArchived' in fc ? !fc.isArchived : true),
    });
    console.log('User found and data initialized');
  }();

  // Configure object which will be passed to the consumer
  console.log('Initializing worker');
  const worker = new Worker(new URL('../../utils/tags-worker.ts', import.meta.url)) as TagsWorker;
  component.listen = worker.terminate;

  // Ensure that changes to note tags in worker are sent to the store
  // TODO: Consider sending this data to the IndexedDB also.
  let first = true;
  worker.onmessage = event => {
    event.data.forEach(({ noteId, tags }) => {
      if (JSON.stringify(tags) !== JSON.stringify(store.$state.noteTags[noteId])) {
        store.noteTags[noteId]!.$set(tags);
      }
    });
    if (first) {
      first = false;
      const synonymIds = event.data.find(e => e.noteId === store.$state.activeNoteId)!.tags.map(t => t.synonymId!);
      store.synonymIds.$set(synonymIds);
      component.done();
    }
  }

  // Send the tags worker the initial data
  const { notes, tags } = store.$state;
  worker.postMessage({
    type: 'initialize',
    data: {
      notes,
      tags: tags.map(t => ({ id: t.id, text: t.text, synonymId: t.synonymId }))
    }
  });

  // Ensure that changes to tags in the store are sent to the worker
  component.listen = store.tags.$onChange((tags, previousTags) => {
    const previousTagIds = previousTags.map(t => t.id);
    const tagsToAdd = tags.filter(t => !previousTagIds.includes(t.id));
    const tagIdsToRemove = previousTagIds.filter(id => !tags.some(t => t.id === id));
    const tagsToUpdate = tags.filter(t => previousTagIds.includes(t.id) && previousTags.find(pt => pt.id === t.id)!.text !== t.text);
    if (tagsToAdd.length) {
      previousTagIds.push(...tagsToAdd.map(t => t.id));
      worker.postMessage({ type: 'addTags', data: tagsToAdd });
    }
    if (tagIdsToRemove.length) {
      previousTagIds.remove(e => tagIdsToRemove.includes(e));
      worker.postMessage({ type: 'removeTags', data: tagIdsToRemove });
    }
    if (tagsToUpdate.length) {
      worker.postMessage({ type: 'updateTags', data: tagsToUpdate });
    }
  });

  // Ensure that changes to notes in the store are sent to the worker
  component.listen = store.notes.$onChange((notes, previousNotes) => {
    const previousNoteIds = previousNotes.map(n => n.id);
    const notesToAdd = notes.filter(n => !previousNoteIds.includes(n.id));
    const noteIdsToRemove = previousNoteIds.filter(id => !notes.some(n => n.id === id));
    const notesToUpdate = notes.filter(n => previousNoteIds.includes(n.id) && previousNotes.find(pn => pn.id === n.id)!.text !== n.text);
    if (notesToAdd.length) {
      previousNoteIds.push(...notesToAdd.map(n => n.id));
      worker.postMessage({ type: 'addNotes', data: notesToAdd });
    }
    if (noteIdsToRemove.length) {
      previousNoteIds.remove(e => noteIdsToRemove.includes(e));
      noteIdsToRemove.forEach(id => worker.postMessage({ type: 'removeNote', data: id }));
    }
    notesToUpdate.forEach(n => worker.postMessage({ type: 'updateNote', data: n }));
  });

  // Ensure that the indexedDB is updated when the store changes
  component.listen = store.notes
    .$onChange(async (current, previous) => await writeToDb('notes', current.filter(t => !previous.includes(t))));
  component.listen = store.tags
    .$onChange(async (current, previous) => await writeToDb('tags', current.filter(t => !previous.includes(t))));
  component.listen = store.synonymGroups
    .$onChange(async (current, previous) => await writeToDb('synonymGroups', current.filter(t => !previous.includes(t))));
  component.listen = store.groups
    .$onChange(async (current, previous) => await writeToDb('groups', current.filter(t => !previous.includes(t))));
  component.listen = store.flashCards
    .$onChange(async (current, previous) => await writeToDb('flashCards', current.filter(t => !previous.includes(t))));

  return result;
}
