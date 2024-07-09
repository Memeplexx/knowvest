import { initialize } from "@/actions/session";
import { NoteDTO, TagDTO, UserDTO } from "@/actions/types";
import { PromiseObject } from "@/utils/logic-utils";
import { useComponent } from "@/utils/react-utils";
import { deleteFromDb, initializeDb, readFromDb, writeToDb } from "@/utils/storage-utils";
import { store, useStore } from "@/utils/store-utils";
import { mobileBreakPoint } from "@/utils/style-utils";
import { useTextSearcher } from "@/utils/text-search-context";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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
  const textSearcher = useTextSearcher();
  const result = { isReady: component.hasCompletedAsyncProcess, showMenu, routerPathName, isMobileWidth, containerWithStickyHeaderRef };

  // Listen for changes to the window width and update the store
  useEffect(() => {
    const listener = () => {
      const isMobileWidth = window.innerWidth < parseFloat(mobileBreakPoint);
      if (store.$state.isMobileWidth === isMobileWidth) return;
      store.isMobileWidth.$set(isMobileWidth);
    }
    window.addEventListener('resize', listener);
    listener();
    return () => window.removeEventListener('resize', listener);
  }, []);

  // Log user out if session expired
  const session = useSession();

  // Do not continue under certain conditions
  if (!component.isMounted)
    return result;
  if (!session.data)
    return result;
  if (component.hasStartedAsyncProcess)
    return result;

  void async function initializeData() {
    component.startAsyncProcess();
    await initializeDb(session.data.user!.email!);
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
      await writeToDb('notes', [apiResponse.firstNote]);
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

    // Ensure that changes to note tags in worker are sent to the store
    // TODO: Consider sending this data to the IndexedDB also.
    let first = true;
    textSearcher.onNoteTagsUpdated(data => {
      const { searchResults, activeNoteId } = store.$state;
      data
        .filter(({ noteId, matches }) => JSON.stringify(matches) !== JSON.stringify(searchResults[noteId]))
        .forEach(function receiveSearchResults({ noteId, matches }) {
          const currentNoteTagsForNote = searchResults.filter(nt => nt.noteId === noteId);
          const toRemove = currentNoteTagsForNote.filter(nt => !matches.some(t => t.tagId === nt.tagId && nt.from === t.from && nt.to === t.to));
          const toInsert = matches.filter(t => !currentNoteTagsForNote.some(nt => nt.tagId === t.tagId && nt.from === t.from && nt.to === t.to));
          if (toRemove.length)
            store.searchResults
              .$filter.noteId.$eq(noteId)
              .$and.tagId.$in(toRemove.map(t => t.tagId).distinct())
              .$and.from.$in(toRemove.map(t => t.from).distinct())
              .$and.to.$in(toRemove.map(t => t.to).distinct())
              .$delete();
          if (toInsert.length)
            store.searchResults.$pushMany(toInsert.map(t => ({ ...t, noteId })));
        });
      if (!first) return;
      first = false;
      store.synonymIds.$set(data.find(e => e.noteId === activeNoteId)!.matches.map(t => t.synonymId!).distinct().sort((a, b) => a - b));
      component.completeAsyncProcess();
    });

    // Send the tags worker the initial data
    const sanitizeNote = (note: NoteDTO) => ({ ...note, text: note.text.toLowerCase() });
    const sanitizeTag = (tag: TagDTO) => ({ tagId: tag.id, synonymId: tag.synonymId, text: tag.text.toLowerCase() });
    textSearcher.initialize({ notes: store.$state.notes.map(sanitizeNote), tags: store.$state.tags.map(sanitizeTag) });

    // Ensure that changes to tags in the store are sent to the worker
    component.listen = store.tags.$onArray.$inserted(inserted => textSearcher.addTags(inserted.map(sanitizeTag)));
    component.listen = store.tags.$onArray.$deleted(deleted => textSearcher.removeTags(deleted.map(t => t.id)));
    component.listen = store.tags.$onArray.$updated(updated => textSearcher.updateTags(updated.map(sanitizeTag)));

    // Ensure that changes to notes in the store are sent to the worker
    component.listen = store.notes.$onArray.$inserted(inserted => textSearcher.addNotes(inserted.map(sanitizeNote)));
    component.listen = store.notes.$onArray.$deleted(deleted => deleted.forEach(n => textSearcher.removeNote(n.id)));
    component.listen = store.notes.$onArray.$updated(updated => updated.map(sanitizeNote).forEach(data => textSearcher.updateNote(data)));

    // Ensure that the indexedDB is updated when the store changes
    component.listen = store.notes.$onArray.$deleted(deleted => deleteFromDb('notes', deleted.map(n => n.id)));
    component.listen = store.notes.$onArray.$inserted(inserted => writeToDb('notes', inserted));
    component.listen = store.notes.$onArray.$updated(updated => writeToDb('notes', updated));

    component.listen = store.tags.$onArray.$deleted(deleted => deleteFromDb('tags', deleted.map(t => t.id)));
    component.listen = store.tags.$onArray.$inserted(inserted => writeToDb('tags', inserted));
    component.listen = store.tags.$onArray.$updated(updated => writeToDb('tags', updated));

    component.listen = store.synonymGroups.$onArray.$deleted(deleted => deleteFromDb('synonymGroups', deleted.map(p => p.id)));
    component.listen = store.synonymGroups.$onArray.$inserted(inserted => writeToDb('synonymGroups', inserted));
    component.listen = store.synonymGroups.$onArray.$updated(updated => writeToDb('synonymGroups', updated));

    component.listen = store.groups.$onArray.$deleted(deleted => deleteFromDb('groups', deleted.map(p => p.id)));
    component.listen = store.groups.$onArray.$inserted(inserted => writeToDb('groups', inserted));
    component.listen = store.groups.$onArray.$updated(updated => writeToDb('groups', updated));

    component.listen = store.flashCards.$onArray.$deleted(deleted => deleteFromDb('flashCards', deleted.map(p => p.id)));
    component.listen = store.flashCards.$onArray.$inserted(inserted => writeToDb('flashCards', inserted));
    component.listen = store.flashCards.$onArray.$updated(updated => writeToDb('flashCards', updated));
  }();

  return result;
}

