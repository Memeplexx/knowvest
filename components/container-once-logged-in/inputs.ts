import { initialize } from "@/actions/session";
import { NoteDTO, TagDTO, UserDTO } from "@/actions/types";
import { PromiseObject } from "@/utils/logic-utils";
import { useComponent } from "@/utils/react-utils";
import { deleteFromDb, initializeDb, readFromDb, writeToDb } from "@/utils/storage-utils";
import { store, useStore } from "@/utils/store-utils";
import { TagsWorker } from "@/utils/tags-worker";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { configureDevtools } from "olik/devtools";
import { useEffect, useRef } from "react";
import { ContainerWithStickyHeaderHandle } from "../container-with-sticky-header/constants";


export const useInputs = () => {

  if (typeof (navigator) !== 'undefined' && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    configureDevtools();

  const routerPathName = usePathname()!;
  const { showMenu, isMobileWidth } = useStore();
  const component = useComponent();
  const containerWithStickyHeaderRef = useRef<ContainerWithStickyHeaderHandle>(null);
  const result = { isReady: component.hasCompletedAsyncProcess, showMenu, routerPathName, isMobileWidth, containerWithStickyHeaderRef };

  // Listen for changes to the window width and update the store
  useEffect(() => {
    const listener = () => {
      const isMobileWidth = window.innerWidth < 768;
      if (store.$state.isMobileWidth === isMobileWidth) return;
      store.isMobileWidth.$set(isMobileWidth);
    }
    window.addEventListener('resize', listener);
    listener();
    return () => window.removeEventListener('resize', listener);
  }, []);

  // Log user out if session expired
  const session = useSession();
  if (session.status === 'unauthenticated')
    redirect('/?session-expired=true');

  // Do not continue under certain conditions
  if (!component.isMounted)
    return result;
  if (!session.data)
    return result;
  if (component.hasStartedAsyncProcess)
    return result;

  void async function initializeData() {
    component.startAsyncProcess();
    await initializeDb();
    if (store.$state.activeNoteId)
      return component.completeAsyncProcess();
    const databaseData = await PromiseObject({
      notes: readFromDb('notes'),
      tags: readFromDb('tags'),
      groups: readFromDb('groups'),
      synonymGroups: readFromDb('synonymGroups'),
      flashCards: readFromDb('flashCards')
    });
    const apiResponse = await initialize({
      user: session.data.user as UserDTO,
      after: {
        notes: databaseData.notes[0]?.dateUpdated ?? null,
        tags: databaseData.tags[0]?.dateUpdated ?? null,
        groups: databaseData.groups[0]?.dateUpdated ?? null,
        synonymGroups: databaseData.synonymGroups[0]?.dateUpdated ?? null,
        flashCards: databaseData.flashCards[0]?.dateUpdated ?? null
      }
    });
    if (apiResponse.status === 'USER_CREATED') {
      store.$patch({
        notes: [apiResponse.firstNote],
        activeNoteId: apiResponse.firstNote.id
      });
    } else {
      await Promise.all([
        writeToDb('notes', apiResponse.notes),
        writeToDb('tags', apiResponse.tags),
        writeToDb('groups', apiResponse.groups),
        writeToDb('synonymGroups', apiResponse.synonymGroups),
        writeToDb('flashCards', apiResponse.flashCards),
      ]);
      const filterUnArchived = <T extends object>(item: T) => 'isArchived' in item ? !item.isArchived : true;
      const notes = [...databaseData.notes, ...apiResponse.notes].filter(filterUnArchived);
      const tags = [...databaseData.tags, ...apiResponse.tags].filter(filterUnArchived);
      const groups = [...databaseData.groups, ...apiResponse.groups].filter(filterUnArchived);
      const synonymGroups = [...databaseData.synonymGroups, ...apiResponse.synonymGroups].filter(filterUnArchived);
      const flashCards = [...databaseData.flashCards, ...apiResponse.flashCards].filter(filterUnArchived)
      const activeNoteId = notes[0]!.id;
      store.$patch({ activeNoteId, notes, tags, groups, synonymGroups, flashCards });
    }

    // Configure object which will be passed to the consumer
    const worker = new Worker(new URL('../../utils/tags-worker.ts', import.meta.url)) as TagsWorker;
    component.listen = () => worker.terminate();

    // Ensure that changes to note tags in worker are sent to the store
    // TODO: Consider sending this data to the IndexedDB also.
    let first = true;
    worker.onmessage = event => {
      event.data
        .filter(({ noteId, tags }) => JSON.stringify(tags) !== JSON.stringify(store.$state.noteTags[noteId]))
        .forEach(({ noteId, tags }) => {
          const currentNoteTagsForNote = store.$state.noteTags.filter(nt => nt.noteId === noteId);
          const toRemove = currentNoteTagsForNote.filter(nt => !tags.some(t => t.id === nt.id && nt.from === t.from && nt.to === t.to));
          const toInsert = tags.filter(t => !currentNoteTagsForNote.some(nt => nt.id === t.id && nt.from === t.from && nt.to === t.to));
          if (toRemove.length)
            store.noteTags
              .$filter.noteId.$eq(noteId)
              .$and.id.$in(toRemove.map(t => t.id).distinct())
              .$and.from.$in(toRemove.map(t => t.from).distinct())
              .$and.to.$in(toRemove.map(t => t.to).distinct())
              .$delete();
          if (toInsert.length)
            store.noteTags.$pushMany(toInsert.map(t => ({ ...t, noteId })));
        });
      if (!first) return;
      first = false;
      const synonymIds = event.data.find(e => e.noteId === store.$state.activeNoteId)!.tags.map(t => t.synonymId!).distinct();
      store.synonymIds.$set(synonymIds);
      component.completeAsyncProcess();
    }

    // Send the tags worker the initial data
    const sanitizeNote = (note: NoteDTO) => ({ ...note, text: note.text.toLowerCase() });
    const sanitizeTag = (tag: TagDTO) => ({ id: tag.id, synonymId: tag.synonymId, text: tag.text.toLowerCase() });
    worker.postMessage({
      type: 'initialize',
      data: { notes: store.$state.notes.map(sanitizeNote), tags: store.$state.tags.map(sanitizeTag) }
    });

    // Ensure that changes to tags in the store are sent to the worker
    component.listen = store.tags.$onChangeArray(({ deleted, inserted, updated }) => {
      worker.postMessage({ type: 'addTags', data: inserted.map(sanitizeTag) });
      worker.postMessage({ type: 'removeTags', data: deleted.map(t => t.id) });
      worker.postMessage({ type: 'updateTags', data: updated.map(sanitizeTag) });
    })

    // Ensure that changes to notes in the store are sent to the worker
    component.listen = store.notes.$onChangeArray(({ deleted, inserted, updated }) => {
      worker.postMessage({ type: 'addNotes', data: inserted.map(sanitizeNote) });
      deleted.forEach(n => worker.postMessage({ type: 'removeNote', data: n.id }));
      updated.map(sanitizeNote).forEach(data => worker.postMessage({ type: 'updateNote', data }));
    });

    // Ensure that the indexedDB is updated when the store changes
    component.listen = store.notes.$onChangeArray(async ({ deleted, inserted, updated }) => {
      await writeToDb('notes', [...inserted, ...updated]);
      await deleteFromDb('notes', deleted.map(n => n.id));
    })
    component.listen = store.tags.$onChangeArray(async ({ deleted, inserted, updated }) => {
      await writeToDb('tags', [...inserted, ...updated]);
      await deleteFromDb('tags', deleted.map(t => t.id));
    });
    component.listen = store.synonymGroups.$onChangeArray(async ({ deleted, inserted, updated }) => {
      await writeToDb('synonymGroups', [...inserted, ...updated]);
      await deleteFromDb('synonymGroups', deleted.map(p => p.id));
    });
    component.listen = store.groups.$onChangeArray(async ({ deleted, inserted, updated }) => {
      await writeToDb('groups', [...inserted, ...updated]);
      await deleteFromDb('groups', deleted.map(p => p.id));
    });
    component.listen = store.flashCards.$onChangeArray(async ({ deleted, inserted, updated }) => {
      await writeToDb('flashCards', [...inserted, ...updated]);
      await deleteFromDb('flashCards', deleted.map(p => p.id));
    });
  }();

  return result;
}
